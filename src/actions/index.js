import Papa from 'papaparse'
import { geodeticToGrid, gridToGeodetic } from '../utils/geodetic-grid'
import { projectionParams } from '../utils/projection-params'
import { latToDms, lngToDms } from '../utils/latlng-convert'
import download from 'downloadjs-next'
import L from 'leaflet'
import dialogPolyfill from 'dialog-polyfill/dialog-polyfill'
import 'promise-polyfill/src/polyfill'

let mapView
let dialog

export const actions = {

  setSelectedParam: e => state => ({
    selectedParam: e.target.value,
    rows: [],
    showLeaflet: false
  }),

  setFromLatLngSelected: e => state => ({
    fromLatLng: e.target.checked
  }),

  addRows: (results) => (state, actions) => {
    let geo
    let data = results.data[0]
    let keys = Object.keys(data)
    // first column
    let x = data[keys[0]]
    // second column
    let y = data[keys[1]]
    // TODO: faulty data handling
    if (state.fromLatLng) {
      geo = geodeticToGrid(x, y, projectionParams(state.selectedParam))
      return {
        rows: state.rows.concat({
          x: geo.x,
          y: geo.y,
          lat: x,
          lng: y,
          latdms: latToDms(+x),
          lngdms: lngToDms(+y)
        })
      }
    } else {
      geo = gridToGeodetic(x, y, projectionParams(state.selectedParam))
      return {
        rows: state.rows.concat({
          x: x,
          y: y,
          lat: geo.lat,
          lng: geo.lng,
          latdms: latToDms(geo.lat),
          lngdms: lngToDms(geo.lng)
        })
      }
    }
  },

  parseCSV: (csv) => (state, actions) => {
    actions.resetRows()
    Papa.parse(csv.data, {
      download: csv.isFile,
      header: true,
      step: (results) => {
        actions.addRows(results)
      },
      complete: () => {
        actions.hideMap()
      }
    })
  },

  parseFile: (e) => (state, actions) => {
    actions.parseCSV({ data: e.target.files[0] })
  },

  parseString: (e) => (state, actions) => {
    actions.parseCSV({ data: e.target.value })
  },

  parseRemote: (e) => (state, actions) => {
    actions.parseCSV({ data: e.target.value, isFile: true })
  },

  resetRows: () => state => ({
    rows: []
  }),

  hideMap: () => state => ({
    showLeaflet: false
  }),

  renderMap: () => (state, actions) => {
    let mapIcon = L.divIcon({ className: 'map-icon' })
    if (mapView) {
      mapView.off()
      mapView.remove()
    }
    mapView = L.map('map').setView([state.rows[0].lat, state.rows[0].lng], 12)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapView)
    state.rows.slice(0, 100).map((row, index) => {
      L.marker([row.lat, row.lng], { icon: mapIcon }).addTo(mapView)
        .bindPopup(row.lat + ', ' + row.lng)
    })
  },

  downloadCSV: (e) => (state, actions) => {
    e.preventDefault ? e.preventDefault() : (e.returnValue = false)
    download(Papa.unparse(state.rows, {
      delimiter: ';'
    }), 'converted.csv', 'text/csv')
  },

  toggleInfo: () => state => ({
    showInfo: !state.showInfo
  }),

  toggleAll: () => state => ({
    showAll: !state.showAll
  }),

  toggleMap: () => state => ({
    showLeaflet: !state.showLeaflet
  }),

  cancelDialog: () => dialog.close(),

  showModal: () => dialog.showModal(),

  attachDialog: (el) => (state, actions) => {
    dialog = el
    dialogPolyfill.registerDialog(dialog)
  }
}
