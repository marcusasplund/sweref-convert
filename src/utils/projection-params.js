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
// ES2015-implementation of
// Javascript-implementation of "Gauss Conformal Projection
// (Transverse Mercator), Krügers Formulas".
// by Arnold Andreasson, info@mellifica.se
// - Parameters for SWEREF99 lat-long to/from RT90 and SWEREF99
//   coordinates (RT90 and SWEREF99 are used in Swedish maps).
// Source: http://www.lantmateriet.se/geodesi/

const defaultParams = {
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
  return {
    axis: 6378137.0, // GRS 80.
    flattening: 1.0 / 298.257222101, // GRS 80.
    centralMeridian: null,
    latOfOrigin: 0.0
  }
}

// Sets of default parameters.
const besselParams = () => {
  return {
    axis: 6377397.155, // Bessel 1841.
    flattening: 1.0 / 299.1528128, // Bessel 1841.
    centralMeridian: null,
    latOfOrigin: 0.0,
    scale: 1.0,
    falseNorthing: 0.0,
    falseEasting: 1500000.0
  }
}

const sweref99Params = () => {
  return {
    axis: 6378137.0, // const 80.
    flattening: 1.0 / 298.257222101, // GRS 80.
    centralMeridian: null,
    latOfOrigin: 0.0,
    scale: 1.0,
    falseNorthing: 0.0,
    falseEasting: 150000.0
  }
}

const rt9075gonV = () => {
  let base = grs80Params()
  let spec = {
    centralMeridian: 11.0 + 18.375 / 60.0,
    scale: 1.000006000000,
    falseNorthing: -667.282,
    falseEasting: 1500025.141
  }
  return {...defaultParams, ...base, ...spec}
}

const rt9050gonV = () => {
  let base = grs80Params()
  let spec = {
    centralMeridian: 13.0 + 33.376 / 60.0,
    scale: 1.000005800000,
    falseNorthing: -667.130,
    falseEasting: 1500044.695
  }
  return {...defaultParams, ...base, ...spec}
}

const rt9025gonV = () => {
  let base = grs80Params()
  let spec = {
    centralMeridian: 15.0 + 48.0 / 60.0 + 22.624306 / 3600.0,
    scale: 1.00000561024,
    falseNorthing: -667.711,
    falseEasting: 1500064.274
  }
  return {...defaultParams, ...base, ...spec}
}

const rt9000gonV = () => {
  let base = grs80Params()
  let spec = {
    centralMeridian: 18.0 + 3.378 / 60.0,
    scale: 1.000005400000,
    falseNorthing: -668.844,
    falseEasting: 1500083.521
  }
  return {...defaultParams, ...base, ...spec}
}

const rt9025gonO = () => {
  let base = grs80Params()
  let spec = {
    centralMeridian: 20.0 + 18.379 / 60.0,
    scale: 1.000005200000,
    falseNorthing: -670.706,
    falseEasting: 1500102.765
  }
  return {...defaultParams, ...base, ...spec}
}

const rt9050gonO = () => {
  let base = grs80Params()
  let spec = {
    centralMeridian: 22.0 + 33.380 / 60.0,
    scale: 1.000004900000,
    falseNorthing: -672.557,
    falseEasting: 1500121.846
  }
  return {...defaultParams, ...base, ...spec}
}

const besselRt9075gonV = () => {
  let base = besselParams()
  let spec = {
    centralMeridian: 11.0 + 18.0 / 60.0 + 29.8 / 3600.0
  }
  return {...defaultParams, ...base, ...spec}
}

const besselRt9050gonV = () => {
  let base = besselParams()
  let spec = {
    centralMeridian: 13.0 + 33.0 / 60.0 + 29.8 / 3600.0
  }
  return {...defaultParams, ...base, ...spec}
}

const besselRt9025gonV = () => {
  let base = besselParams()
  let spec = {
    centralMeridian: 15.0 + 48.0 / 60.0 + 29.8 / 3600.0
  }
  return {...defaultParams, ...base, ...spec}
}

const besselRt9000gonV = () => {
  let base = besselParams()
  let spec = {
    centralMeridian: 18.0 + 3.0 / 60.0 + 29.8 / 3600.0
  }
  return {...defaultParams, ...base, ...spec}
}

const besselRt9025gonO = () => {
  let base = besselParams()
  let spec = {
    centralMeridian: 20.0 + 18.0 / 60.0 + 29.8 / 3600.0
  }
  return {...defaultParams, ...base, ...spec}
}

const besselRt9050gonO = () => {
  let base = besselParams()
  let spec = {
    centralMeridian: 22.0 + 33.0 / 60.0 + 29.8 / 3600.0
  }
  return {...defaultParams, ...base, ...spec}
}

const sweref99tm = () => {
  let base = sweref99Params()
  let spec = {
    centralMeridian: 15.00,
    latOfOrigin: 0.0,
    scale: 0.9996,
    falseNorthing: 0.0,
    falseEasting: 500000.0
  }
  return {...defaultParams, ...base, ...spec}
}

const sweref991200 = () => {
  let base = sweref99Params()
  let spec = {
    centralMeridian: 12.00
  }
  return {...defaultParams, ...base, ...spec}
}

const sweref991330 = () => {
  let base = sweref99Params()
  let spec = {
    centralMeridian: 13.50
  }
  return {...defaultParams, ...base, ...spec}
}

const sweref991500 = () => {
  let base = sweref99Params()
  let spec = {
    centralMeridian: 15.00
  }
  return {...defaultParams, ...base, ...spec}
}

const sweref991630 = () => {
  let base = sweref99Params()
  let spec = {
    centralMeridian: 16.50
  }
  return {...defaultParams, ...base, ...spec}
}

const sweref991800 = () => {
  let base = sweref99Params()
  let spec = {
    centralMeridian: 18.00
  }
  return {...defaultParams, ...base, ...spec}
}

const sweref991415 = () => {
  let base = sweref99Params()
  let spec = {
    centralMeridian: 14.25
  }
  return {...defaultParams, ...base, ...spec}
}

const sweref991545 = () => {
  let base = sweref99Params()
  let spec = {
    centralMeridian: 15.75
  }
  return {...defaultParams, ...base, ...spec}
}

const sweref991715 = () => {
  let base = sweref99Params()
  let spec = {
    centralMeridian: 17.25
  }
  return {...defaultParams, ...base, ...spec}
}

const sweref991845 = () => {
  let base = sweref99Params()
  let spec = {
    centralMeridian: 18.75
  }
  return {...defaultParams, ...base, ...spec}
}

const sweref992015 = () => {
  let base = sweref99Params()
  let spec = {
    centralMeridian: 20.25
  }
  return {...defaultParams, ...base, ...spec}
}

const sweref992145 = () => {
  let base = sweref99Params()
  let spec = {
    centralMeridian: 21.75
  }
  return {...defaultParams, ...base, ...spec}
}

const sweref992315 = () => {
  let base = sweref99Params()
  let spec = {
    centralMeridian: 23.25
  }
  return {...defaultParams, ...base, ...spec}
}
// Conversion calculation with testCase params should return:
// Lat: 66 0'0", lon: 24 0'0".
// X:1135809.413803 Y:555304.016555.
const testCase = () => {
  let spec = {
    axis: 6378137.0,
    flattening: 1.0 / 298.257222101,
    centralMeridian: 13.0 + 35.0 / 60.0 + 7.692000 / 3600.0,
    latOfOrigin: 0.0,
    scale: 1.000002540000,
    falseNorthing: -6226307.8640,
    falseEasting: 84182.8790
  }
  return {...defaultParams, ...spec}
}

// example usage: swedishParams['rt9075gonV']()
const swedishParams = {
  rt9075gonV: rt9075gonV,
  rt9050gonV: rt9050gonV,
  rt9025gonV: rt9025gonV,
  rt9000gonV: rt9000gonV,
  rt9025gonO: rt9025gonO,
  rt9050gonO: rt9050gonO,
  besselRt9075gonV: besselRt9075gonV,
  besselRt9050gonV: besselRt9050gonV,
  besselRt9025gonV: besselRt9025gonV,
  besselRt9000gonV: besselRt9000gonV,
  besselRt9025gonO: besselRt9025gonO,
  besselRt9050gonO: besselRt9050gonO,
  sweref99tm: sweref99tm,
  sweref991200: sweref991200,
  sweref991330: sweref991330,
  sweref991500: sweref991500,
  sweref991630: sweref991630,
  sweref991800: sweref991800,
  sweref991415: sweref991415,
  sweref991545: sweref991545,
  sweref991715: sweref991715,
  sweref991845: sweref991845,
  sweref992015: sweref992015,
  sweref992145: sweref992145,
  sweref992315: sweref992315,
  testCase: testCase
}

export {swedishParams}
