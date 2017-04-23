import {default as Papa} from 'papaparse'
import {gridToGeodetic} from '../utils/geodetic-grid'
import {projectionParams} from '../utils/projection-params'

let rows = []

const refreshRows = (state, actions, results) => {
  let res = results.data[0]
  // first column
  let x = res[Object.keys(res)[0]]
  // second column
  let y = res[Object.keys(res)[1]]
  // convert to lat, lng according to selected projection
  let geo = gridToGeodetic(x, y, projectionParams(state.selectedParam))
  let row = {
    x: x,
    y: y,
    lat: geo.lat,
    lng: geo.lng
  }
  // update state with row including conversions
  rows.push(row)
  actions.updateRows()
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
      refreshRows(state, actions, results)
  })
}

const parseCSVFile = (state, e, actions) => {
  // clear old result
  rows = []
  actions.updateRows()
  // parse uploaded file row by row
  let file = e.target.files[0]
  Papa.parse(file, {
    header: true,
    worker: true,
    step: (results) =>
      refreshRows(state, actions, results)
  })
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
  // parse csv file
  parseFile: (state, e, actions) => {
    parseCSVFile(state, e, actions)
  },
  // parse csv string
  parseString: (state, e, actions) => {
    parseCSVString(state, e, actions)
  },
  // update state with parsed rows
  updateRows: (state) => ({
    rows: rows
  })
}
