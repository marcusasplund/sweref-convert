import {default as Papa} from 'papaparse'

const parseCSV = (state, e, actions) => {
  let file = e.target.files[0]
  Papa.parse(file, {
    header: true,
    worker: true,
    step: (results) =>
      actions.updateRows({results})
  })
}

export const actions = {
  parse: (state, e, actions) =>
    parseCSV(state, e, actions),
  updateRows: (state, {results}) =>
    state.rows.push(results.data)
}
