/* @refresh reload */
import { render } from 'solid-js/web'
import App from './index/App'
import { ThemeProvider, createTheme } from '@suid/material/styles'
import CssBaseline from '@suid/material/CssBaseline'

const theme = createTheme({
  palette: {
    background: {
      default: '#f5f7fb',
      paper: '#ffffff'
    },
    mode: 'light',
    primary: {
      main: '#1d4ed8'
    },
    secondary: {
      main: '#0f766e'
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569'
    }
  },
  shape: {
    borderRadius: 12
  },
  typography: {
    button: {
      fontWeight: 600,
      textTransform: 'none'
    },
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.025em'
    },
    h6: {
      fontWeight: 700,
      letterSpacing: '-0.02em'
    }
  }
})

const rootElement = document.getElementById('root')
if (rootElement == null) {
  throw new Error('Root element not found')
}

render(() => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>
), rootElement)
