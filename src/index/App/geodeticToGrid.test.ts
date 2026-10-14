import { describe, it, expect } from 'vitest'
import { geodeticToGrid } from './geodeticToGrid'
import { projectionParams } from './projectionParams'
import type { ProjectionParams } from '../types'

// Helper to clone and override parameters
const makeParams = (overrides: Partial<ProjectionParams>): ProjectionParams => {
  return { ...projectionParams('testCase'), ...overrides }
}

describe('geodeticToGrid', () => {
  it('rejects missing projection parameters instead of returning zero coordinates', () => {
    expect(() => geodeticToGrid(60, 18, makeParams({ centralMeridian: null }))).toThrow(RangeError)
    expect(() => geodeticToGrid(60, 18, makeParams({ axis: 0 }))).toThrow(RangeError)
    expect(() => geodeticToGrid(NaN, 18, makeParams({}))).toThrow(RangeError)
  })

  it('accepts a central meridian of zero', () => {
    expect(() => geodeticToGrid(60, 18, makeParams({ centralMeridian: 0 }))).not.toThrow()
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

it('retains sub-millimetre precision for intermediate calculations', () => {
  const result = geodeticToGrid(66, 24, projectionParams('testCase'))
  expect(result.x).toBeCloseTo(1135809.413803, 4)
  expect(result.y).toBeCloseTo(555304.016555, 4)
  expect(result.x).not.toBe(Number(result.x.toFixed(3)))
})
