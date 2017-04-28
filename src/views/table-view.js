/* eslint-disable no-unused-vars */
import {h} from 'hyperapp'
import {TableHead} from './table-head'
import {TableBody} from './table-body'

export const TableView = ({state}) =>
  <div class={state.rows && state.rows.length > 0 && !state.showLeaflet ? '' : 'hidden'}>
    <table>
      <TableHead state={state} />
      <TableBody state={state} />
    </table>
  </div>
