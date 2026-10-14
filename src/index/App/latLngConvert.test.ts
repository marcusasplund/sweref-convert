import {
  latFromDd, lngFromDd,
  latFromDm, lngFromDm,
  latFromDms, lngFromDms,
  latToDd, lngToDd,
  latToDm, lngToDm,
  latToDms, lngToDms
} from './latlngConvert'

import { describe, it, expect } from 'vitest'

describe('Coordinate conversion', () => {
  describe('latFromDd', () => {
    it('parses positive and negative decimal degrees with hemisphere', () => {
      expect(latFromDd('N 57.7')).toBeCloseTo(57.7)
      expect(latFromDd('S 57.7')).toBeCloseTo(-57.7)
      expect(latFromDd('-57.7')).toBeCloseTo(-57.7)
      expect(latFromDd('+57.7')).toBeCloseTo(57.7)
      expect(latFromDd('57,7 S')).toBeCloseTo(-57.7)
    })

    it('returns null for out-of-range input', () => {
      expect(latFromDd('91')).toBeNull()
    })
  })

  describe('lngFromDd', () => {
    it('parses E/W/Ö/V format', () => {
      expect(lngFromDd('E 12.5')).toBeCloseTo(12.5)
      expect(lngFromDd('Ö 12,5')).toBeCloseTo(12.5)
      expect(lngFromDd('W 12.5')).toBeCloseTo(-12.5)
      expect(lngFromDd('-12.5')).toBeCloseTo(-12.5)
      expect(lngFromDd('12.5 W')).toBeCloseTo(-12.5)
    })

    it('returns null for out-of-range', () => {
      expect(lngFromDd('181')).toBeNull()
    })
  })

  describe('latFromDm / lngFromDm', () => {
    it('parses lat DM', () => {
      expect(latFromDm('N 57°30.0′')).toBeCloseTo(57.5)
      expect(latFromDm('57 30 S')).toBeCloseTo(-57.5)
    })

    it('parses lng DM', () => {
      expect(lngFromDm('E 12°30.0′')).toBeCloseTo(12.5)
      expect(lngFromDm('12 30 W')).toBeCloseTo(-12.5)
    })

    it('returns null for out-of-range', () => {
      expect(latFromDm('91°0′')).toBeNull()
      expect(lngFromDm('181°0′')).toBeNull()
    })
  })

  describe('latFromDms / lngFromDms', () => {
    it('parses lat DMS', () => {
      expect(latFromDms('N 57°30′0″')).toBeCloseTo(57.5)
      expect(latFromDms('57°30′0″ S')).toBeCloseTo(-57.5)
    })

    it('parses DMS with decimal seconds', () => {
      expect(latFromDms('N 57°30′0,5″')).toBeCloseTo(57.5 + 0.5 / 3600)
      expect(latFromDms('S 57°30′0.75″')).toBeCloseTo(-(57.5 + 0.75 / 3600))
    })

    it('parses lng DMS', () => {
      expect(lngFromDms('E 12°30′0″')).toBeCloseTo(12.5)
      expect(lngFromDms('12°30′0″ W')).toBeCloseTo(-12.5)
    })

    it('parses DMS with decimal seconds', () => {
      expect(lngFromDms('E 12°30′0,5″')).toBeCloseTo(12.5 + 0.5 / 3600)
      expect(lngFromDms('W 12°30′0.75″')).toBeCloseTo(-(12.5 + 0.75 / 3600))
    })

    it('returns null for out-of-range', () => {
      expect(latFromDms('91°0′0″')).toBeNull()
      expect(lngFromDms('181°0′0″')).toBeNull()
    })
  })

  describe('To DD', () => {
    it('formats to decimal degrees', () => {
      expect(latToDd(57.7)).toBe('57.700000')
      expect(lngToDd(-12.3456)).toBe('-12.345600')
      expect(latToDd(null)).toBe('')
    })
  })

  describe('To DM', () => {
    it('formats to degree-minute with hemisphere', () => {
      expect(latToDm(57.5)).toMatch(/^N 57° 30\.0000′$/)
      expect(latToDm(-57.5)).toMatch(/^S 57° 30\.0000′$/)
      expect(lngToDm(12.5)).toMatch(/^E 12° 30\.0000′$/)
      expect(lngToDm(-12.5)).toMatch(/^W 12° 30\.0000′$/)
      expect(latToDm(null)).toBe('')
    })
  })

  describe('To DMS', () => {
    it('formats to degree-minute-second with hemisphere', () => {
      expect(latToDms(57.5)).toMatch(/^N 57° 30′ 0\.00″$/)
      expect(latToDms(-57.5)).toMatch(/^S 57° 30′ 0\.00″$/)
      expect(lngToDms(12.5)).toMatch(/^E 12° 30′ 0\.00″$/)
      expect(lngToDms(-12.5)).toMatch(/^W 12° 30′ 0\.00″$/)
      expect(latToDms(null)).toBe('')
    })
  })
})

describe('coordinate validation and rounding', () => {
  it('rejects conflicting hemispheres and signs in every format', () => {
    for (const [parse, inputs] of [
      [latFromDd, ['N 57.7 S', '-57.7 N', '+57.7 S']],
      [lngFromDd, ['E 11.9 W', '-11.9 E', '+11.9 W']],
      [latFromDm, ['N 57°30′ S', '-57°30′ N']],
      [lngFromDm, ['E 11°30′ W', '-11°30′ E']],
      [latFromDms, ['N 57°30′0″ S', '-57°30′0″ N']],
      [lngFromDms, ['E 11°30′0″ W', '-11°30′0″ E']]
    ] as const) {
      for (const input of inputs) expect(parse(input), input).toBeNull()
    }
  })

  it('accepts matching signs, repeated hemispheres, and lowercase aliases', () => {
    expect(latFromDd('-57.7 S')).toBe(-57.7)
    expect(latFromDd('n 57.7 n')).toBe(57.7)
    expect(latFromDm('s 57°30′')).toBe(-57.5)
    expect(lngFromDms('ö 11°30′0″')).toBe(11.5)
    expect(lngFromDms('v 11°30′0″')).toBe(-11.5)
  })

  it('carries rounded seconds through minutes and degrees', () => {
    expect(latToDms(57 + 59 / 60 + 59.999 / 3600)).toBe('N 58° 0′ 0.00″')
    expect(lngToDms(-(11 + 30 / 60 + 59.999 / 3600))).toBe('W 11° 31′ 0.00″')
    expect(latToDms(89 + 59 / 60 + 59.999 / 3600)).toBe('N 90° 0′ 0.00″')
    expect(lngToDms(179 + 59 / 60 + 59.999 / 3600)).toBe('E 180° 0′ 0.00″')
  })

  it('rejects minutes and seconds outside their ranges', () => {
    expect(latFromDm('57°60′')).toBeNull()
    expect(latFromDms('57°30′60″')).toBeNull()
    expect(lngFromDms('180°0′0.01″')).toBeNull()
    expect(latFromDd('57.')).toBeNull()
  })
})
