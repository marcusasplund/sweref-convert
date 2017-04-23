/* eslint-disable no-unused-vars */
import {h} from 'hyperapp'
import {StateDisplay} from '../views/state-display'
import {TableHead} from '../views/table-head'
import {TableBody} from '../views/table-body'
import {default as Papa} from 'papaparse'

const dataToCsvURI = (data) => encodeURI(
  `data:text/csv;charset=utf-8,${Papa.unparse(data)}`
)

export const UploadView = ({state, actions}) =>
  <div class='container'>
    <label for='files' class='button file-label'>Ladda upp .csv
    <input
      onChange={e => actions.parse(e)}
      accept='.csv'
      class='hidden'
      id='files'
      type='file' />
    </label>
    {' '}
    <a href={dataToCsvURI(state.rows)} download='convert.csv' target='_blank' class='button'>
      Ladda ned konverterad .csv
    </a>
    <table>
      <TableHead state={state} />
      <TableBody state={state} />
    </table>
  </div>
