/* eslint-disable no-unused-vars */
import {h} from 'hyperapp'
import {UploadView} from './upload-view'
import {HeaderView} from './header-view'

export const view = (state, actions) =>
  <div class='container'>
    <HeaderView actions={actions} state={state} />
    <UploadView actions={actions} state={state} />
  </div>
