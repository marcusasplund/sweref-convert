/* eslint-disable no-unused-vars */
import {h} from 'hyperapp'

export const TableHead = ({state}) =>
  <thead>
    <tr>
      <th>
        {state.swerefSelected ? 'x' : 'E' }
      </th>
      <th>
        {state.swerefSelected ? 'y' : 'N' }
      </th>
      <th>
    latitude
    </th>
      <th>
    longitude
    </th>
      <th>
      lat, lng
      </th>
    </tr>
  </thead>
