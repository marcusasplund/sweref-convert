/* eslint-disable no-unused-vars */

// Author: Marcus Asplund
// Copyright (c) 2017 Marcus Asplund, marcus@greatname.se
// License: MIT License as follows:

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
// by Arnold Andreasson, info@mellifica.se
// - Parameters for SWEREF99 lat-lngg to/from RT90 and SWEREF99
//   coordinates (RT90 and SWEREF99 are used in Swedish maps).
// Source: http://www.lantmateriet.se/geodesi/

// Conversion from grid coordinates to geodetic coordinates.
export const gridToGeodetic = (x, y, params) => {
  if (params.centralMeridian === null) {
    return {
      lat: null,
      lng: null
    }
  }
  // Prepare ellipsoid-based stuff.
  const e2 = params.flattening * (2.0 - params.flattening)
  const n = params.flattening / (2.0 - params.flattening)
  const aRoof = params.axis / (1.0 + n) * (1.0 + n ** 2 / 4.0 + n ** 4 / 64.0)
  const delta1 = n / 2.0 - 2.0 * n ** 2 / 3.0 + 37.0 * n ** 3 / 96.0 - n ** 4 / 360.0
  const delta2 = n ** 2 / 48.0 + n ** 3 / 15.0 - 437.0 * n ** 4 / 1440.0
  const delta3 = 17.0 * n ** 3 / 480.0 - 37 * n ** 4 / 840.0
  const delta4 = 4397.0 * n ** 4 / 161280.0
  const Astar = e2 + e2 ** 2 + e2 ** 3 + e2 ** 4
  const Bstar = -(7.0 * e2 ** 2 + 17.0 * e2 ** 3 + 30.0 * e2 ** 4) / 6.0
  const Cstar = (224.0 * e2 ** 3 + 889.0 * e2 ** 4) / 120.0
  const Dstar = -(4279.0 * e2 ** 4) / 1260.0
  // Convert.
  const degToRad = Math.PI / 180
  const lambdaZero = params.centralMeridian * degToRad
  const xi = (x - params.falseNorthing) / (params.scale * aRoof)
  const eta = (y - params.falseEasting) / (params.scale * aRoof)
  const xiPrim = xi - delta1 * Math.sin(2.0 * xi) * Math.cosh(2.0 * eta) - delta2 * Math.sin(4.0 * xi) * Math.cosh(
    4.0 * eta
  ) - delta3 * Math.sin(6.0 * xi) * Math.cosh(6.0 * eta) - delta4 * Math.sin(8.0 * xi) * Math.cosh(
    8.0 * eta)
  const etaPrim = eta - delta1 * Math.cos(2.0 * xi) * Math.sinh(2.0 * eta) - delta2 * Math.cos(
    4.0 * xi
  ) * Math.sinh(4.0 * eta) - delta3 * Math.cos(6.0 * xi) * Math.sinh(6.0 * eta) - delta4 * Math.cos(
    8.0 * xi) * Math.sinh(8.0 * eta)
  const phiStar = Math.asin(Math.sin(xiPrim) / Math.cosh(etaPrim))
  const deltaLambda = Math.atan(Math.sinh(etaPrim) / Math.cos(xiPrim))
  const lngRadian = lambdaZero + deltaLambda
  const latRadian = phiStar + Math.sin(phiStar) * Math.cos(phiStar) * (
    Astar + Bstar * Math.pow(Math.sin(phiStar), 2) + Cstar * Math.pow(Math.sin(phiStar), 4) + Dstar * Math.pow(Math.sin(phiStar), 6)
  )
  const coords = {
    lat: latRadian * 180.0 / Math.PI,
    lng: lngRadian * 180.0 / Math.PI
  }
  return coords
}
