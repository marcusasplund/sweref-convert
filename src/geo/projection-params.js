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
const grs80Params = {
  axis: 6378137.0, // GRS 80.
  flattening: 1.0 / 298.257222101, // GRS 80.
  centralMeridian: null,
  latOfOrigin: 0.0
}

// Sets of default parameters.
const besselParams = {
  axis: 6377397.155, // Bessel 1841.
  flattening: 1.0 / 299.1528128, // Bessel 1841.
  centralMeridian: null,
  latOfOrigin: 0.0,
  scale: 1.0,
  falseNorthing: 0.0,
  falseEasting: 1500000.0
}

const sweref99Params = {
  axis: 6378137.0, // const 80.
  flattening: 1.0 / 298.257222101, // GRS 80.
  centralMeridian: null,
  latOfOrigin: 0.0,
  scale: 1.0,
  falseNorthing: 0.0,
  falseEasting: 150000.0
}

const rt9075gonV = {
  centralMeridian: 11.0 + 18.375 / 60.0,
  scale: 1.000006000000,
  falseNorthing: -667.282,
  falseEasting: 1500025.141
}

const rt9050gonV = {
  centralMeridian: 13.0 + 33.376 / 60.0,
  scale: 1.000005800000,
  falseNorthing: -667.130,
  falseEasting: 1500044.695
}

const rt9025gonV = {
  centralMeridian: 15.0 + 48.0 / 60.0 + 22.624306 / 3600.0,
  scale: 1.00000561024,
  falseNorthing: -667.711,
  falseEasting: 1500064.274
}

const rt9000gonV = {
  centralMeridian: 18.0 + 3.378 / 60.0,
  scale: 1.000005400000,
  falseNorthing: -668.844,
  falseEasting: 1500083.521
}

const rt9025gonO = {
  centralMeridian: 20.0 + 18.379 / 60.0,
  scale: 1.000005200000,
  falseNorthing: -670.706,
  falseEasting: 1500102.765
}

const rt9050gonO = {
  centralMeridian: 22.0 + 33.380 / 60.0,
  scale: 1.000004900000,
  falseNorthing: -672.557,
  falseEasting: 1500121.846
}

const besselRt9075gonV = {
  centralMeridian: 11.0 + 18.0 / 60.0 + 29.8 / 3600.0
}

const besselRt9050gonV = {
  centralMeridian: 13.0 + 33.0 / 60.0 + 29.8 / 3600.0
}

const besselRt9025gonV = {
  centralMeridian: 15.0 + 48.0 / 60.0 + 29.8 / 3600.0
}

const besselRt9000gonV = {
  centralMeridian: 18.0 + 3.0 / 60.0 + 29.8 / 3600.0
}

const besselRt9025gonO = {
  centralMeridian: 20.0 + 18.0 / 60.0 + 29.8 / 3600.0
}

const besselRt9050gonO = {
  centralMeridian: 22.0 + 33.0 / 60.0 + 29.8 / 3600.0
}

const sweref99tm = {
  centralMeridian: 15.00,
  latOfOrigin: 0.0,
  scale: 0.9996,
  falseNorthing: 0.0,
  falseEasting: 500000.0
}

const sweref991200 = {
  centralMeridian: 12.00
}

const sweref991330 = {
  centralMeridian: 13.50
}

const sweref991500 = {
  centralMeridian: 15.00
}

const sweref991630 = {
  centralMeridian: 16.50
}

const sweref991800 = {
  centralMeridian: 18.00
}

const sweref991415 = {
  centralMeridian: 14.25
}

const sweref991545 = {
  centralMeridian: 15.75
}

const sweref991715 = {
  centralMeridian: 17.25
}

const sweref991845 = {
  centralMeridian: 18.75
}

const sweref992015 = {
  centralMeridian: 20.25
}

const sweref992145 = {
  centralMeridian: 21.75
}

const sweref992315 = {
  centralMeridian: 23.25
}

// Conversion calculation with testCase params should return:
// Lat: 66 0'0", lon: 24 0'0".
// X:1135809.413803 Y:555304.016555.
const testCase = {
  axis: 6378137.0,
  flattening: 1.0 / 298.257222101,
  centralMeridian: 13.0 + 35.0 / 60.0 + 7.692000 / 3600.0,
  latOfOrigin: 0.0,
  scale: 1.000002540000,
  falseNorthing: -6226307.8640,
  falseEasting: 84182.8790
}

const params = {
  rt9075gonV: { ...grs80Params, ...rt9075gonV },
  rt9050gonV: { ...grs80Params, ...rt9050gonV },
  rt9025gonV: { ...grs80Params, ...rt9025gonV },
  rt9000gonV: { ...grs80Params, ...rt9000gonV },
  rt9025gonO: { ...grs80Params, ...rt9025gonO },
  rt9050gonO: { ...grs80Params, ...rt9050gonO },
  besselRt9075gonV: { ...besselParams, ...besselRt9075gonV },
  besselRt9050gonV: { ...besselParams, ...besselRt9050gonV },
  besselRt9025gonV: { ...besselParams, ...besselRt9025gonV },
  besselRt9000gonV: { ...besselParams, ...besselRt9000gonV },
  besselRt9025gonO: { ...besselParams, ...besselRt9025gonO },
  besselRt9050gonO: { ...besselParams, ...besselRt9050gonO },
  sweref99tm: { ...sweref99Params, ...sweref99tm },
  sweref991200: { ...sweref99Params, ...sweref991200 },
  sweref991330: { ...sweref99Params, ...sweref991330 },
  sweref991500: { ...sweref99Params, ...sweref991500 },
  sweref991630: { ...sweref99Params, ...sweref991630 },
  sweref991800: { ...sweref99Params, ...sweref991800 },
  sweref991415: { ...sweref99Params, ...sweref991415 },
  sweref991545: { ...sweref99Params, ...sweref991545 },
  sweref991715: { ...sweref99Params, ...sweref991715 },
  sweref991845: { ...sweref99Params, ...sweref991845 },
  sweref992015: { ...sweref99Params, ...sweref992015 },
  sweref992145: { ...sweref99Params, ...sweref992145 },
  sweref992315: { ...sweref99Params, ...sweref992315 },
  testCase
}

// example usage: projectionParams('rt9075gonV')
const projectionParams = (projection) => {
  return { ...defaultParams, ...params[projection] }
}

export { projectionParams }
