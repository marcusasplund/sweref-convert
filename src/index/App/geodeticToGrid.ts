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

// Conversion from geodetic coordinates to grid coordinates.

import { GridCoordinates, ProjectionParams } from '../types'

export const geodeticToGrid = (latitude: number, longitude: number, params: ProjectionParams): GridCoordinates => {
  if (!params.centralMeridian) {
    return {
      x: 0,
      y: 0
    }
  }
  // Prepare ellipsoid-based stuff.
  const e2 = params.flattening * (2.0 - params.flattening)
  const n = params.flattening / (2.0 - params.flattening)
  const aRoof = params.axis / (1.0 + n) * (1.0 + n ** 2 / 4.0 + n ** 4 / 64.0)
  const A = e2
  const B = (5.0 * e2 ** 2 - e2 ** 3) / 6.0
  const C = (104.0 * e2 ** 3 - 45.0 * e2 ** 4) / 120.0
  const D = (1237.0 * e2 ** 4) / 1260.0
  const beta1 = n / 2.0 - 2.0 * n ** 2 / 3.0 + 5.0 * n ** 3 / 16.0 + 41.0 * n ** 4 / 180.0
  const beta2 = 13.0 * n ** 2 / 48.0 - 3.0 * n ** 3 / 5.0 + 557.0 * n ** 4 / 1440.0
  const beta3 = 61.0 * n ** 3 / 240.0 - 103.0 * n ** 4 / 140.0
  const beta4 = 49561.0 * n ** 4 / 161280.0
  // Convert.
  const degToRad = Math.PI / 180.0
  const phi = +latitude * degToRad
  const lambdaZero = params.centralMeridian * degToRad
  const lambda = +longitude * degToRad
  const phiStar = phi - Math.sin(phi) * Math.cos(phi) * (
    A + B * Math.pow(Math.sin(phi), 2) + C * Math.pow(Math.sin(phi), 4) + D * Math.pow(Math.sin(phi), 6)
  )
  const deltaLambda = lambda - lambdaZero
  const xiPrim = Math.atan(Math.tan(phiStar) / Math.cos(deltaLambda))
  const etaPrim = Math.atanh(Math.cos(phiStar) * Math.sin(deltaLambda))
  const x = params.scale * aRoof * (
    xiPrim + beta1 * Math.sin(2.0 * xiPrim) * Math.cosh(2.0 * etaPrim) + beta2 * Math.sin(4.0 * xiPrim) * Math.cosh(4.0 * etaPrim) + beta3 * Math.sin(6.0 * xiPrim) * Math.cosh(6.0 * etaPrim) + beta4 * Math.sin(8.0 * xiPrim) * Math.cosh(8.0 * etaPrim)
  ) + params.falseNorthing
  const y = params.scale * aRoof * (
    etaPrim + beta1 * Math.cos(2.0 * xiPrim) * Math.sinh(2.0 * etaPrim) + beta2 * Math.cos(4.0 * xiPrim) * Math.sinh(4.0 * etaPrim) + beta3 * Math.cos(6.0 * xiPrim) * Math.sinh(6.0 * etaPrim) + beta4 * Math.cos(8.0 * xiPrim) * Math.sinh(8.0 * etaPrim)
  ) + params.falseEasting
  return {
    x: parseFloat(x.toFixed(3)),
    y: parseFloat(y.toFixed(3))
  }
}
