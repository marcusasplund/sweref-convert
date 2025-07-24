/* eslint-disable no-unused-vars */

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

const latFromDd = (value: string): number | null => {
  let latitude: number | null = null
  value = value.replace(/[N]/gi, 'N').replace(/[S]/gi, 'S')
  const result = value.match(/^\s*([NS\-+]?)\s*(\d{1,3})([.,]\d*)?\s*([NS]?)\s*$/)

  if (result !== null) {
    const hemispherePrefix = result[1] ?? ''
    const degrees = result[2] ?? ''
    const decimal = result[3] ?? ''
    const hemisphereSuffix = result[4] ?? ''

    if (degrees !== '') latitude = parseFloat(degrees)
    if (latitude !== null && decimal !== '' && decimal.replace(',', '.') !== '.') {
      latitude += parseFloat(decimal.replace(',', '.'))
    }
    if (latitude !== null && latitude > 90) return null
    if (latitude !== null && (hemispherePrefix === 'S' || hemispherePrefix === '-')) latitude *= -1
    else if (latitude !== null && hemisphereSuffix === 'S') latitude *= -1
  }

  return latitude
}

const lngFromDd = (value: string): number | null => {
  let longitude: number | null = null
  value = value.replace(/[EÖ]/gi, 'E').replace(/[WV]/gi, 'W')
  const result = value.match(/^\s*([EW\-+]?)\s*(\d{1,3})([.,]\d*)?\s*([EW]?)\s*$/)

  if (result !== null) {
    const hemispherePrefix = result[1] ?? ''
    const degrees = result[2] ?? ''
    const decimal = result[3] ?? ''
    const hemisphereSuffix = result[4] ?? ''

    if (degrees !== '') longitude = parseFloat(degrees)
    if (longitude !== null && decimal !== '' && decimal.replace(',', '.') !== '.') {
      longitude += parseFloat(decimal.replace(',', '.'))
    }
    if (longitude !== null && longitude > 180) return null
    if (longitude !== null && (hemispherePrefix === 'W' || hemispherePrefix === '-')) longitude *= -1
    else if (longitude !== null && hemisphereSuffix === 'W') longitude *= -1
  }

  return longitude
}

const latFromDm = (value: string): number | null => {
  let latitude: number | null = null
  value = value.replace(/[NS]/gi, m => m)
  const result = value.match(/^\s*([NS\-+]?)\s*(\d{1,3})°?\s*([0-5]?[0-9])?([.,]\d*)?['′]?\s*([NS]?)\s*$/)

  if (result !== null) {
    const hemispherePrefix = result[1] ?? ''
    const degrees = result[2] ?? ''
    const minutes = result[3] ?? ''
    const decimals = result[4] ?? ''
    const hemisphereSuffix = result[5] ?? ''

    if (degrees !== '') latitude = parseFloat(degrees)
    if (latitude !== null && minutes !== '') latitude += parseFloat(minutes) / 60
    if (latitude !== null && decimals !== '' && decimals.replace(',', '.') !== '.') {
      latitude += parseFloat(decimals.replace(',', '.')) / 60
    }
    if (latitude !== null && latitude > 90) return null
    if (latitude !== null && (hemispherePrefix === 'S' || hemispherePrefix === '-')) latitude *= -1
    else if (latitude !== null && hemisphereSuffix === 'S') latitude *= -1
  }

  return latitude
}

const lngFromDm = (value: string): number | null => {
  let longitude: number | null = null
  value = value.replace(/[EÖ]/gi, 'E').replace(/[WV]/gi, 'W')
  const result = value.match(/^\s*([EW\-+]?)\s*(\d{1,3})°?\s*([0-5]?[0-9])?([.,]\d*)?['′]?\s*([EW]?)\s*$/)

  if (result !== null) {
    const hemispherePrefix = result[1] ?? ''
    const degrees = result[2] ?? ''
    const minutes = result[3] ?? ''
    const decimals = result[4] ?? ''
    const hemisphereSuffix = result[5] ?? ''

    if (degrees !== '') longitude = parseFloat(degrees)
    if (longitude !== null && minutes !== '') longitude += parseFloat(minutes) / 60
    if (longitude !== null && decimals !== '' && decimals.replace(',', '.') !== '.') {
      longitude += parseFloat(decimals.replace(',', '.')) / 60
    }
    if (longitude !== null && longitude > 180) return null
    if (longitude !== null && (hemispherePrefix === 'W' || hemispherePrefix === '-')) longitude *= -1
    else if (longitude !== null && hemisphereSuffix === 'W') longitude *= -1
  }

  return longitude
}

const latFromDms = (value: string): number | null => {
  let latitude: number | null = null
  value = value.replace(/[NS]/gi, m => m)
  const result = value.match(/^\s*([NS\-+]?)\s*(\d{1,3})°?\s*([0-5]?[0-9])?['′]?\s*([0-5]?[0-9])?([.,]\d*)?['″"]?\s*([NS]?)\s*$/)

  if (result !== null) {
    const hemispherePrefix = result[1] ?? ''
    const degrees = result[2] ?? ''
    const minutes = result[3] ?? ''
    const seconds = result[4] ?? ''
    const decimals = result[5] ?? ''
    const hemisphereSuffix = result[6] ?? ''

    if (degrees !== '') latitude = parseFloat(degrees)
    if (latitude !== null && minutes !== '') latitude += parseFloat(minutes) / 60
    if (latitude !== null && seconds !== '') latitude += parseFloat(seconds) / 3600
    if (latitude !== null && decimals !== '' && decimals.replace(',', '.') !== '.') {
      latitude += parseFloat(decimals.replace(',', '.')) / 3600
    }
    if (latitude !== null && latitude > 90) return null
    if (latitude !== null && (hemispherePrefix === 'S' || hemispherePrefix === '-')) latitude *= -1
    else if (latitude !== null && hemisphereSuffix === 'S') latitude *= -1
  }

  return latitude
}

const lngFromDms = (value: string): number | null => {
  let longitude: number | null = null
  value = value.replace(/[EÖ]/gi, 'E').replace(/[WV]/gi, 'W')
  const result = value.match(/^\s*([EW\-+]?)\s*(\d{1,3})°?\s*([0-5]?[0-9])?['′]?\s*([0-5]?[0-9])?([.,]\d*)?['″"]?\s*([EW]?)\s*$/)

  if (result !== null) {
    const hemispherePrefix = result[1] ?? ''
    const degrees = result[2] ?? ''
    const minutes = result[3] ?? ''
    const seconds = result[4] ?? ''
    const decimals = result[5] ?? ''
    const hemisphereSuffix = result[6] ?? ''

    if (degrees !== '') longitude = parseFloat(degrees)
    if (longitude !== null && minutes !== '') longitude += parseFloat(minutes) / 60
    if (longitude !== null && seconds !== '') longitude += parseFloat(seconds) / 3600
    if (longitude !== null && decimals !== '' && decimals.replace(',', '.') !== '.') {
      longitude += parseFloat(decimals.replace(',', '.')) / 3600
    }
    if (longitude !== null && longitude > 180) return null
    if (longitude !== null && (hemispherePrefix === 'W' || hemispherePrefix === '-')) longitude *= -1
    else if (longitude !== null && hemisphereSuffix === 'W') longitude *= -1
  }

  return longitude
}

const latToDd = (value: number | null): string => value === null ? '' : value.toFixed(6)
const lngToDd = (value: number | null): string => value === null ? '' : value.toFixed(6)

const latToDm = (value: number | null): string => {
  if (value === null) return ''
  const hemisphere = value >= 0 ? 'N' : 'S'
  const totalMinutes = Math.abs(value) * 60
  const rounded = Math.round(totalMinutes * 10000) / 10000
  const degrees = Math.floor(rounded / 60)
  const minutes = (rounded - degrees * 60).toFixed(4)
  return `${hemisphere} ${degrees}° ${minutes}′`
}

const lngToDm = (value: number | null): string => {
  if (value === null) return ''
  const hemisphere = value >= 0 ? 'E' : 'W'
  const totalMinutes = Math.abs(value) * 60
  const rounded = Math.round(totalMinutes * 10000) / 10000
  const degrees = Math.floor(rounded / 60)
  const minutes = (rounded - degrees * 60).toFixed(4)
  return `${hemisphere} ${degrees}° ${minutes}′`
}

const latToDms = (value: number | null): string => {
  if (value === null) return ''
  const hemisphere = value >= 0 ? 'N' : 'S'
  const absValue = Math.abs(value)
  const degrees = Math.floor(absValue)
  const minutes = Math.floor((absValue - degrees) * 60)
  const seconds = ((absValue - degrees - minutes / 60) * 3600)
  const rounded = (Math.round(seconds * 100) / 100).toFixed(2)
  return `${hemisphere} ${degrees}° ${minutes}′ ${rounded}″`
}

const lngToDms = (value: number | null): string => {
  if (value === null) return ''
  const hemisphere = value >= 0 ? 'E' : 'W'
  const absValue = Math.abs(value)
  const degrees = Math.floor(absValue)
  const minutes = Math.floor((absValue - degrees) * 60)
  const seconds = ((absValue - degrees - minutes / 60) * 3600)
  const rounded = (Math.round(seconds * 100) / 100).toFixed(2)
  return `${hemisphere} ${degrees}° ${minutes}′ ${rounded}″`
}

export {
  latFromDd,
  lngFromDd,
  latFromDm,
  lngFromDm,
  latFromDms,
  lngFromDms,
  latToDd,
  lngToDd,
  latToDm,
  lngToDm,
  latToDms,
  lngToDms
}
