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
  if (currentFrom === 'wgs84' && currentTo === 'wgs84') {
    return {
      lat: x,
      latdms: latToDms(+x),
      lng: y,
      lngdms: lngToDms(+y),
      x,
      x2: 0,
      y,
      y2: 0
    }
  }

  const paramsFrom = projectionParams(currentFrom)
  const paramsTo = projectionParams(currentTo)

  // Grid -> Grid via WGS84
  if (currentFrom !== 'wgs84' && currentTo !== 'wgs84') {
    const geo = gridToGeodetic(x, y, paramsFrom)
    const grid2 = currentFrom === currentTo ? { x, y } : geodeticToGrid(geo.lat, geo.lng, paramsTo)
    return {
      lat: geo.lat,
      latdms: latToDms(+geo.lat),
      lng: geo.lng,
      lngdms: lngToDms(+geo.lng),
      x,
      x2: grid2.x,
      y,
      y2: grid2.y
    }
  }

  // WGS84 -> Grid
  if (currentFrom === 'wgs84') {
    const grid = geodeticToGrid(x, y, paramsTo)
    return {
      lat: x,
      latdms: latToDms(+x),
      lng: y,
      lngdms: lngToDms(+y),
      x: grid.x,
      x2: 0,
      y: grid.y,
      y2: 0
    }
  }

  // Grid -> WGS84
  const geo = gridToGeodetic(x, y, paramsFrom)
  return {
    lat: geo.lat,
    latdms: latToDms(+geo.lat),
    lng: geo.lng,
    lngdms: lngToDms(+geo.lng),
    x,
    x2: 0,
    y,
    y2: 0
  }
}
