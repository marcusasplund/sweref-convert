import { app } from 'hyperapp'
import { actions } from './actions/'
import { state } from './state/'
import { view } from './views/'
import './styles/app.scss'

app(state, actions, view, document.getElementById('root'))
