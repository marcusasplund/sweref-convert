/* eslint-disable no-unused-vars */
import {h} from 'hyperapp'
import {UploadView} from './upload-view'

export const view = (state, actions) =>
  <UploadView actions={actions} state={state} />
