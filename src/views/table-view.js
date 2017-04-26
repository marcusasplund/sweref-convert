/* eslint-disable no-unused-vars */
import {h} from 'hyperapp'
import {TableHead} from './table-head'
import {TableBody} from './table-body'

export const TableView = ({state, actions}) =>
  <div>
    <table>
      <TableHead state={state} />
      <TableBody state={state} />
    </table>
    <input
      type='text'
      onInput={e => actions.parseRemote(e)}
      placeholder='Klistra in url till fil' />
    <textarea
      onInput={e => actions.parseString(e)}
      placeholder='Klistra in tabell med två kolumner X o Y eller N o E' />
  </div>
