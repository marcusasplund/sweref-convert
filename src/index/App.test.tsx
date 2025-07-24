import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@solidjs/testing-library'
import { ThemeProvider, createTheme } from '@suid/material/styles'
import CssBaseline from '@suid/material/CssBaseline'
import App from './App'
import * as papaparse from 'papaparse'
import { selectParams } from './App/selectParams'

// Mock conversion logic
vi.mock('./App/conversionLogic', () => ({
  convertRow: vi.fn((x, y) => ({ x, y, lat: x, lng: y, x2: 0, y2: 0, latdms: '', lngdms: '' }))
}))

// Mock Papa.parse
vi.mock('papaparse', () => ({
  parse: vi.fn()
}))

describe('<App />', () => {
  const darkTheme = createTheme({ palette: { mode: 'dark' } })
  const renderApp = (): ReturnType<typeof render> =>
    render(() => (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    ))

  beforeEach(() => {
    vi.resetAllMocks()
  })

  afterEach(() => cleanup())

  it('renders title and from select controls', () => {
    renderApp()

    const fromSelect = screen.getByLabelText('Konvertera från')
    fireEvent.mouseDown(fromSelect)

    selectParams.forEach(p => {
      expect(screen.getByRole('option', { name: p.text, hidden: true })).toBeInTheDocument()
    })
  })

  it('renders to select controls', () => {
    renderApp()

    const toSelect = screen.getByLabelText('Konvertera till')
    fireEvent.mouseDown(toSelect)
    selectParams.forEach(p => {
      expect(screen.getByRole('option', { name: p.text, hidden: true })).toBeInTheDocument()
    })
  })

  it('disables buttons when no data', () => {
    renderApp()
    const mapBtn = screen.getByRole('button', { name: /kartvy/i })
    const downloadBtn = screen.getByRole('button', { name: /ladda ned/i })
    expect(mapBtn).toBeDisabled()
    expect(downloadBtn).toBeDisabled()
  })

  it('enables buttons after data input and toggles views', async () => {
    renderApp()
    // Simulate pasting CSV string
    const textField = screen.getByLabelText('Klistra in tabell med två kolumner')
    const data = 'x,y\n1,2'
    fireEvent.input(textField, { target: { value: data } })
    // Mock Papa.parse step callback
    const step = (papaparse.parse as any).mock.calls[0][1].step
    step({ data: { x: 1, y: 2 } })
    // After parse complete
    const mapBtn = screen.getByRole('button', { name: /kartvy/i })
    const downloadBtn = screen.getByRole('button', { name: /ladda ned/i })
    expect(mapBtn).not.toBeDisabled()
    expect(downloadBtn).not.toBeDisabled()
    // Toggle to map view
    fireEvent.click(mapBtn)
    // LeafletMap should appear
    expect(document.getElementById('map')).toBeDefined()
    // Toggle back to table view
    fireEvent.click(mapBtn)
    expect(screen.getByRole('table')).toBeDefined()
  })
})
