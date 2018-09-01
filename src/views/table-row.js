/* eslint-disable no-unused-vars */
import { h } from 'hyperapp'

export const TableRow = ({ state, row }) =>
  <tr>
    <td>
      {row.x}
    </td>
    <td>
      {row.y}
    </td>
    <td>
      {row.lat}
    </td>
    <td>
      {row.lng}
    </td>
    <td>
      {row.latdms}
    </td>
    <td>
      {row.lngdms}
    </td>
  </tr>
