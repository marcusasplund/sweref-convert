import { geodeticToGrid } from './geodeticToGrid'
import { gridToGeodetic } from './gridToGeodetic'
import { latToDms, lngToDms } from './latlngConvert'
import {ProjectionKey, projectionParams} from './projectionParams'
import { ConvertedRow } from '../types'

export const convertRow = (x: number, y: number, currentFrom: ProjectionKey, currentTo: ProjectionKey): ConvertedRow => {
  if (currentFrom !== 'wgs84' && currentTo !== 'wgs84') {
    const converted = gridToGeodetic(x, y, projectionParams(currentFrom))
    const twoWayConverted = geodeticToGrid(converted.lat, converted.lng, projectionParams(currentTo))
    return {
      x,
      y,
      lat: converted.lat,
      lng: converted.lng,
      x2: twoWayConverted.x,
      y2: twoWayConverted.y,
      latdms: latToDms(+converted.lat),
      lngdms: lngToDms(+converted.lat)
    }
  }
  if (currentFrom === 'wgs84') {
    const converted = geodeticToGrid(x, y, projectionParams(currentTo))
    return {
      x: converted.x,
      y: converted.y,
      lat: x,
      lng: y,
      x2: 0,
      y2: 0,
      latdms: latToDms(+x),
      lngdms: lngToDms(+y)
    }
  } else {
    const converted = gridToGeodetic(x, y, projectionParams(currentFrom))
    return {
      x,
      y,
      lat: converted.lat,
      lng: converted.lng,
      x2: 0,
      y2: 0,
      latdms: latToDms(+converted.lat),
      lngdms: lngToDms(+converted.lat)
    }
  }
}
