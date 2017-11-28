import {default as Papa} from 'papaparse'
import {geodeticToGrid, gridToGeodetic} from '../utils/geodetic-grid'
import {projectionParams} from '../utils/projection-params'
import {latToDms, lngToDms} from '../utils/latlng-convert'
import download from 'downloadjs'
import L from 'leaflet'

let mapView

const renderMap = (state) => {
  let mapIcon = L.divIcon({className: 'map-icon'})
  if (mapView) {
    mapView.off()
    mapView.remove()
  }
  mapView = L.map('map').setView([state.rows[0].lat, state.rows[0].lng], 12)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mapView)
  state.rows.slice(0, 100).map((row, index) => {
    L.marker([row.lat, row.lng], {icon: mapIcon}).addTo(mapView)
    .bindPopup(row.lat + ', ' + row.lng)
  })
}

const addRows = (state, results) => {
  let geo
  let res = results.data[0]
  // first column
  let x = res[Object.keys(res)[0]]
  // second column
  let y = res[Object.keys(res)[1]]
  // convert to lat, lng according to selected projection
  if (state.fromLatLng) {
    geo = geodeticToGrid(x, y, projectionParams(state.selectedParam))
  } else {
    geo = gridToGeodetic(x, y, projectionParams(state.selectedParam))
  }
  let row = {
    x: state.fromLatLng ? geo.x : x,
    y: state.fromLatLng ? geo.y : y,
    lat: state.fromLatLng ? x : geo.lat,
    lng: state.fromLatLng ? y : geo.lng,
    latdms: state.fromLatLng ? latToDms(+x) : latToDms(geo.lat),
    lngdms: state.fromLatLng ? lngToDms(+y) : lngToDms(geo.lng)
  }
  // update state with row including conversions
  return state.rows.concat(row)
}

const parseCSV = (state, actions, data, isFile) => {
  actions.resetRows()
  Papa.parse(data, {
    download: isFile,
    header: true,
    step: (results) =>
      actions.addRows(results),
    complete: () => {
      actions.hideMap()
    }
  })
}

const downloadCSVFile = (state, e) => {
  e.preventDefault ? e.preventDefault() : (e.returnValue = false)
  download(Papa.unparse(state.rows), 'converted.csv', 'text/csv')
}

export const actions = {
  setSelectedParam: (state, actions) => (e) => ({
    selectedParam: e.target.value
  }),
  setFromLatLngSelected: (state, actions) => (e) => ({
    fromLatLng: e.target.checked
  }),
  parseFile: (state, actions) => (e) => {
    parseCSV(state, actions, e.target.files[0])
  },
  parseString: (state, actions) => (e) => {
    parseCSV(state, actions, e.target.value)
  },
  parseRemote: (state, actions) => (e) => {
    parseCSV(state, actions, e.target.value, true)
  },
  resetRows: state => ({
    rows: []
  }),
  addRows: (state, actions) => (results) => ({
    rows: addRows(state, results)
  }),
  hideMap: state => ({
    showLeaflet: false
  }),
  renderMap: (state) =>
    renderMap(state),
  downloadCSV: (state, actions) => (e) =>
    downloadCSVFile(state, e),
  toggleInfo: state => ({
    showInfo: !state.showInfo
  }),
  toggleAll: state => ({
    showAll: !state.showAll
  }),
  toggleMap: state => ({
    showLeaflet: !state.showLeaflet
  })
}
