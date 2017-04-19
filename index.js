/* eslint-disable no-unused-vars */
// Author: Arnold Andreasson, info@mellifica.se
// Copyright (c) 2007-2016 Arnold Andreasson 
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
const latFromDd = (value) => {
  let latitude
  value = value.replace(/[N]/gi, 'N')
  value = value.replace(/[S]/gi, 'S')
  let result = value.match(/^\s*([NS\-+]?)\s*(\d{1,3})([.,]\d*)?\s*([NS]?)\s*$/)
  if (result !== null) {
    if ((result[2] !== '') && (result[2] !== null)) {
      latitude = parseFloat(result[2])
    }
    if ((result[3] !== '') && (result[3] !== null) && (result[3].replace(',', '.') !== '.')) {
      latitude += parseFloat(result[3].replace(',', '.'))
    }
    if (latitude > 90) {
      latitude = null
      return latitude
    }
    if ((result[1] !== '') && (result[1] !== null) && ((result[1] === 'S') || (result[1] === '-'))) {
      latitude *= -1
    } else {
      if ((result[4] !== '') && (result[4] !== null) && ((result[4] === 'S'))) {
        latitude *= -1
      }
    }
  } else {
    latitude = null
  }
  return latitude
}
const lngFromDd = (value) => {
  let longitude
  value = value.replace(/[EÖ]/gi, 'E') // Note: ö=Öst for swedish users.
  value = value.replace(/[WV]/gi, 'W') // Note: v=Väst for swedish users.
  let result = value.match(/^\s*([EW\-+]?)\s*(\d{1,3})([.,]\d*)?\s*([EW]?)\s*$/)
  if (result !== null) {
    if ((result[2] !== '') && (result[2] !== null)) {
      longitude = parseFloat(result[2])
    }
    if ((result[3] !== '') && (result[3] !== null) && (result[3].replace(',', '.') !== '.')) {
      longitude += parseFloat(result[3].replace(',', '.'))
    }
    if (longitude > 180) {
      longitude = null
      return longitude
    }
    if ((result[1] !== '') && (result[1] !== null) && ((result[1] === 'W') || (result[1] === '-'))) {
      longitude *= -1
    } else {
      if ((result[4] !== '') && (result[4] !== null) && ((result[4] === 'W'))) {
        longitude *= -1
      }
    }
  } else {
    longitude = null
  }
  return longitude
}
const latFromDm = (value) => {
  let latitude
  value = value.replace(/[N]/gi, 'N')
  value = value.replace(/[S]/gi, 'S')
  let result = value.match(
    /^\s*([NS\-+]?)\s*(\d{1,3})°?\s*([0-5]?[0-9])?([.,]\d*)?'?\s*([NS]?)\s*$/
  )
  if (result !== null) {
    if ((result[2] !== '') && (result[2] !== null)) {
      latitude = parseFloat(result[2])
    }
    if ((result[3] !== '') && (result[3] !== null)) {
      latitude += parseFloat(result[3]) / 60
    }
    if ((result[4] !== '') && (result[4] !== null) && (result[4].replace(',', '.') !== '.')) {
      latitude += parseFloat(result[4].replace(',', '.')) / 60
    }
    if (latitude > 90) {
      latitude = null
      return latitude
    }
    if ((result[1] !== '') && (result[1] !== null) && ((result[1] === 'S') || (result[1] === '-'))) {
      latitude *= -1
    } else {
      if ((result[5] !== '') && (result[5] !== null) && ((result[5] === 'S'))) {
        latitude *= -1
      }
    }
  } else {
    latitude = null
  }
  return latitude
}
const lngFromDm = (value) => {
  let longitude
  value = value.replace(/[EÖ]/gi, 'E')
  value = value.replace(/[WV]/gi, 'W')
  let result = value.match(
    /^\s*([EW\-+]?)\s*(\d{1,3})°?\s*([0-5]?[0-9])?([.,]\d*)?'?\s*([EW]?)\s*$/
  )
  if (result !== null) {
    if ((result[2] !== '') && (result[2] !== null)) {
      longitude = parseFloat(result[2])
    }
    if ((result[3] !== '') && (result[3] !== null)) {
      longitude += parseFloat(result[3]) / 60
    }
    if ((result[4] !== '') && (result[4] !== null) && (result[4].replace(',', '.') !== '.')) {
      longitude += parseFloat(result[4].replace(',', '.')) / 60
    }
    if (longitude > 180) {
      longitude = null
      return longitude
    }
    if ((result[1] !== '') && (result[1] !== null) && ((result[1] === 'W') || (result[1] === '-'))) {
      longitude *= -1
    } else {
      if ((result[5] !== '') && (result[5] !== null) && ((result[5] === 'W'))) {
        longitude *= -1
      }
    }
  } else {
    longitude = null
  }
  return longitude
}
const latFromDms = (value) => {
  let latitude
  value = value.replace(/[N]/gi, 'N')
  value = value.replace(/[S]/gi, 'S')
  let result = value.match(
    /^\s*([NS\-+]?)\s*(\d{1,3})°?\s*([0-5]?[0-9])?'?\s*([0-5]?[0-9])?([.,]\d*)?'?\s*([NS]?)\s*$/
  )
  if (result !== null) {
    if ((result[2] !== '') && (result[2] !== null)) {
      latitude = parseFloat(result[2])
    }
    if ((result[3] !== '') && (result[3] !== null)) {
      latitude += parseFloat(result[3]) / 60
    }
    if ((result[4] !== '') && (result[4] !== null)) {
      latitude += parseFloat(result[4]) / 3600
    }
    if ((result[5] !== '') && (result[5] !== null) && (result[5].replace(',', '.') !== '.')) {
      latitude += parseFloat(result[5].replace(',', '.')) / 3600
    }
    if (latitude > 90) {
      latitude = null
      return latitude
    }
    if ((result[1] !== '') && (result[1] !== null) && ((result[1] === 'S') || (result[1] === '-'))) {
      latitude *= -1
    } else {
      if ((result[6] !== '') && (result[6] !== null) && ((result[6] === 'S'))) {
        latitude *= -1
      }
    }
  } else {
    latitude = null
  }
  return latitude
}
const lngFromDms = (value) => {
  let longitude
  value = value.replace(/[EÖ]/gi, 'E')
  value = value.replace(/[WV]/gi, 'W')
  let result = value.match(
    /^\s*([EW\-+]?)\s*(\d{1,3})°?\s*([0-5]?[0-9])?'?\s*([0-5]?[0-9])?([.,]\d*)?'?\s*([EW]?)\s*$/
  )
  if (result !== null) {
    if ((result[2] !== '') && (result[2] !== null)) {
      longitude = parseFloat(result[2])
    }
    if ((result[3] !== '') && (result[3] !== null)) {
      longitude += parseFloat(result[3]) / 60
    }
    if ((result[4] !== '') && (result[4] !== null)) {
      longitude += parseFloat(result[4]) / 3600
    }
    if ((result[5] !== '') && (result[5] !== null) && (result[5].replace(',', '.') !== '.')) {
      longitude += parseFloat(result[5].replace(',', '.')) / 3600
    }
    if (longitude > 180) {
      longitude = null
      return longitude
    }
    if ((result[1] !== '') && (result[1] !== null) && ((result[1] === 'W') || (result[1] === '-'))) {
      longitude *= -1
    } else {
      if ((result[6] !== '') && (result[6] !== null) && ((result[6] === 'W'))) {
        longitude *= -1
      }
    }
  } else {
    longitude = null
  }
  return longitude
}
const latToDd = (value) => {
  if (value === null) {
    return ''
  }
  return value.toFixed(6) // Round.
}
const lngToDd = (value) => {
  if (value === null) {
    return ''
  }
  return value.toFixed(6) // Round.
}
const latToDm = (value) => {
  if (value === null) {
    return ''
  }
  value += 0.0000008 // Round (= 0.5 min).
  let degrees = Math.floor(Math.abs(value))
  let minutes = (Math.abs(value) - degrees) * 60
  if (value >= 0) {
    return 'N ' + degrees + '° ' + (
      Math.floor(minutes * 10000) / 10000
    ).toFixed(4) + '\u2032 '
  } else {
    return 'S ' + degrees + '° ' + (
      Math.floor(minutes * 10000) / 10000
    ).toFixed(4) + '\u2032 '
  }
}
const lngToDm = (value) => {
  if (value === null) {
    return ''
  }
  value += 0.0000008 // Round (= 0.5 min).
  let degrees = Math.floor(Math.abs(value))
  let minutes = (Math.abs(value) - degrees) * 60
  if (value >= 0) {
    return 'E ' + degrees + '° ' + (
      Math.floor(minutes * 10000) / 10000
    ).toFixed(4) + '\u2032 '
  } else {
    return 'W ' + degrees + '° ' + (
      Math.floor(minutes * 10000) / 10000
    ).toFixed(4) + '\u2032 '
  }
}
const latToDms = (value) => {
  if (value === null) {
    return ''
  }
  value += 0.0000014 // Round (= 0.5 sec).
  let degrees = Math.floor(Math.abs(value))
  let minutes = Math.floor((Math.abs(value) - degrees) * 60)
  let seconds = (Math.abs(value) - degrees - minutes / 60) * 3600
  if (value >= 0) {
    return 'N ' + degrees + '° ' + minutes + '\u2032 ' + (
      Math.floor(seconds * 100) / 100
    ).toFixed(2) + '\u2033 '
  } else {
    return 'S ' + degrees + '° ' + minutes + '\u2032 ' + (
      Math.floor(seconds * 100) / 100
    ).toFixed(2) + '\u2033 '
  }
}
const lngToDms = (value) => {
  if (value === null) {
    return ''
  }
  value += 0.0000014 // Round (= 0.5 sec).
  let degrees = Math.floor(Math.abs(value))
  let minutes = Math.floor((Math.abs(value) - degrees) * 60)
  let seconds = (Math.abs(value) - degrees - minutes / 60) * 3600
  if (value >= 0) {
    return 'E ' + degrees + '° ' + minutes + '\u2032 ' + (
      Math.floor(seconds * 100) / 100
    ).toFixed(2) + '\u2033 '
  } else {
    return 'W ' + degrees + '° ' + minutes + '\u2032 ' + (
      Math.floor(seconds * 100) / 100
    ).toFixed(2) + '\u2033 '
  }
}

// Author: Arnold Andreasson, info@mellifica.se
// Copyright (c) 2007-2016 Arnold Andreasson 
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
// Javascript-implementation of "Gauss Conformal Projection 
// (Transverse Mercator), Krügers Formulas".
// - Parameters for SWEREF99 lat-long to/from RT90 and SWEREF99 
//   coordinates (RT90 and SWEREF99 are used in Swedish maps).
// Source: http://www.lantmateriet.se/geodesi/

let axis = null // Semi-major axis of the ellipsoid.
let flattening = null // Flattening of the ellipsoid.
let centralMeridian = null // Central meridian for the projection.
let latOfOrigin = null // Latitude of origin.
let scale = null // Scale on central meridian.
let falseNorthing = null // Offset for origo.
let falseEasting = null // Offset for origo.
// Parameters for RT90 and SWEREF99TM.
// Note: Parameters for RT90 are choosen to eliminate the differences between Bessel and
// GRS80-ellipsoides. Bessel-variants should only be used if lat/long are given as RT90-lat/long
// based on the Bessel ellipsoide (from old maps). Parameter: projection (string). Must match
// if-statement.

const grs80Params = () => {
  axis = 6378137.0 // GRS 80.
  flattening = 1.0 / 298.257222101 // GRS 80.
  centralMeridian = null
  latOfOrigin = 0.0
}

const swedishParams = (projection) => {
  switch (projection) {
    case 'rt90_7.5_gon_v':
      {
        grs80Params()
        centralMeridian = 11.0 + 18.375 / 60.0
        scale = 1.000006000000
        falseNorthing = -667.282
        falseEasting = 1500025.141
        break
      }
    case 'rt90_5.0_gon_v':
      {
        grs80Params()
        centralMeridian = 13.0 + 33.376 / 60.0
        scale = 1.000005800000
        falseNorthing = -667.130
        falseEasting = 1500044.695
        break
      }
    case 'rt90_2.5_gon_v':
      {
        grs80Params()
        centralMeridian = 15.0 + 48.0 / 60.0 + 22.624306 / 3600.0
        scale = 1.00000561024
        falseNorthing = -667.711
        falseEasting = 1500064.274
        break
      }
    case 'rt90_0.0_gon_v':
      {
        grs80Params()
        centralMeridian = 18.0 + 3.378 / 60.0
        scale = 1.000005400000
        falseNorthing = -668.844
        falseEasting = 1500083.521
        break
      }
    case 'rt90_2.5_gon_o':
      {
        grs80Params()
        centralMeridian = 20.0 + 18.379 / 60.0
        scale = 1.000005200000
        falseNorthing = -670.706
        falseEasting = 1500102.765
        break
      }
    case 'rt90_5.0_gon_o':
      {
        grs80Params()
        centralMeridian = 22.0 + 33.380 / 60.0
        scale = 1.000004900000
        falseNorthing = -672.557
        falseEasting = 1500121.846
        break
      }
    case 'bessel_rt90_7.5_gon_v':
      {
        besselParams()
        centralMeridian = 11.0 + 18.0 / 60.0 + 29.8 / 3600.0
        break
      }
    case 'bessel_rt90_5.0_gon_v':
      {
        besselParams()
        centralMeridian = 13.0 + 33.0 / 60.0 + 29.8 / 3600.0
        break
      }
    case 'bessel_rt90_2.5_gon_v':
      {
        besselParams()
        centralMeridian = 15.0 + 48.0 / 60.0 + 29.8 / 3600.0
        break
      }
    case 'bessel_rt90_0.0_gon_v':
      {
        besselParams()
        centralMeridian = 18.0 + 3.0 / 60.0 + 29.8 / 3600.0
        break
      }
    case 'bessel_rt90_2.5_gon_o':
      {
        besselParams()
        centralMeridian = 20.0 + 18.0 / 60.0 + 29.8 / 3600.0
        break
      }
    case 'bessel_rt90_5.0_gon_o':
      {
        besselParams()
        centralMeridian = 22.0 + 33.0 / 60.0 + 29.8 / 3600.0
        break
      }
    case 'sweref_99_tm':
      {
        sweref99Params()
        centralMeridian = 15.00
        latOfOrigin = 0.0
        scale = 0.9996
        falseNorthing = 0.0
        falseEasting = 500000.0
        break
      }
    case 'sweref_99_1200':
      {
        sweref99Params()
        centralMeridian = 12.00
        break
      }
    case 'sweref_99_1330':
      {
        sweref99Params()
        centralMeridian = 13.50
        break
      }
    case 'sweref_99_1500':
      {
        sweref99Params()
        centralMeridian = 15.00
        break
      }
    case 'sweref_99_1630':
      {
        sweref99Params()
        centralMeridian = 16.50
        break
      }
    case 'sweref_99_1800':
      {
        sweref99Params()
        centralMeridian = 18.00
        break
      }
    case 'sweref_99_1415':
      {
        sweref99Params()
        centralMeridian = 14.25
        break
      }
    case 'sweref_99_1545':
      {
        sweref99Params()
        centralMeridian = 15.75
        break
      }
    case 'sweref_99_1715':
      {
        sweref99Params()
        centralMeridian = 17.25
        break
      }
    case 'sweref_99_1845':
      {
        sweref99Params()
        centralMeridian = 18.75
        break
      }
    case 'sweref_99_2015':
      {
        sweref99Params()
        centralMeridian = 20.25
        break
      }
    case 'sweref_99_2145':
      {
        sweref99Params()
        break
      }
    case 'sweref_99_2315':
      {
        sweref99Params()
        centralMeridian = 23.25
        break
      }
 // Test-case: Lat: 66 0'0', lon: 24 0'0'. X:1135809.413803 Y:555304.016555.
    case 'test_case':
      {
        axis = 6378137.0
        flattening = 1.0 / 298.257222101
        centralMeridian = 13.0 + 35.0 / 60.0 + 7.692000 / 3600.0
        latOfOrigin = 0.0
        scale = 1.000002540000
        falseNorthing = -6226307.8640
        falseEasting = 84182.8790
        break
      }
    default:
      {
        centralMeridian = null
      }
  }
}

// Sets of default parameters.
const besselParams = () => {
  axis = 6377397.155 // Bessel 1841.
  flattening = 1.0 / 299.1528128 // Bessel 1841.
  centralMeridian = null
  latOfOrigin = 0.0
  scale = 1.0
  falseNorthing = 0.0
  falseEasting = 1500000.0
}

const sweref99Params = () => {
  axis = 6378137.0 // const 80.
  flattening = 1.0 / 298.257222101 // GRS 80.
  centralMeridian = null
  latOfOrigin = 0.0
  scale = 1.0
  falseNorthing = 0.0
  falseEasting = 150000.0
}

// Conversion from geodetic coordinates to grid coordinates.
const geodeticToGrid = (latitude, longitude) => {
  let xY = new Array(2)
  if (centralMeridian === null) {
    return xY
  }
  // Prepare ellipsoid-based stuff.
  let e2 = flattening * (2.0 - flattening)
  let n = flattening / (2.0 - flattening)
  let aRoof = axis / (1.0 + n) * (1.0 + n * n / 4.0 + n * n * n * n / 64.0)
  let A = e2
  let B = (5.0 * e2 * e2 - e2 * e2 * e2) / 6.0
  let C = (104.0 * e2 * e2 * e2 - 45.0 * e2 * e2 * e2 * e2) / 120.0
  let D = (1237.0 * e2 * e2 * e2 * e2) / 1260.0
  let beta1 = n / 2.0 - 2.0 * n * n / 3.0 + 5.0 * n * n * n / 16.0 + 41.0 * n * n * n * n / 180.0
  let beta2 = 13.0 * n * n / 48.0 - 3.0 * n * n * n / 5.0 + 557.0 * n * n * n * n / 1440.0
  let beta3 = 61.0 * n * n * n / 240.0 - 103.0 * n * n * n * n / 140.0
  let beta4 = 49561.0 * n * n * n * n / 161280.0
  // Convert.
  let degToRad = Math.PI / 180.0
  let phi = latitude * degToRad
  let lambda = longitude * degToRad
  let lambdaZero = centralMeridian * degToRad
  let phiStar = phi - Math.sin(phi) * Math.cos(phi) * (
    A + B * Math.pow(Math.sin(phi), 2) + C * Math.pow(Math.sin(phi), 4) + D * Math.pow(Math.sin(phi), 6)
  )
  let deltaLambda = lambda - lambdaZero
  let xiPrim = Math.atan(Math.tan(phiStar) / Math.cos(deltaLambda))
  let etaPrim = mathAtanh(Math.cos(phiStar) * Math.sin(deltaLambda))
  let x = scale * aRoof * (
    xiPrim + beta1 * Math.sin(2.0 * xiPrim) * mathCosh(2.0 * etaPrim) + beta2 * Math.sin(4.0 * xiPrim) * mathCosh(4.0 * etaPrim) + beta3 * Math.sin(6.0 * xiPrim) * mathCosh(6.0 * etaPrim) + beta4 * Math.sin(8.0 * xiPrim) * mathCosh(8.0 * etaPrim)
  ) + falseNorthing
  let y = scale * aRoof * (
    etaPrim + beta1 * Math.cos(2.0 * xiPrim) * mathSinh(2.0 * etaPrim) + beta2 * Math.cos(4.0 * xiPrim) * mathSinh(4.0 * etaPrim) + beta3 * Math.cos(6.0 * xiPrim) * mathSinh(6.0 * etaPrim) + beta4 * Math.cos(8.0 * xiPrim) * mathSinh(8.0 * etaPrim)
  ) + falseEasting
  xY[0] = Math.round(x * 1000.0) / 1000.0
  xY[1] = Math.round(y * 1000.0) / 1000.0
  // xY[0] = x; xY[1] = y;
  return xY
}

// Conversion from grid coordinates to geodetic coordinates.
const gridToGeodetic = (x, y) => {
  let latLon = new Array(2)
  if (centralMeridian === null) {
    return latLon
  }
  // Prepare ellipsoid-based stuff.
  let e2 = flattening * (2.0 - flattening)
  let n = flattening / (2.0 - flattening)
  let aRoof = axis / (1.0 + n) * (1.0 + n * n / 4.0 + n * n * n * n / 64.0)
  let delta1 = n / 2.0 - 2.0 * n * n / 3.0 + 37.0 * n * n * n / 96.0 - n * n * n * n / 360.0
  let delta2 = n * n / 48.0 + n * n * n / 15.0 - 437.0 * n * n * n * n / 1440.0
  let delta3 = 17.0 * n * n * n / 480.0 - 37 * n * n * n * n / 840.0
  let delta4 = 4397.0 * n * n * n * n / 161280.0
  let Astar = e2 + e2 * e2 + e2 * e2 * e2 + e2 * e2 * e2 * e2
  let Bstar = -(7.0 * e2 * e2 + 17.0 * e2 * e2 * e2 + 30.0 * e2 * e2 * e2 * e2) / 6.0
  let Cstar = (224.0 * e2 * e2 * e2 + 889.0 * e2 * e2 * e2 * e2) / 120.0
  let Dstar = -(4279.0 * e2 * e2 * e2 * e2) / 1260.0
  // Convert.
  let degToRad = Math.PI / 180
  let lambdaZero = centralMeridian * degToRad
  let xi = (x - falseNorthing) / (scale * aRoof)
  let eta = (y - falseEasting) / (scale * aRoof)
  let xiPrim = xi - delta1 * Math.sin(2.0 * xi) * mathCosh(2.0 * eta) - delta2 * Math.sin(4.0 * xi) * mathCosh(
    4.0 * eta
  ) - delta3 * Math.sin(6.0 * xi) * mathCosh(6.0 * eta) - delta4 * Math.sin(8.0 * xi) * mathCosh(
    8.0 * eta
  )
  let etaPrim = eta - delta1 * Math.cos(2.0 * xi) * mathSinh(2.0 * eta) - delta2 * Math.cos(
    4.0 * xi
  ) * mathSinh(4.0 * eta) - delta3 * Math.cos(6.0 * xi) * mathSinh(6.0 * eta) - delta4 * Math.cos(
    8.0 * xi
  ) * mathSinh(8.0 * eta)
  let phiStar = Math.asin(Math.sin(xiPrim) / mathCosh(etaPrim))
  let deltaLambda = Math.atan(mathSinh(etaPrim) / Math.cos(xiPrim))
  let lonRadian = lambdaZero + deltaLambda
  let latRadian = phiStar + Math.sin(phiStar) * Math.cos(phiStar) * (
    Astar + Bstar * Math.pow(Math.sin(phiStar), 2) + Cstar * Math.pow(Math.sin(phiStar), 4) + Dstar * Math.pow(Math.sin(phiStar), 6)
  )
  latLon[0] = latRadian * 180.0 / Math.PI
  latLon[1] = lonRadian * 180.0 / Math.PI
  return latLon
}

// Missing functions in the Math library.
const mathSinh = (value) => {
  return 0.5 * (Math.exp(value) - Math.exp(-value))
}

const mathCosh = (value) => {
  return 0.5 * (Math.exp(value) + Math.exp(-value))
}

const mathAtanh = (value) => {
  return 0.5 * Math.log((1.0 + value) / (1.0 - value))
}
