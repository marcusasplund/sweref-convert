/* eslint-disable no-unused-vars */
import { h } from 'hyperapp'

export const TableHead = ({ state }) =>
  <thead>
    <tr>
      <th>
        {state.swerefSelected ? 'N' : 'X'}
      </th>
      <th>
        {state.swerefSelected ? 'E' : 'Y'}
      </th>
      <th>
        lat
      </th>
      <th>
        lng
      </th>
      <th>
        lat
      </th>
      <th>
        lng
      </th>
    </tr>
  </thead>
