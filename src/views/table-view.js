/* eslint-disable no-unused-vars */
import {h} from 'hyperapp'
import {TableHead} from './table-head'
import {TableBody} from './table-body'

export const TableView = ({state, actions}) =>
  <div class={state.rows && state.rows.length > 0 && !state.showLeaflet ? '' : 'hidden'}>
    <table>
      <TableHead state={state} />
      <TableBody state={state} />
    </table>
    <button class='float-right' onClick={actions.toggleAll}>
      {state.showAll ? 'Visa 100 rader' : 'Visa alla rader'}
    </button>
    {state.showAll ? '' : 'Nu visas endast de 100 första raderna'}
  </div>
