import {default as Papa} from 'papaparse'
import {geodeticToGrid, gridToGeodetic} from '../utils/geodetic-grid'
import {projectionParams} from '../utils/projection-params'
import {latToDms, lngToDms} from '../utils/latlng-convert'
import {download} from '../utils/download'
import L from 'leaflet'

let mapView

const renderMap = (state, actions, e) => {
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

const addMap = (state, actions, e) => {
  actions.toggleMap()
  setTimeout(function () {
    renderMap(state, actions, e)
  }, 200)
}

let rows = []

const refreshRows = (state, actions, results) => {
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
  rows.push(row)
}

const parseCSVString = (state, actions, e) => {
  // clear old result
  rows = []
  actions.updateRows()
  // parse uploaded file row by row
  let string = e.target.value
  Papa.parse(string, {
    header: true,
    step: (results) =>
      refreshRows(state, actions, results),
    complete: () =>
      actions.updateRows()
  })
}

const parseCSVFile = (state, actions, e) => {
  e.preventDefault ? e.preventDefault() : (e.returnValue = false)
  // clear old result
  rows = []
  actions.updateRows()
  // parse uploaded file row by row
  let file = e.target.files[0]
  Papa.parse(file, {
    header: true,
    step: (results) =>
      refreshRows(state, actions, results),
    complete: () => {
      actions.updateRows()
    }
  })
}

const parseCSVRemote = (state, actions, e) => {
  // clear old result
  rows = []
  actions.updateRows()
  // parse uploaded file row by row
  let url = e.target.value
  Papa.parse(url, {
    download: true,
    header: true,
    step: (results) =>
      refreshRows(state, actions, results),
    complete: () =>
      actions.updateRows()
  })
}

const downloadCSVFile = (e) => {
  e.preventDefault ? e.preventDefault() : (e.returnValue = false)
  download(Papa.unparse(rows), 'converted.csv', 'text/csv')
}

export const actions = {
  // set selected projection type
  setSwerefSelected: (state, actions, e) => ({
    swerefSelected: e.target.value === 'sweref',
    selectedParam: e.target.value === 'sweref' ? 'sweref99tm' : 'rt9025gonV'
  }),
  // set selected projection
  setSelectedParam: (state, actions, e) => ({
    selectedParam: e.target.value
  }),
  setFromLatLngSelected: (state, actions, e) => ({
    fromLatLng: e.target.checked
  }),
  // parse csv file
  parseFile: (state, actions, e) => {
    parseCSVFile(state, actions, e)
    actions.hideMap()
  },
  // parse csv string
  parseString: (state, actions, e) => {
    parseCSVString(state, actions, e)
    actions.hideMap()
  },
  // parse csv string
  parseRemote: (state, actions, e) => {
    parseCSVRemote(state, actions, e)
    actions.hideMap()
  },
  // update state with parsed rows
  updateRows: (state) => ({
    rows: rows
  }),
  hideMap: (state, actions, e) => ({
    showLeaflet: false
  }),
  showMap: (state, actions, e) =>
    addMap(state, actions, e),
  downloadCSV: (state, actions, e) =>
    downloadCSVFile(e),
  toggleInfo: (state, actions, e) => ({
    showInfo: !state.showInfo
  }),
  toggleAll: (state, actions, e) => ({
    showAll: !state.showAll,
    rows: rows
  }),
  toggleMap: (state, actions, e) => ({
    showLeaflet: !state.showLeaflet
  })
}
