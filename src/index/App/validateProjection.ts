import type { ProjectionParams } from '../types'

export function validateProjection (params: ProjectionParams): number {
  const meridian = params.centralMeridian
  if (meridian === null || !Number.isFinite(meridian) || Math.abs(meridian) > 180) {
    throw new RangeError('Projection requires a finite central meridian between -180 and 180 degrees')
  }
  if (!Number.isFinite(params.axis) || params.axis <= 0 ||
      !Number.isFinite(params.scale) || params.scale <= 0 ||
      !Number.isFinite(params.flattening) || params.flattening < 0 || params.flattening >= 1 ||
      !Number.isFinite(params.falseNorthing) || !Number.isFinite(params.falseEasting) ||
      params.latOfOrigin !== 0) {
    throw new RangeError('Invalid or unsupported projection parameters')
  }
  return meridian
}
