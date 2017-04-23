/* eslint-disable no-unused-vars */
import {h} from 'hyperapp'
import {StateDisplay} from '../views/state-display'
import {TableHead} from '../views/table-head'
import {TableBody} from '../views/table-body'

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
    {
      <table>
        <TableHead state={state} />
        <TableBody state={state} />
      </table>
    }
  </div>
