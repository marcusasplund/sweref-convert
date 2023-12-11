/* @refresh reload */
import { render } from 'solid-js/web'
import App from './App'
import { ThemeProvider, createTheme } from '@suid/material/styles'
import CssBaseline from '@suid/material/CssBaseline'

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
})

render(() => (
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <App />
  </ThemeProvider>
), document.getElementById('root')!)
