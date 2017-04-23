import {default as Papa} from 'papaparse'

let rows = []

const parseCSV = (state, e, actions) => {
  rows = []
  actions.updateRows()
  let file = e.target.files[0]
  Papa.parse(file, {
    header: true,
    worker: true,
    step: (results) => {
      rows.push(results.data)
      actions.updateRows()
    }
  })
}

export const actions = {
  setSwerefSelected: (state, e) => ({
    swerefSelected: e.target.value === 'sweref',
    selectedParam: e.target.value === 'sweref' ? 'sweref99tm' : 'rt9025gonV'
  }),
  setSelectedParam: (state, e) => ({
    selectedParam: e.target.value
  }),
  parse: (state, e, actions) => {
    parseCSV(state, e, actions)
  },
  updateRows: (state) => ({
    rows: rows
  })
}
