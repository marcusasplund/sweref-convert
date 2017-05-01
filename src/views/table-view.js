/* eslint-disable no-unused-vars */
import {h} from 'hyperapp'
import {TableHead} from './table-head'
import {TableBody} from './table-body'

const ShowMore = ({state, actions}) =>
  <div>
    <button class='float-right' onclick={actions.toggleAll}>
      {state.showAll ? 'Visa 100 rader' : 'Visa alla rader'}
    </button>
    {state.showAll ? '' : 'Nu visas endast de 100 första raderna'}
  </div>

export const TableView = ({state, actions}) =>
  <div class={state.rows && state.rows.length > 0 ? '' : 'hidden'}>
    <table>
      <TableHead state={state} />
      <TableBody state={state} />
    </table>
    {state.rows.length > 100
      ? <ShowMore state={state} actions={actions} />
      : ''}
  </div>
