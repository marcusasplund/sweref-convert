/* eslint-disable no-unused-vars */
import { h } from 'hyperapp'
import { TableRow } from '../views/table-row'

export const TableBody = ({ state }) =>
  <tbody>
    {state.showAll
      ? state.rows.map(row =>
        <TableRow state={state} row={row} key={row.x * row.y} />)
      : state.rows.filter((row, index) =>
        (index < 100)).map((row, index) => <TableRow state={state} row={row} key={row.x * row.y} />)}
  </tbody>
