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

  // Normalize the input string
  value = value.replace(/[N]/gi, 'N')
  value = value.replace(/[S]/gi, 'S')

  // Regular expression to extract latitude components
  const result = value.match(/^\s*([NS\-+]?)\s*(\d{1,3})([.,]\d*)?\s*([NS]?)\s*$/)

  if (result != null) {
    if (result[2] !== '') {
      latitude = parseFloat(result[2])
    }
    if (latitude !== null && result[3] !== '' && result[3].replace(',', '.') !== '.') {
      latitude += parseFloat(result[3].replace(',', '.'))
    }
    if (latitude !== null && latitude > 90) {
      return null // Latitude cannot exceed 90
    }
    if (latitude !== null && ((result[1] !== '' && result[1] === 'S') || result[1] === '-')) {
      latitude *= -1
    } else if (latitude !== null && result[4] !== '' && result[4] === 'S') {
      latitude *= -1
    }
  }

  return latitude
}

const lngFromDd = (value: string): number | null => {
  let longitude: number | null = null

  // Normalize the input string
  value = value.replace(/[EÖ]/gi, 'E') // Replace Swedish "Öst" with "E"
  value = value.replace(/[WV]/gi, 'W') // Replace Swedish "Väst" with "W"

  // Regular expression to extract longitude components
  const result = value.match(/^\s*([EW\-+]?)\s*(\d{1,3})([.,]\d*)?\s*([EW]?)\s*$/)

  if (result != null) {
    if (result[2] !== '') {
      longitude = parseFloat(result[2])
    }
    if (longitude !== null && result[3] !== '' && result[3].replace(',', '.') !== '.') {
      longitude += parseFloat(result[3].replace(',', '.'))
    }
    if (longitude !== null && longitude > 180) {
      return null // Longitude cannot exceed 180
    }
    if (longitude !== null && ((result[1] !== '' && result[1] === 'W') || result[1] === '-')) {
      longitude *= -1
    } else if (longitude !== null && result[4] !== '' && result[4] === 'W') {
      longitude *= -1
    }
  }

  return longitude
}

const latFromDm = (value: string): number | null => {
  let latitude: number | null = null

  // Normalize the input string
  value = value.replace(/[N]/gi, 'N')
  value = value.replace(/[S]/gi, 'S')

  // Regular expression to extract latitude components
  const result = value.match(
    /^\s*([NS\-+]?)\s*(\d{1,3})°?\s*([0-5]?[0-9])?([.,]\d*)?'?\s*([NS]?)\s*$/
  )

  if (result != null) {
    if (result[2] !== '') {
      latitude = parseFloat(result[2])
    }

    if (latitude !== null && result[3] !== '') {
      latitude += parseFloat(result[3]) / 60
    }

    if (latitude !== null && result[4] !== '' && result[4].replace(',', '.') !== '.') {
      latitude += parseFloat(result[4].replace(',', '.')) / 60
    }

    if (latitude !== null && latitude > 90) {
      return null // Latitude cannot exceed 90
    }

    if (
      latitude !== null &&
        ((result[1] !== '' && result[1] === 'S') || result[1] === '-')
    ) {
      latitude *= -1
    } else if (latitude !== null && result[5] !== '' && result[5] === 'S') {
      latitude *= -1
    }
  }

  return latitude
}

const lngFromDm = (value: string): number | null => {
  let longitude: number | null = null

  // Normalize the input string
  value = value.replace(/[EÖ]/gi, 'E') // Replace Swedish "Öst" with "E"
  value = value.replace(/[WV]/gi, 'W') // Replace Swedish "Väst" with "W"

  // Regular expression to extract longitude components
  const result = value.match(
    /^\s*([EW\-+]?)\s*(\d{1,3})°?\s*([0-5]?[0-9])?([.,]\d*)?'?\s*([EW]?)\s*$/
  )

  if (result != null) {
    if (result[2] !== '') {
      longitude = parseFloat(result[2])
    }

    if (longitude !== null && result[3] !== '') {
      longitude += parseFloat(result[3]) / 60
    }

    if (longitude !== null && result[4] !== '' && result[4].replace(',', '.') !== '.') {
      longitude += parseFloat(result[4].replace(',', '.')) / 60
    }

    if (longitude !== null && longitude > 180) {
      return null // Longitude cannot exceed 180
    }

    if (
      longitude !== null &&
        ((result[1] !== '' && result[1] === 'W') || result[1] === '-')
    ) {
      longitude *= -1
    } else if (longitude !== null && result[5] !== '' && result[5] === 'W') {
      longitude *= -1
    }
  }

  return longitude
}

const latFromDms = (value: string): number | null => {
  let latitude: number | null = null

  // Normalize the input string
  value = value.replace(/[N]/gi, 'N')
  value = value.replace(/[S]/gi, 'S')

  // Regular expression to extract latitude components
  const result = value.match(
    /^\s*([NS\-+]?)\s*(\d{1,3})°?\s*([0-5]?[0-9])?'?\s*([0-5]?[0-9])?([.,]\d*)?'?\s*([NS]?)\s*$/
  )

  if (result != null) {
    if (result[2] !== '') {
      latitude = parseFloat(result[2])
    }

    if (latitude !== null && result[3] !== '') {
      latitude += parseFloat(result[3]) / 60
    }

    if (latitude !== null && result[4] !== '') {
      latitude += parseFloat(result[4]) / 3600
    }

    if (latitude !== null && result[5] !== '' && result[5].replace(',', '.') !== '.') {
      latitude += parseFloat(result[5].replace(',', '.')) / 3600
    }

    if (latitude !== null && latitude > 90) {
      return null // Latitude cannot exceed 90
    }

    if (
      latitude !== null &&
        ((result[1] !== '' && result[1] === 'S') || result[1] === '-')
    ) {
      latitude *= -1
    } else if (latitude !== null && result[6] !== '' && result[6] === 'S') {
      latitude *= -1
    }
  }

  return latitude
}

const lngFromDms = (value: string): number | null => {
  let longitude: number | null = null

  // Normalize the input string
  value = value.replace(/[EÖ]/gi, 'E') // Replace Swedish "Öst" with "E"
  value = value.replace(/[WV]/gi, 'W') // Replace Swedish "Väst" with "W"

  // Regular expression to extract longitude components
  const result = value.match(
    /^\s*([EW\-+]?)\s*(\d{1,3})°?\s*([0-5]?[0-9])?'?\s*([0-5]?[0-9])?([.,]\d*)?'?\s*([EW]?)\s*$/
  )

  if (result != null) {
    if (result[2] !== '') {
      longitude = parseFloat(result[2])
    }

    if (longitude !== null && result[3] !== '') {
      longitude += parseFloat(result[3]) / 60
    }

    if (longitude !== null && result[4] !== '') {
      longitude += parseFloat(result[4]) / 3600
    }

    if (longitude !== null && result[5] !== '' && result[5].replace(',', '.') !== '.') {
      longitude += parseFloat(result[5].replace(',', '.')) / 3600
    }

    if (longitude !== null && longitude > 180) {
      return null // Longitude cannot exceed 180
    }

    if (
      longitude !== null &&
        ((result[1] !== '' && result[1] === 'W') || result[1] === '-')
    ) {
      longitude *= -1
    } else if (longitude !== null && result[6] !== '' && result[6] === 'W') {
      longitude *= -1
    }
  }

  return longitude
}

const latToDd = (value: number | null): string => {
  if (value === null) {
    return ''
  }
  return value.toFixed(6) // Round to 6 decimal places
}

const lngToDd = (value: number | null): string => {
  if (value === null) {
    return ''
  }
  return value.toFixed(6) // Round to 6 decimal places
}

const latToDm = (value: number | null): string => {
  if (value === null) {
    return ''
  }

  value += 0.0000008 // Round to the nearest 0.5 minutes
  const degrees = Math.floor(Math.abs(value))
  const minutes = (Math.abs(value) - degrees) * 60

  const hemisphere = value >= 0 ? 'N' : 'S'
  return `${hemisphere} ${degrees}\u00b0 ${(
      Math.floor(minutes * 10000) / 10000
  ).toFixed(4)}\u2032`
}

const lngToDm = (value: number | null): string => {
  if (value === null) {
    return ''
  }

  value += 0.0000008 // Round to the nearest 0.5 minutes
  const degrees = Math.floor(Math.abs(value))
  const minutes = (Math.abs(value) - degrees) * 60

  const hemisphere = value >= 0 ? 'E' : 'W'
  return `${hemisphere} ${degrees}\u00b0 ${(
      Math.floor(minutes * 10000) / 10000
  ).toFixed(4)}\u2032`
}

const latToDms = (value: number | null): string => {
  if (value === null) {
    return ''
  }

  value += 0.0000014 // Round to the nearest 0.5 seconds
  const degrees = Math.floor(Math.abs(value))
  const minutes = Math.floor((Math.abs(value) - degrees) * 60)
  const seconds = ((Math.abs(value) - degrees - minutes / 60) * 3600)

  const hemisphere = value >= 0 ? 'N' : 'S'
  return `${hemisphere} ${degrees}\u00b0 ${minutes}\u2032 ${(
      Math.floor(seconds * 100) / 100
  ).toFixed(2)}\u2033`
}

const lngToDms = (value: number | null): string => {
  if (value === null) {
    return ''
  }

  value += 0.0000014 // Round to the nearest 0.5 seconds
  const degrees = Math.floor(Math.abs(value))
  const minutes = Math.floor((Math.abs(value) - degrees) * 60)
  const seconds = ((Math.abs(value) - degrees - minutes / 60) * 3600)

  const hemisphere = value >= 0 ? 'E' : 'W'
  return `${hemisphere} ${degrees}\u00b0 ${minutes}\u2032 ${(
      Math.floor(seconds * 100) / 100
  ).toFixed(2)}\u2033`
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
