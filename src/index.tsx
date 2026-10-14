/* @refresh reload */
import { render } from 'solid-js/web'
import { TransProvider } from '@jellybrick/solid-i18next'
import i18next from './i18n'
import App from './index/App'
import { AppThemeProvider } from './theme'

const rootElement = document.getElementById('root')
if (rootElement == null) {
  throw new Error('Root element not found')
}

render(() => (
  <TransProvider instance={i18next}>
  <AppThemeProvider>
    <App />
  </AppThemeProvider>
  </TransProvider>
), rootElement)
