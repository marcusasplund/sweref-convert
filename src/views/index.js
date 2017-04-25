/* eslint-disable no-unused-vars */
import {h} from 'hyperapp'
import {UploadView} from './upload-view'
import {HeaderView} from './header-view'
import {TableView} from './table-view'
import {LeafletMap} from './leaflet-map'

export const view = (state, actions) =>
  <div class='container'>
    <HeaderView actions={actions} state={state} />
    <UploadView actions={actions} state={state} />
    {state.showLeaflet ? '' : <TableView actions={actions} state={state} />}
    <LeafletMap />
  </div>
