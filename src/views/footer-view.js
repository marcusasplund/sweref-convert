/* eslint-disable no-unused-vars */
import {h} from 'hyperapp'
import {InfoText} from './info-text'

export const FooterView = ({state, actions}) =>
  <div>
    <div class='float-right'>
      <button onclick={actions.toggleInfo}>
        {state.showInfo ? 'dölj info' : 'visa info'}
      </button>
    </div>
    <div class='row'>
      {state.showInfo ? <InfoText /> : ''}
    </div>
  </div>
