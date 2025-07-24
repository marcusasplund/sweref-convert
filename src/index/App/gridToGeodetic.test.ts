import { describe, it, expect } from 'vitest'
import { gridToGeodetic } from './gridToGeodetic'
import { projectionParams } from './projectionParams'
import type { ProjectionParams } from '../types'

// Helper to clone and override parameters
const makeParams = (overrides: Partial<ProjectionParams>): ProjectionParams => {
  return { ...projectionParams('testCase'), ...overrides }
}

describe('gridToGeodetic', () => {
  it('returns zero coordinates when centralMeridian is null', () => {
    const params = makeParams({ centralMeridian: null })
    const result = gridToGeodetic(1000, 2000, params)
    expect(result).toEqual({ lat: 0, lng: 0 })
  })

  it('calculates correct lat/lng for known testCase', () => {
    // Use the built-in testCase from projectionParams
    const params = projectionParams('testCase')
    // Known grid input from spec: X≈1135809.413803, Y≈555304.016555
    const x = 1135809.413803
    const y = 555304.016555
    const { lat, lng } = gridToGeodetic(x, y, params)
    // Expected geodetic: lat=66.0, lng=24.0
    expect(lat).toBeCloseTo(66.0, 6)
    expect(lng).toBeCloseTo(24.0, 6)
  })
})
