import { describe, it, expect } from 'vitest'
import { geodeticToGrid } from './geodeticToGrid'
import { projectionParams } from './projectionParams'
import type { ProjectionParams } from '../types'

// Helper to clone and override parameters
const makeParams = (overrides: Partial<ProjectionParams>): ProjectionParams => {
  return { ...projectionParams('testCase'), ...overrides }
}

describe('geodeticToGrid', () => {
  it('returns zero coordinates when centralMeridian is null or zero', () => {
    // centralMeridian null
    const p1 = makeParams({ centralMeridian: null })
    const result1 = geodeticToGrid(60, 18, p1)
    expect(result1).toEqual({ x: 0, y: 0 })

    // centralMeridian zero
    const p2 = makeParams({ centralMeridian: 0 })
    const result2 = geodeticToGrid(60, 18, p2)
    expect(result2).toEqual({ x: 0, y: 0 })
  })

  it('calculates correct grid for known testCase parameters', () => {
    // Use the built-in testCase from projectionParams
    const params = projectionParams('testCase')
    // Known geodetic input: latitude 66°0'0", longitude 24°0'0"
    const lat = 66.0
    const lng = 24.0
    const { x, y } = geodeticToGrid(lat, lng, params)
    // Expected from spec: X:1135809.414, Y:555304.017 (rounded to 3 decimals)
    expect(x).toBeCloseTo(1135809.414, 3)
    expect(y).toBeCloseTo(555304.017, 3)
  })
})
