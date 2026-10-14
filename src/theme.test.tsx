import { render } from './test-render'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, screen } from '@solidjs/testing-library'
import { AppThemeProvider } from './theme'
import TopBar from './index/App/TopBar'

afterEach(() => {
  cleanup()
  localStorage.clear()
  vi.unstubAllGlobals()
  delete document.documentElement.dataset.theme
  document.documentElement.style.colorScheme = ''
})

const renderTheme = () => render(() => (
  <AppThemeProvider>
    <TopBar handleClickOpen={() => {}} />
  </AppThemeProvider>
))

describe('color mode', () => {
  it('switches themes and restores the saved choice after remounting', () => {
    localStorage.setItem('sweref-theme', 'light')
    const app = renderTheme()
    fireEvent.click(screen.getByRole('button', { name: 'Byt till mörkt läge' }))
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(document.documentElement.style.colorScheme).toBe('dark')
    expect(localStorage.getItem('sweref-theme')).toBe('dark')
    app.unmount()
    renderTheme()
    fireEvent.click(screen.getByRole('button', { name: 'Byt till ljust läge' }))
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(localStorage.getItem('sweref-theme')).toBe('light')
  })

  it('follows system changes until the user selects a theme', () => {
    let change: (event: { matches: boolean }) => void = () => {}
    const removeEventListener = vi.fn()
    vi.stubGlobal('matchMedia', vi.fn(() => ({
      matches: true,
      addEventListener: (_type: string, listener: typeof change) => { change = listener },
      removeEventListener
    })))
    const app = renderTheme()
    expect(document.documentElement.dataset.theme).toBe('dark')
    change({ matches: false })
    expect(document.documentElement.dataset.theme).toBe('light')
    fireEvent.click(screen.getByRole('button', { name: 'Byt till mörkt läge' }))
    change({ matches: true })
    change({ matches: false })
    expect(document.documentElement.dataset.theme).toBe('dark')
    app.unmount()
    expect(removeEventListener).toHaveBeenCalledWith('change', change)
  })

  it('still switches when browser storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked') })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked') })
    renderTheme()
    const before = document.documentElement.dataset.theme
    fireEvent.click(screen.getByRole('button', { name: /Byt till/ }))
    expect(document.documentElement.dataset.theme).not.toBe(before)
    vi.restoreAllMocks()
  })
})
