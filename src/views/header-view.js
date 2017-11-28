/* eslint-disable no-unused-vars */
import {h} from 'hyperapp'

export const HeaderView = ({state, actions}) =>
  <div>
    <div class='row'>
      <div class='column'>
        <label>
          <input type='checkbox' onclick={actions.setFromLatLngSelected} />
          {' '}{'Från WGS84/lat, lng'}
        </label>
      </div>
      <div class='column'>
        <label> Välj projektion (SWEREF 99, RT 90):
          <select value={state.selectedParam} onchange={actions.setSelectedParam}>
            {
              state.params.map(ref =>
                <option value={ref.value}>{ref.text}</option>)
            }
          </select>
        </label>
      </div>
    </div>
  </div>
