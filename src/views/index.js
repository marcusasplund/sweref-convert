/* eslint-disable no-unused-vars */
import {h} from 'hyperapp'
import {UploadView} from './upload-view'
import {HeaderView} from './header-view'
import {TableView} from './table-view'
import {LeafletMap} from './leaflet-map'
import {InputView} from './input-view'
import {FooterView} from './footer-view'

export const view = (state, actions) =>
  <div>
    <header>
      <h2>Konvertera mellan SWEREF99/RT90 och lat, lng</h2>
    </header>
    <HeaderView actions={actions} state={state} />
    <UploadView actions={actions} state={state} />
    {
      state.showLeaflet
      ? <LeafletMap actions={actions} />
    : ''
    }
    <TableView actions={actions} state={state} />
    <InputView actions={actions} className={state.showLeaflet ? 'hidden' : ''} />
    <FooterView actions={actions} state={state} />
  </div>
