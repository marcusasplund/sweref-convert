/* eslint-disable no-unused-vars */
import { h } from 'hyperapp'

export const InputView = ({ actions, className }) =>
  <div class={className}>
    <input
      type='text'
      oninput={e => actions.parseRemote(e)}
      aria-label='url'
      placeholder='Klistra in url till fil från server'
    />
    <textarea
      aria-label='tabell'
      rows='10'
      oninput={e => actions.parseString(e)}
      placeholder='Klistra in tabell med två kolumner med X o Y, N o E eller lat o lng'
    />
  </div>
