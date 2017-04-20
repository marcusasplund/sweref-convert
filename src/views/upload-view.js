/* eslint-disable no-unused-vars */
import {h} from 'hyperapp'

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
      JSON.stringify(state, null, 2)
    }
  </div>
