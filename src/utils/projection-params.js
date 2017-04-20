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
// Javascript-implementation of "Gauss Conformal Projection
// (Transverse Mercator), Krügers Formulas".
// - Parameters for SWEREF99 lat-long to/from RT90 and SWEREF99
//   coordinates (RT90 and SWEREF99 are used in Swedish maps).
// Source: http://www.lantmateriet.se/geodesi/

const params = {
  axis: null, // Semi-major axis of the ellipsoid.
  flattening: null, // Flattening of the ellipsoid.
  centralMeridian: null, // Central meridian for the projection.
  latOfOrigin: null, // Latitude of origin.
  scale: null, // Scale on central meridian.
  falseNorthing: null, // Offset for origo.
  falseEasting: null // Offset for origo.
}

// Parameters for RT90 and SWEREF99TM.
// Note: Parameters for RT90 are choosen to eliminate the differences between Bessel and
// GRS80-ellipsoides. Bessel-variants should only be used if lat/long are given as RT90-lat/long
// based on the Bessel ellipsoide (from old maps). Parameter: projection (string). Must match
// if-statement.
const grs80Params = () => {
  params.axis = 6378137.0 // GRS 80.
  params.flattening = 1.0 / 298.257222101 // GRS 80.
  params.centralMeridian = null
  params.latOfOrigin = 0.0
}

const swedishParams = (projection) => {
  switch (projection) {
    case 'rt90_7.5_gon_v':
      {
        grs80Params()
        params.centralMeridian = 11.0 + 18.375 / 60.0
        params.scale = 1.000006000000
        params.falseNorthing = -667.282
        params.falseEasting = 1500025.141
        break
      }
    case 'rt90_5.0_gon_v':
      {
        grs80Params()
        params.centralMeridian = 13.0 + 33.376 / 60.0
        params.scale = 1.000005800000
        params.falseNorthing = -667.130
        params.falseEasting = 1500044.695
        break
      }
    case 'rt90_2.5_gon_v':
      {
        grs80Params()
        params.centralMeridian = 15.0 + 48.0 / 60.0 + 22.624306 / 3600.0
        params.scale = 1.00000561024
        params.falseNorthing = -667.711
        params.falseEasting = 1500064.274
        break
      }
    case 'rt90_0.0_gon_v':
      {
        grs80Params()
        params.centralMeridian = 18.0 + 3.378 / 60.0
        params.scale = 1.000005400000
        params.falseNorthing = -668.844
        params.falseEasting = 1500083.521
        break
      }
    case 'rt90_2.5_gon_o':
      {
        grs80Params()
        params.centralMeridian = 20.0 + 18.379 / 60.0
        params.scale = 1.000005200000
        params.falseNorthing = -670.706
        params.falseEasting = 1500102.765
        break
      }
    case 'rt90_5.0_gon_o':
      {
        grs80Params()
        params.centralMeridian = 22.0 + 33.380 / 60.0
        params.scale = 1.000004900000
        params.falseNorthing = -672.557
        params.falseEasting = 1500121.846
        break
      }
    case 'bessel_rt90_7.5_gon_v':
      {
        besselParams()
        params.centralMeridian = 11.0 + 18.0 / 60.0 + 29.8 / 3600.0
        break
      }
    case 'bessel_rt90_5.0_gon_v':
      {
        besselParams()
        params.centralMeridian = 13.0 + 33.0 / 60.0 + 29.8 / 3600.0
        break
      }
    case 'bessel_rt90_2.5_gon_v':
      {
        besselParams()
        params.centralMeridian = 15.0 + 48.0 / 60.0 + 29.8 / 3600.0
        break
      }
    case 'bessel_rt90_0.0_gon_v':
      {
        besselParams()
        params.centralMeridian = 18.0 + 3.0 / 60.0 + 29.8 / 3600.0
        break
      }
    case 'bessel_rt90_2.5_gon_o':
      {
        besselParams()
        params.centralMeridian = 20.0 + 18.0 / 60.0 + 29.8 / 3600.0
        break
      }
    case 'bessel_rt90_5.0_gon_o':
      {
        besselParams()
        params.centralMeridian = 22.0 + 33.0 / 60.0 + 29.8 / 3600.0
        break
      }
    case 'sweref_99_tm':
      {
        sweref99Params()
        params.centralMeridian = 15.00
        params.latOfOrigin = 0.0
        params.scale = 0.9996
        params.falseNorthing = 0.0
        params.falseEasting = 500000.0
        break
      }
    case 'sweref_99_1200':
      {
        sweref99Params()
        params.centralMeridian = 12.00
        break
      }
    case 'sweref_99_1330':
      {
        sweref99Params()
        params.centralMeridian = 13.50
        break
      }
    case 'sweref_99_1500':
      {
        sweref99Params()
        params.centralMeridian = 15.00
        break
      }
    case 'sweref_99_1630':
      {
        sweref99Params()
        params.centralMeridian = 16.50
        break
      }
    case 'sweref_99_1800':
      {
        sweref99Params()
        params.centralMeridian = 18.00
        break
      }
    case 'sweref_99_1415':
      {
        sweref99Params()
        params.centralMeridian = 14.25
        break
      }
    case 'sweref_99_1545':
      {
        sweref99Params()
        params.centralMeridian = 15.75
        break
      }
    case 'sweref_99_1715':
      {
        sweref99Params()
        params.centralMeridian = 17.25
        break
      }
    case 'sweref_99_1845':
      {
        sweref99Params()
        params.centralMeridian = 18.75
        break
      }
    case 'sweref_99_2015':
      {
        sweref99Params()
        params.centralMeridian = 20.25
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
        params.centralMeridian = 23.25
        break
      }
 // Test-case: Lat: 66 0'0', lon: 24 0'0'. X:1135809.413803 Y:555304.016555.
    case 'test_case':
      {
        params.axis = 6378137.0
        params.flattening = 1.0 / 298.257222101
        params.centralMeridian = 13.0 + 35.0 / 60.0 + 7.692000 / 3600.0
        params.latOfOrigin = 0.0
        params.scale = 1.000002540000
        params.falseNorthing = -6226307.8640
        params.falseEasting = 84182.8790
        break
      }
    default:
      {
        params.centralMeridian = null
      }
  }
  return params
}

// Sets of default parameters.
const besselParams = () => {
  params.axis = 6377397.155 // Bessel 1841.
  params.flattening = 1.0 / 299.1528128 // Bessel 1841.
  params.centralMeridian = null
  params.latOfOrigin = 0.0
  params.scale = 1.0
  params.falseNorthing = 0.0
  params.falseEasting = 1500000.0
}

const sweref99Params = () => {
  params.axis = 6378137.0 // const 80.
  params.flattening = 1.0 / 298.257222101 // GRS 80.
  params.centralMeridian = null
  params.latOfOrigin = 0.0
  params.scale = 1.0
  params.falseNorthing = 0.0
  params.falseEasting = 150000.0
}

export {swedishParams}
