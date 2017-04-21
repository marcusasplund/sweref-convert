/* eslint-disable no-unused-vars */
import {h} from 'hyperapp'
import {StateDisplay} from '../views/state-display'

export const UploadView = ({state, actions}) =>
  <div class='container'>
    <label for='files' class='button file-label'>upload .csv
    <input
      onChange={e => actions.parse(e)}
      accept='.csv'
      class='hidden'
      id='files'
      type='file' />
    </label>
    {
      state.rows
        .map(row => <p>{JSON.stringify(row)}</p>)
    }
    <StateDisplay state={state} />
  </div>
