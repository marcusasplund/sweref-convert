/* @refresh reload */
import { render } from 'solid-js/web'
import App from './index/App'
import { AppThemeProvider } from './theme'

const rootElement = document.getElementById('root')
if (rootElement == null) {
  throw new Error('Root element not found')
}

render(() => (
  <AppThemeProvider>
    <App />
  </AppThemeProvider>
), rootElement)
