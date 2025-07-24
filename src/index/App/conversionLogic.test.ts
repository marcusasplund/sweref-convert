import { describe, it, expect, vi, beforeEach, Mock } from 'vitest'

import { convertRow } from './conversionLogic'
import { geodeticToGrid } from './geodeticToGrid'
import { gridToGeodetic } from './gridToGeodetic'
import { latToDms, lngToDms } from './latlngConvert'

// Mock geodeticToGrid and gridToGeodetic
vi.mock('./geodeticToGrid', () => ({
  geodeticToGrid: vi.fn()
}))
vi.mock('./gridToGeodetic', () => ({
  gridToGeodetic: vi.fn()
}))

describe('convertRow', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('no-op when same projection', () => {
    const result = convertRow(5, 6, 'wgs84', 'wgs84')
    expect(result).toEqual({
      x: 5,
      y: 6,
      lat: 5,
      lng: 6,
      x2: 0,
      y2: 0,
      latdms: latToDms(5),
      lngdms: lngToDms(6)
    })
  })

  it('Grid -> Grid via WGS84 branch', () => {
    ;(gridToGeodetic as Mock).mockReturnValue({ lat: 12.34, lng: 56.78 })
    ;(geodeticToGrid as Mock).mockReturnValue({ x: 90, y: 123 })

    const result = convertRow(1, 2, 'rt9075gonV', 'sweref99tm') as any
    expect(gridToGeodetic).toHaveBeenCalledWith(1, 2, expect.any(Object))
    expect(geodeticToGrid).toHaveBeenCalledWith(12.34, 56.78, expect.any(Object))
    expect(result).toEqual({
      x: 1,
      y: 2,
      lat: 12.34,
      lng: 56.78,
      x2: 90,
      y2: 123,
      latdms: latToDms(12.34),
      lngdms: lngToDms(56.78)
    })
  })

  it('WGS84 -> Grid branch', () => {
    ;(geodeticToGrid as Mock).mockReturnValue({ x: 200, y: 300 })

    const result = convertRow(10, 20, 'wgs84', 'rt9075gonV') as any
    expect(geodeticToGrid).toHaveBeenCalledWith(10, 20, expect.any(Object))
    expect(result).toEqual({
      x: 200,
      y: 300,
      lat: 10,
      lng: 20,
      x2: 0,
      y2: 0,
      latdms: latToDms(10),
      lngdms: lngToDms(20)
    })
  })

  it('Grid -> WGS84 branch', () => {
    ;(gridToGeodetic as Mock).mockReturnValue({ lat: 7.65, lng: 4.32 })

    const result = convertRow(3, 4, 'rt9075gonV', 'wgs84') as any
    expect(gridToGeodetic).toHaveBeenCalledWith(3, 4, expect.any(Object))
    expect(result).toEqual({
      x: 3,
      y: 4,
      lat: 7.65,
      lng: 4.32,
      x2: 0,
      y2: 0,
      latdms: latToDms(7.65),
      lngdms: lngToDms(4.32)
    })
  })
})
