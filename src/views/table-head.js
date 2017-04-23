/* eslint-disable no-unused-vars */
import {h} from 'hyperapp'

export const TableHead = ({state}) =>
  <thead>
    <tr>
      <th>
        {state.swerefSelected ? 'X' : 'N' }
      </th>
      <th>
        {state.swerefSelected ? 'Y' : 'E' }
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
