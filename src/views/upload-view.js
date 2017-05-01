/* eslint-disable no-unused-vars */
import {h} from 'hyperapp'

export const UploadView = ({state, actions}) =>
  <div>
    <label for='files' class='button file-label'>Ladda upp csv
    </label>
    <input
      onchange={actions.parseFile}
      accept='.csv'
      class='hidden'
      id='files'
      type='file' />
    {' '}
    <button disabled={state.rows && state.rows.length < 1} onclick={actions.downloadCSV} class='button'>
      Ladda ned konverterad csv
    </button>
    <button disabled={state.rows && state.rows.length < 1} onclick={actions.showMap} class='button'>
      {state.showLeaflet ? 'visa tabellvy' : 'visa kartvy'}
    </button>
    {state.showLeaflet ? <small>på kartan visas de 100 första i tabellen</small> : ''}
  </div>
