import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@solidjs/testing-library'
import { LeafletMap } from './LeafletMap'
import type { ConvertedRow } from '../types'
import * as solidLeaflet from 'solidjs-leaflet'

afterEach(() => {
  vi.restoreAllMocks()
  cleanup()
})

const mockRows = (): ConvertedRow[] => [
  {
    x: 1,
    y: 2,
    lat: 57.7,
    lng: 12.0,
    x2: 100,
    y2: 200,
    latdms: 'N 57°42′',
    lngdms: 'E 12°0′'
  }
]

describe('<LeafletMap />', () => {
  it('renders SolidLeafletMap with default center from rows', () => {
    const mapReadyMock = vi.fn()

    // mock SolidLeafletMap to intercept props
    const spy = vi.spyOn(solidLeaflet, 'SolidLeafletMap').mockImplementation((props: any) => {
      mapReadyMock(props.center, props.zoom)
      return <div data-testid='mock-map' />
    })

    render(() => <LeafletMap rows={mockRows} />)

    expect(screen.getByTestId('mock-map')).toBeDefined()
    expect(mapReadyMock).toHaveBeenCalledWith([57.7, 12.0], 10)
    spy.mockRestore()
  })

  it('uses provided center and zoom props when passed', () => {
    const center: [number, number] = [60.0, 15.0]
    const zoom = 7
    const mapReadyMock = vi.fn()

    const spy = vi.spyOn(solidLeaflet, 'SolidLeafletMap').mockImplementation((props: any) => {
      mapReadyMock(props.center, props.zoom)
      return <div data-testid='mock-map' />
    })

    render(() =>
      <LeafletMap
        rows={mockRows}
        center={center}
        zoom={zoom}
      />
    )

    expect(mapReadyMock).toHaveBeenCalledWith(center, zoom)
    spy.mockRestore()
  })

  it('calls Leaflet methods for each row in onMapReady', () => {
    const addToMock = vi.fn(() => ({
      bindPopup: bindPopupMock
    }))
    const bindPopupMock = vi.fn()
    const markerMock = vi.fn(() => ({
      addTo: addToMock
    }))
    const divIconMock = vi.fn(() => 'mock-icon')

    const lMock = {
      divIcon: divIconMock,
      marker: markerMock
    }

    const mMock = {}

    const spy = vi.spyOn(solidLeaflet, 'SolidLeafletMap').mockImplementation((props: any) => {
      props.onMapReady(lMock, mMock)
      return <div data-testid='mock-map' />
    })

    render(() => <LeafletMap rows={mockRows} />)

    expect(divIconMock).toHaveBeenCalledWith({ className: 'map-icon' })
    expect(markerMock).toHaveBeenCalledWith([57.7, 12.0], { icon: 'mock-icon' })
    expect(addToMock).toHaveBeenCalledWith(mMock)
    expect(bindPopupMock).toHaveBeenCalledWith('57.7, 12')
    spy.mockRestore()
  })
})
