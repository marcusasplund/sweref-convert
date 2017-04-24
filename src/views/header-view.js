/* eslint-disable no-unused-vars */
import {h} from 'hyperapp'

export const HeaderView = ({state, actions}) =>
  <header>
    <h2>Konvertera från SWEREF99 o RT90 till lat, lng</h2>
    <p>Välj projektion på ursprungsdatan o ladda upp ett .csv, eller klistra in en tabell nedan, med två kolumner där den första är X eller N o den andra är Y eller E. Du kan ladda ned ett exempel på hur ursprungsdatan bör se ut <a download='rt90.csv' target='_blank' href='https://pap.as/sweref/rt90.csv'>här</a>. Beräkningsalgoritmerna kommer från <a href='https://latlong.mellifica.se'>latlong.mellifica.se</a> där finns lite mer info. Källkoden till denna app hittar ni <a href='https://github.com/marcusasplund/sweref-convert'>här</a></p>
    <div class='row'>
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
