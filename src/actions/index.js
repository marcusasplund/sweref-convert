import {default as Papa} from 'papaparse'

const parseCSV = (state, e) => {
  let file = e.target.files[0]
  Papa.parse(file, {
    worker: true,
    step: function (results) {
      state.rows.push(results.data)
      console.log(state)
    }
  })
}

export const actions = {
  parse: (state, e) => {
    parseCSV(state, e)
  }
}
