import { render, screen, fireEvent, cleanup } from '@solidjs/testing-library'
import { describe, it, expect, afterEach } from 'vitest'
import ResultTable from './ResultTable'
import type { ConvertedRow } from '../types'

const createRows = (count: number): ConvertedRow[] => {
  return Array.from({ length: count }, (_, i) => ({
    x: i,
    y: i + 1,
    lat: i + 0.1,
    lng: i + 0.2,
    x2: i + 100,
    y2: i + 200,
    latdms: `N ${i}°`,
    lngdms: `E ${i}°`
  }))
}

afterEach(() => cleanup())

describe('<ResultTable />', () => {
  it('renders message when no rows are provided', () => {
    render(() => <ResultTable rows={() => []} twoWay={() => false} />)
    expect(screen.getByText('Ingen data att visa.')).toBeDefined()
  })

  it('renders table with limited rows by default', () => {
    const rows = createRows(150)
    render(() => <ResultTable rows={() => rows} twoWay={() => false} limit={100} />)
    expect(screen.getByText('Visa endast de 100 första raderna')).toBeDefined()
    expect(screen.getByText('Nu visas endast de 100 första raderna här nedan')).toBeDefined()
    expect(screen.getAllByRole('row')).toHaveLength(101) // 100 rows + 1 header row
  })

  it('shows all rows when switch is toggled', async () => {
    const rows = createRows(150)
    render(() => <ResultTable rows={() => rows} twoWay={() => true} limit={100} />)

    const label = screen.getByText('Visa endast de 100 första raderna')
    fireEvent.click(label)
    expect(screen.getByText('Visa alla rader')).toBeDefined()
    expect(screen.getAllByRole('row')).toHaveLength(151) // 150 rows + 1 header row
  })

  it('renders latdms/lngdms when twoWay is false', () => {
    const rows = createRows(1)
    render(() => <ResultTable rows={() => rows} twoWay={() => false} />)
    expect(screen.getByText('N 0°')).toBeDefined()
    expect(screen.getByText('E 0°')).toBeDefined()
  })

  it('renders x2/y2 when twoWay is true', () => {
    const rows = createRows(1)
    render(() => <ResultTable rows={() => rows} twoWay={() => true} />)
    expect(screen.getByText('100')).toBeDefined()
    expect(screen.getByText('200')).toBeDefined()
  })
})
