import { describe, it, expect } from 'vitest'
import { projectionParams } from './projectionParams'
import type { ProjectionParams } from '../types'

describe('projectionParams', () => {
  it('returns correct parameters for testCase', () => {
    const params: ProjectionParams = projectionParams('testCase')
    // testCase defined in module should match expected
    expect(params.axis).toBeCloseTo(6378137.0)
    expect(params.flattening).toBeCloseTo(1.0 / 298.257222101)
    expect(params.centralMeridian).toBeCloseTo(13.0 + 35.0 / 60.0 + 7.692000 / 3600.0)
    expect(params.latOfOrigin).toBe(0.0)
    expect(params.scale).toBeCloseTo(1.000002540000)
    expect(params.falseNorthing).toBeCloseTo(-6226307.8640)
    expect(params.falseEasting).toBeCloseTo(84182.8790)
  })

  it('returns GRS80-based parameters for rt9075gonV', () => {
    const params = projectionParams('rt9075gonV')
    // Base ellipsoid values from grs80Params
    expect(params.axis).toBeCloseTo(6378137.0)
    expect(params.flattening).toBeCloseTo(1.0 / 298.257222101)
    // Specific overrides
    const expectedMeridian = 11.0 + 18.375 / 60.0
    expect(params.centralMeridian).toBeCloseTo(expectedMeridian)
    expect(params.latOfOrigin).toBe(0.0)
    expect(params.scale).toBeCloseTo(1.000006000000)
    expect(params.falseNorthing).toBeCloseTo(-667.282)
    expect(params.falseEasting).toBeCloseTo(1500025.141)
  })

  it('returns SWEREF99TM parameters for sweref99tm', () => {
    const params = projectionParams('sweref99tm')
    // Base ellipsoid values from sweref99Params
    expect(params.axis).toBeCloseTo(6378137.0)
    expect(params.flattening).toBeCloseTo(1.0 / 298.257222101)
    // Specific overrides
    expect(params.centralMeridian).toBeCloseTo(15.0)
    expect(params.latOfOrigin).toBe(0.0)
    expect(params.scale).toBeCloseTo(0.9996)
    expect(params.falseNorthing).toBeCloseTo(0.0)
    expect(params.falseEasting).toBeCloseTo(500000.0)
  })
})
