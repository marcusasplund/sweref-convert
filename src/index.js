import {app} from 'hyperapp'
import {actions} from './actions/'
import {root} from './root/'
import {state} from './state/'
import {view} from './views/'
import {registerWorker} from './utils/register-worker'

app({
  actions,
  root,
  state,
  view
})

registerWorker()
