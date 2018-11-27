/* eslint-disable no-unused-vars */
import { h } from 'hyperapp'

const params = [
  {
    value: 'sweref99tm',
    text: 'SWEREF 99 TM'
  }, {
    value: 'sweref991200',
    text: 'SWEREF 99 12 00'
  }, {
    value: 'sweref991330',
    text: 'SWEREF 99 13 30'
  }, {
    value: 'sweref991500',
    text: 'SWEREF 99 15 00'
  }, {
    value: 'sweref991630',
    text: 'SWEREF 99 16 30'
  }, {
    value: 'sweref991800',
    text: 'SWEREF 99 18 00'
  }, {
    value: 'sweref991415',
    text: 'SWEREF 99 14 15'
  }, {
    value: 'sweref991545',
    text: 'SWEREF 99 15 45'
  }, {
    value: 'sweref991715',
    text: 'SWEREF 99 17 15'
  }, {
    value: 'sweref991845',
    text: 'SWEREF 99 18 45'
  }, {
    value: 'sweref992015',
    text: 'SWEREF 99 20 15'
  }, {
    value: 'sweref992145',
    text: 'SWEREF 99 21 45'
  }, {
    value: 'sweref992315',
    text: 'SWEREF 99 23 15'
  }, {
    value: 'rt9075gonV',
    text: 'RT90 7.5 gon V 0:-15'
  }, {
    value: 'rt9050gonV',
    text: 'RT90 5 gon V 0:-15'
  }, {
    value: 'rt9025gonV',
    text: 'RT90 2.5 gon V 0:-15 (Nationell)'
  }, {
    value: 'rt9000gonV',
    text: 'RT90 0 gon V 0:-15'
  }, {
    value: 'rt9025gonO',
    text: 'RT90 2.5 gon O 0:-15'
  }, {
    value: 'rt9050gonO',
    text: 'RT90 5 gon O 0:-15'
  }]

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
          params.map(ref =>
            <option value={ref.value}>{ref.text}</option>)
        }
      </select>
      {' '}Välj projektion (SWEREF 99, RT 90):
    </label>
  </div>
