/* eslint-disable no-unused-vars */
import {h} from 'hyperapp'
import {UploadView} from './upload-view'
import {HeaderView} from './header-view'
import {TableView} from './table-view'
import {LeafletMap} from './leaflet-map'
import {InputView} from './input-view'

export const view = (state, actions) =>
  <div>
    <HeaderView actions={actions} state={state} />
    <UploadView actions={actions} state={state} />
    <LeafletMap className={state.showLeaflet ? '' : 'hidden'} />
    <TableView actions={actions} state={state} />
    <InputView actions={actions} className={state.showLeaflet ? 'hidden' : ''} />
  </div>
