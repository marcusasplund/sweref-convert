import { createContext, createEffect, createMemo, createSignal, onCleanup, useContext, type ParentProps } from 'solid-js'
import { createTheme, ThemeProvider } from '@suid/material/styles'
import CssBaseline from '@suid/material/CssBaseline'

type ColorMode = 'light' | 'dark'
const storageKey = 'sweref-theme'
const ColorModeContext = createContext({
  mode: (): ColorMode => 'light',
  toggle: (): void => {}
})

export const useColorMode = () => useContext(ColorModeContext)

export function AppThemeProvider (props: ParentProps) {
  const systemTheme = window.matchMedia?.('(prefers-color-scheme: dark)')
  const readPreference = (): ColorMode | null => {
    try {
      const saved = localStorage.getItem(storageKey)
      return saved === 'light' || saved === 'dark' ? saved : null
    } catch {
      return null
    }
  }
  const [preference, setPreference] = createSignal(readPreference())
  const [systemDark, setSystemDark] = createSignal(systemTheme?.matches ?? false)
  const mode = createMemo<ColorMode>(() => preference() ?? (systemDark() ? 'dark' : 'light'))
  const updateSystem = (event: MediaQueryListEvent) => setSystemDark(event.matches)
  systemTheme?.addEventListener('change', updateSystem)
  onCleanup(() => systemTheme?.removeEventListener('change', updateSystem))

  const toggle = () => {
    const next = mode() === 'dark' ? 'light' : 'dark'
    setPreference(next)
    try {
      localStorage.setItem(storageKey, next)
    } catch {
      // Keep the switch usable when browser storage is unavailable.
    }
  }

  createEffect(() => {
    document.documentElement.style.colorScheme = mode()
    document.documentElement.dataset.theme = mode()
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', mode() === 'dark' ? '#111827' : '#f5f7fb')
  })

  const theme = createMemo(() => createTheme({
    palette: {
      background: {
        default: mode() === 'dark' ? '#111827' : '#f5f7fb',
        paper: mode() === 'dark' ? '#1f2937' : '#ffffff'
      },
      mode: mode(),
      primary: { main: mode() === 'dark' ? '#93c5fd' : '#1d4ed8' },
      secondary: { main: mode() === 'dark' ? '#5eead4' : '#0f766e' },
      text: {
        primary: mode() === 'dark' ? '#f1f5f9' : '#0f172a',
        secondary: mode() === 'dark' ? '#cbd5e1' : '#475569'
      }
    },
    shape: { borderRadius: 12 },
    typography: {
      button: { fontWeight: 600, textTransform: 'none' },
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      h4: { fontWeight: 700, letterSpacing: '-0.025em' },
      h6: { fontWeight: 700, letterSpacing: '-0.02em' }
    }
  }))

  return (
    <ColorModeContext.Provider value={{ mode, toggle }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {props.children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}
