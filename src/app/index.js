import {app} from 'hyperapp'
import {actions} from '../actions/'
import {events} from '../events/'
import {state} from './state'
import {view} from '../views/'

app({
  actions,
  events,
  state,
  view
})
