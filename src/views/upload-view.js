/* eslint-disable no-unused-vars */
import {h} from 'hyperapp'
import {StateDisplay} from '../views/state-display'
import {TableHead} from '../views/table-head'
import {TableBody} from '../views/table-body'

export const UploadView = ({state, actions}) =>
  <div>
    <label for='files' class='button file-label'>Ladda upp csv
    <input
      onChange={e => actions.parseFile(e)}
      accept='.csv'
      class='hidden'
      id='files'
      type='file' />
    </label>
    {' '}
    <button onClick={e => actions.downloadCSV(e)} class='button'>
      Ladda ned konverterad csv
    </button>
    <table>
      <TableHead state={state} />
      <TableBody state={state} />
    </table>
    <textarea
      onInput={e => actions.parseString(e)}
      placeholder='Klistra in tabell med två kolumner X o Y eller N o E'>
    </textarea>
  </div>
