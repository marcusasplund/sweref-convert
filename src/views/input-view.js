/* eslint-disable no-unused-vars */
import {h} from 'hyperapp'

export const InputView = ({actions, className}) =>
  <div class={className}>
    <input
      type='text'
      onInput={e => actions.parseRemote(e)}
      placeholder='Klistra in url till fil' />
    <textarea
      onInput={e => actions.parseString(e)}
      placeholder='Klistra in tabell med två kolumner med X o Y, N o E eller lat o lng' />
  </div>
