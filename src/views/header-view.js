/* eslint-disable no-unused-vars */
import {h} from 'hyperapp'
import {InfoText} from './info-text'

export const HeaderView = ({state, actions}) =>
  <header>
    <h2>Konvertera mellan SWEREF99/RT90 och lat, lng</h2>
    <div>
      <button class='float-right' onClick={actions.toggleInfo}>
        {state.showInfo ? 'X' : 'ℹ'}
      </button>
      {state.showInfo ? <InfoText /> : ''}
    </div>
    <div class='row'>
      <div class='column'>
        <label>
          <input type='checkbox' onclick={actions.setFromLatLngSelected} />
          {' '}{'Från WGS84/lat, lng'}
        </label>
      </div>
      <div class='column'>
        <label>
          <input type='radio' onclick={actions.setSwerefSelected} name='radios' value='sweref' checked={state.swerefSelected} />
          {' '}SWEREF 99 TM etc
        </label>
      </div>
      <div class='column'>
        <label>
          <input type='radio' onclick={actions.setSwerefSelected} name='radios' value='rt90' checked={!state.swerefSelected} />
          {' '}RT 90
        </label>
      </div>
    </div>
    <div class='row'>
      <div class='column'>
        <label> Välj SWEREF 99 projektion:
          <select value={state.selectedParam} onChange={actions.setSelectedParam} disabled={!state.swerefSelected}>
            {
              state.swerefs.map(ref =>
                <option value={ref.value}>{ref.text}</option>)
            }
          </select>
        </label>
      </div>
      <div class='column'>
        <label> Välj RT 90 projektion:
          <select value={state.selectedParam} onchange={actions.setSelectedParam} disabled={state.swerefSelected}>
            {
              state.rt90s.map(ref =>
                <option value={ref.value}>{ref.text}</option>)
            }
          </select>
        </label>
      </div>
    </div>
  </header>
