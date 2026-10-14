import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, screen } from '@solidjs/testing-library'
import { render } from '../../test-render'
import App from '../App'

afterEach(cleanup)

function selectProjection (label: string, option: string) {
  fireEvent.mouseDown(screen.getByLabelText(label))
  fireEvent.click(screen.getByRole('option', { hidden: true, name: option }))
}

describe('source coordinates', () => {
  it('reconverts original WGS84 coordinates after repeated projection changes', () => {
    render(() => <App />)
    selectProjection('Konvertera från', 'WGS84')
    selectProjection('Konvertera till', 'SWEREF 99 TM')
    fireEvent.input(screen.getByLabelText('Klistra in koordinater i två kolumner'), {
      target: { value: 'lat,lon\n59.3293,18.0686' }
    })
    const original = screen.getByRole('table').textContent
    selectProjection('Konvertera till', 'RT90 5 gon V 0:-15')
    selectProjection('Konvertera till', 'SWEREF 99 TM')
    expect(screen.getByRole('table').textContent).toBe(original)
    selectProjection('Konvertera från', 'SWEREF 99 TM')
    selectProjection('Konvertera från', 'WGS84')
    expect(screen.getByRole('table').textContent).toBe(original)
    expect(screen.getByText('59.3293')).toBeDefined()
  })

  it('loads a large CSV with arbitrary column names and ignores blank lines', () => {
    render(() => <App />)
    const csv = 'northing,easting\n' + '6373105,1316400\n'.repeat(10000) + '\n'
    fireEvent.input(screen.getByLabelText('Klistra in koordinater i två kolumner'), {
      target: { value: csv }
    })
    expect(screen.getByText('10000 rader inlästa')).toBeDefined()
    expect(screen.getAllByRole('row')).toHaveLength(101)
  })
})
