import {default as Papa} from 'papaparse'
import {geodeticToGrid, gridToGeodetic} from '../utils/geodetic-grid'
import {projectionParams} from '../utils/projection-params'
import {latToDms, lngToDms} from '../utils/latlng-convert'
import {download} from '../utils/download'
import L from 'leaflet'

const addMap = (state, e, actions) => {
  let mapView
  let mapIcon = L.divIcon({className: 'map-icon'})
  actions.toggleMap()
  if (!mapView) {
    mapView = L.map('map').setView([state.rows[0].lat, state.rows[0].lng], 12)
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapView)
    state.rows.filter((i, index) =>
      (index < 20 || index < state.rows.length)).map((i, index) => {
        L.marker([i.lat, i.lng], {icon: mapIcon}).addTo(mapView)
        .bindPopup(i.lat + ', ' + i.lng)
      })
  }
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
    lngdms: state.fromLatLng ? lngToDms(+y) : latToDms(geo.lat)
  }
  // update state with row including conversions
  rows.push(row)
}

const parseCSVString = (state, e, actions) => {
  // clear old result
  rows = []
  actions.updateRows()
  // parse uploaded file row by row
  let string = e.target.value
  Papa.parse(string, {
    header: true,
    worker: true,
    step: (results) =>
      refreshRows(state, actions, results),
    complete: () =>
      actions.updateRows()
  })
}

const parseCSVFile = (state, e, actions) => {
  e.preventDefault()
  // clear old result
  rows = []
  actions.updateRows()
  // parse uploaded file row by row
  let file = e.target.files[0]
  Papa.parse(file, {
    header: true,
    worker: true,
    step: (results) =>
      refreshRows(state, actions, results),
    complete: () => {
      actions.updateRows()
    }
  })
}

const parseCSVRemote = (state, e, actions) => {
  // clear old result
  rows = []
  actions.updateRows()
  // parse uploaded file row by row
  let url = e.target.value
  Papa.parse(url, {
    download: true,
    header: true,
    worker: true,
    step: (results) =>
      refreshRows(state, actions, results),
    complete: () =>
      actions.updateRows()
  })
}

const downloadCSVFile = (e) => {
  e.preventDefault()
  download(Papa.unparse(rows), 'converted.csv', 'text/csv')
}

export const actions = {
  // set selected projection type
  setSwerefSelected: (state, e) => ({
    swerefSelected: e.target.value === 'sweref',
    selectedParam: e.target.value === 'sweref' ? 'sweref99tm' : 'rt9025gonV'
  }),
  // set selected projection
  setSelectedParam: (state, e) => ({
    selectedParam: e.target.value
  }),
  setFromLatLngSelected: (state, e) => ({
    fromLatLng: e.target.checked
  }),
  // parse csv file
  parseFile: (state, e, actions) => {
    parseCSVFile(state, e, actions)
  },
  // parse csv string
  parseString: (state, e, actions) => {
    parseCSVString(state, e, actions)
  },
  // parse csv string
  parseRemote: (state, e, actions) => {
    parseCSVRemote(state, e, actions)
  },
  // update state with parsed rows
  updateRows: (state) => ({
    rows: rows
  }),
  showMap: (state, e, actions) =>
    addMap(state, e, actions),
  downloadCSV: (state, e, actions) =>
    downloadCSVFile(e),
  toggleInfo: (state, e, actions) => ({
    showInfo: !state.showInfo
  }),
  toggleMap: (state, e, actions) => ({
    showLeaflet: !state.showLeaflet
  })
}
