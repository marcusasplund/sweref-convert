/* eslint-disable no-unused-vars */
import {h} from 'hyperapp'
import {TableHead} from './table-head'
import {TableBody} from './table-body'

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
    <input
      type='text'
      onInput={e => actions.parseRemote(e)}
      placeholder='Klistra in url till fil' />
    <textarea
      onInput={e => actions.parseString(e)}
      placeholder='Klistra in tabell med två kolumner X o Y eller N o E' />
  </div>
