/* eslint-disable no-unused-vars */
import {h} from 'hyperapp'
import {geodeticToGrid, gridToGeodetic} from '../utils/geodetic-grid'
import {projectionParams} from '../utils/projection-params'
import {
  latFromDd,
  lngFromDd,
  latFromDm,
  lngFromDm,
  latFromDms,
  lngFromDms,
  latToDd,
  lngToDd,
  lngToDm,
  latToDms,
  lngToDms
} from '../utils/latlng-convert'

export const TableRow = ({state, row}) =>
  <tr>
    <td>
      {row[0][Object.keys(row[0])[0]]}
    </td>
    <td>
      {row[0][Object.keys(row[0])[1]]}
    </td>
    <td>
      {gridToGeodetic(row[0][Object.keys(row[0])[0]], row[0][Object.keys(row[0])[1]], projectionParams(state.selectedParam)).lat}
    </td>
    <td>
      {gridToGeodetic(row[0][Object.keys(row[0])[0]], row[0][Object.keys(row[0])[1]], projectionParams(state.selectedParam)).lng}
    </td>
    <td>
      {gridToGeodetic(row[0][Object.keys(row[0])[0]], row[0][Object.keys(row[0])[1]], projectionParams(state.selectedParam)).lat}
      {', '}
      {gridToGeodetic(row[0][Object.keys(row[0])[0]], row[0][Object.keys(row[0])[1]], projectionParams(state.selectedParam)).lng}
    </td>
  </tr>
