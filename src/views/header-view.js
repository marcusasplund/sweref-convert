/* eslint-disable no-unused-vars */
import { h } from 'hyperapp'

export const HeaderView = ({ state, actions }) =>
  <div>
    <button onclick={e => actions.showModal()}>
      hjälp/info
    </button>
    <hr />
    <label>
      <input type='checkbox' onclick={actions.setFromLatLngSelected} />
      {' '}{'Från WGS84/lat, lng'}
    </label>
    <label>
      <select value={state.selectedParam} onchange={actions.setSelectedParam}>
        {
          state.params.map(ref =>
            <option value={ref.value}>{ref.text}</option>)
        }
      </select>
      {' '}Välj projektion (SWEREF 99, RT 90):
    </label>
  </div>
