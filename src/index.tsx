/* @refresh reload */
import { render } from 'solid-js/web'
import App from './index/App'
import { ThemeProvider, createTheme } from '@suid/material/styles'
import CssBaseline from '@suid/material/CssBaseline'

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
})

const rootElement = document.getElementById('root')
if (rootElement == null) {
  throw new Error('Root element not found')
}

render(() => (
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <App />
  </ThemeProvider>
), rootElement)
