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
