/* eslint-disable no-unused-vars */
import {h} from 'hyperapp'
import {TableRow} from '../views/table-row'

export const TableBody = ({state}) =>
  <tbody>
    {
      state.rows
        .map(row =>
          <TableRow state={state} row={row} />)
    }
  </tbody>
