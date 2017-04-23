/* eslint-disable no-unused-vars */
import {h} from 'hyperapp'

export const HeaderView = ({state, actions}) =>
  <header>
    <h2>batch convert SWEREF99 o RT90 to lat, lng</h2>
    <label>
      SWEREF
      <input type='radio' onclick={actions.setSwerefSelected} name='radios' value='sweref' checked={state.swerefSelected} />
    </label>
    <label>
      <input type='radio' onclick={actions.setSwerefSelected} name='radios' value='rt90' />
      RT90
    </label>
    <label> select sweref projection
      <select value={state.selectedParam} onChange={actions.setSelectedParam} disabled={!state.swerefSelected}>
        {
          state.swerefs.map(ref =>
            <option value={ref.value}>{ref.text}</option>)

        }
      </select>
    </label>
    <label> select rt90 projection
      <select value={state.selectedParam} onchange={actions.setSelectedParam} disabled={state.swerefSelected}>
        {
          state.rt90s.map(ref =>
            <option value={ref.value}>{ref.text}</option>)

        }
      </select>
    </label>
  </header>
