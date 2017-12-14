import {app} from 'hyperapp'
import {downloadCSVFile, parseCSV, addRows, renderMap} from './actions/'
import {state} from './state/'
import {view} from './views/'
import {registerWorker} from './utils/register-worker'

const model = {
  state: state,
  actions: {
    setSelectedParam: e => state => ({
      selectedParam: e.target.value,
      rows: []
    }),
    setFromLatLngSelected: e => state => ({
      fromLatLng: e.target.checked
    }),
    parseFile: e => state => {
      parseCSV(state, actions, e.target.files[0])
    },
    parseString: e => state => {
      parseCSV(state, actions, e.target.value)
    },
    parseRemote: e => state => {
      parseCSV(state, actions, e.target.value, true)
    },
    resetRows: () => state => ({
      rows: []
    }),
    addRows: results => state => ({
      rows: addRows(state, results)
    }),
    hideMap: () => state => ({
      showLeaflet: false
    }),
    renderMap: () => state =>
      renderMap(state),
    downloadCSV: e => state =>
      downloadCSVFile(state, e),
    toggleInfo: () => state => ({
      showInfo: !state.showInfo
    }),
    toggleAll: () => state => ({
      showAll: !state.showAll
    }),
    toggleMap: () => state => ({
      showLeaflet: !state.showLeaflet
    })
  }
}

const {actions} = app(model, view, document.getElementById('root'))

console.log(actions)

registerWorker()
