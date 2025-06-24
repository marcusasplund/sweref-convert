import { geodeticToGrid } from './geodeticToGrid'
import { gridToGeodetic } from './gridToGeodetic'
import { latToDms, lngToDms } from './latlngConvert'
import { ProjectionKey, projectionParams } from './projectionParams'
import { ConvertedRow } from '../types'

/**
 * Convert a coordinate pair between projections, with optional reverse conversion.
 */
export const convertRow = (
  x: number,
  y: number,
  currentFrom: ProjectionKey,
  currentTo: ProjectionKey
): ConvertedRow => {
  // No-op if same projection
  if (currentFrom === currentTo) {
    return {
      x,
      y,
      lat: x,
      lng: y,
      x2: 0,
      y2: 0,
      latdms: latToDms(x),
      lngdms: lngToDms(y)
    }
  }

  const paramsFrom = projectionParams(currentFrom)
  const paramsTo = projectionParams(currentTo)

  // Grid -> Grid via WGS84
  if (currentFrom !== 'wgs84' && currentTo !== 'wgs84') {
    const geo = gridToGeodetic(x, y, paramsFrom)
    const grid2 = geodeticToGrid(geo.lat, geo.lng, paramsTo)
    return {
      x,
      y,
      lat: geo.lat,
      lng: geo.lng,
      x2: grid2.x,
      y2: grid2.y,
      latdms: latToDms(+geo.lat),
      lngdms: lngToDms(+geo.lng)
    }
  }

  // WGS84 -> Grid
  if (currentFrom === 'wgs84') {
    const grid = geodeticToGrid(x, y, paramsTo)
    return {
      x: grid.x,
      y: grid.y,
      lat: x,
      lng: y,
      x2: 0,
      y2: 0,
      latdms: latToDms(x),
      lngdms: lngToDms(y)
    }
  }

  // Grid -> WGS84
  const geo = gridToGeodetic(x, y, paramsFrom)
  return {
    x,
    y,
    lat: geo.lat,
    lng: geo.lng,
    x2: 0,
    y2: 0,
    latdms: latToDms(+geo.lat),
    lngdms: lngToDms(+geo.lng)
  }
}
