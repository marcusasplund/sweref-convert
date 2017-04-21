/* eslint-disable no-unused-vars */
import {h} from 'hyperapp'
import {projectionParams} from '../utils/projection-params'

export const StateDisplay = ({state}) =>
  <pre>
    <code>
      {JSON.stringify(projectionParams('testCase'), null, 2)}
      {JSON.stringify(state, null, 2)}
    </code>
  </pre>
