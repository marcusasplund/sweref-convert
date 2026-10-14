// Author: Marcus Asplund
// Copyright (c) 2017 Marcus Asplund, marcus@greatname.se
// License: MIT License as follows:
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

// =============================================================================
// Converts latitude and longitude between:
// - DD, Decimal degree.
// - DM, Degree/minute.
// - DMS, Degree/minute/second.
// Accepts most input formats. Parser implemented in regexp.
//
// Converts from input format.

type Axis = 'latitude' | 'longitude'
type Format = 'dd' | 'dm' | 'dms'

const patterns = {
  dd: /^\s*([NSEW+-]?)\s*(\d{1,3}(?:[.,]\d+)?)\s*([NSEW]?)\s*$/,
  dm: /^\s*([NSEW+-]?)\s*(\d{1,3})°?\s*(\d{1,2}(?:[.,]\d+)?)['′]?\s*([NSEW]?)\s*$/,
  dms: /^\s*([NSEW+-]?)\s*(\d{1,3})°?\s*(\d{1,2})['′]?\s*(\d{1,2}(?:[.,]\d+)?)['″"]?\s*([NSEW]?)\s*$/
}

const parseCoordinate = (value: string, axis: Axis, format: Format): number | null => {
  const normalized = value.toUpperCase().replace(/Ö/g, 'E').replace(/V/g, 'W')
  const match = normalized.match(patterns[format])
  if (match === null) return null
  const prefix = match[1]
  const suffix = match[match.length - 1]
  const positive = axis === 'latitude' ? 'N' : 'E'
  const negative = axis === 'latitude' ? 'S' : 'W'
  if (prefix !== '' && !['+', '-', positive, negative].includes(prefix)) return null
  if (suffix !== '' && suffix !== positive && suffix !== negative) return null
  const prefixSign = prefix === '-' || prefix === negative ? -1 : 1
  const suffixSign = suffix === negative ? -1 : 1
  if (prefix !== '' && suffix !== '' && prefixSign !== suffixSign) return null
  const degrees = Number(match[2].replace(',', '.'))
  const minutes = format === 'dd' ? 0 : Number(match[3].replace(',', '.'))
  const seconds = format === 'dms' ? Number(match[4].replace(',', '.')) : 0
  if (minutes >= 60 || seconds >= 60) return null
  const magnitude = degrees + minutes / 60 + seconds / 3600
  if (magnitude > (axis === 'latitude' ? 90 : 180)) return null
  return magnitude * (prefix !== '' ? prefixSign : suffixSign)
}

const formatCoordinate = (value: number | null, axis: Axis, format: Format): string => {
  if (value === null || !Number.isFinite(value) || Math.abs(value) > (axis === 'latitude' ? 90 : 180)) return ''
  if (format === 'dd') return value.toFixed(6)
  const hemisphere = axis === 'latitude' ? (value >= 0 ? 'N' : 'S') : (value >= 0 ? 'E' : 'W')
  if (format === 'dm') {
    const units = Math.round(Math.abs(value) * 60 * 10000)
    const degrees = Math.floor(units / 600000)
    const minutes = ((units % 600000) / 10000).toFixed(4)
    return `${hemisphere} ${degrees}° ${minutes}′`
  }
  const units = Math.round(Math.abs(value) * 3600 * 100)
  const degrees = Math.floor(units / 360000)
  const minutes = Math.floor((units % 360000) / 6000)
  const seconds = ((units % 6000) / 100).toFixed(2)
  return `${hemisphere} ${degrees}° ${minutes}′ ${seconds}″`
}

const latFromDd = (value: string) => parseCoordinate(value, 'latitude', 'dd')
const lngFromDd = (value: string) => parseCoordinate(value, 'longitude', 'dd')
const latFromDm = (value: string) => parseCoordinate(value, 'latitude', 'dm')
const lngFromDm = (value: string) => parseCoordinate(value, 'longitude', 'dm')
const latFromDms = (value: string) => parseCoordinate(value, 'latitude', 'dms')
const lngFromDms = (value: string) => parseCoordinate(value, 'longitude', 'dms')
const latToDd = (value: number | null) => formatCoordinate(value, 'latitude', 'dd')
const lngToDd = (value: number | null) => formatCoordinate(value, 'longitude', 'dd')
const latToDm = (value: number | null) => formatCoordinate(value, 'latitude', 'dm')
const lngToDm = (value: number | null) => formatCoordinate(value, 'longitude', 'dm')
const latToDms = (value: number | null) => formatCoordinate(value, 'latitude', 'dms')
const lngToDms = (value: number | null) => formatCoordinate(value, 'longitude', 'dms')

export {
  latFromDd, lngFromDd, latFromDm, lngFromDm, latFromDms, lngFromDms,
  latToDd, lngToDd, latToDm, lngToDm, latToDms, lngToDms
}
