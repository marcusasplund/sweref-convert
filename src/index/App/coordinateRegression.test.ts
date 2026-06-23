import { describe, it, expect } from 'vitest'

import { geodeticToGrid } from './geodeticToGrid'
import { gridToGeodetic } from './gridToGeodetic'
import { projectionParams, ProjectionKey } from './projectionParams'
import { selectParams } from './selectParams'

const gridProjections = selectParams
  .map(p => p.value)
  .filter((value): value is ProjectionKey => value !== 'wgs84')

const swedenSamplePoints = [
  { name: 'Stockholm', lat: 59.3293, lng: 18.0686 },
  { name: 'Goteborg', lat: 57.7089, lng: 11.9746 },
  { name: 'Malmo', lat: 55.605, lng: 13.0038 },
  { name: 'Umea', lat: 63.8258, lng: 20.263 },
  { name: 'Kiruna', lat: 67.8558, lng: 20.2253 }
]

describe('Coordinate regression', () => {
  it('keeps grid roundtrip precision across supported grid projections', () => {
    const decimals = 5

    for (const projection of gridProjections) {
      const params = projectionParams(projection)

      for (const point of swedenSamplePoints) {
        const grid = geodeticToGrid(point.lat, point.lng, params)
        const geo = gridToGeodetic(grid.x, grid.y, params)

        expect(geo.lat, `${projection} lat roundtrip for ${point.name}`).toBeCloseTo(point.lat, decimals)
        expect(geo.lng, `${projection} lng roundtrip for ${point.name}`).toBeCloseTo(point.lng, decimals)
      }
    }
  })

  it('matches golden grid outputs for selected projections and points', () => {
    const golden = swedenSamplePoints.map(point => ({
      name: point.name,
      sweref99tm: geodeticToGrid(point.lat, point.lng, projectionParams('sweref99tm')),
      rt9025gonV: geodeticToGrid(point.lat, point.lng, projectionParams('rt9025gonV')),
      rt9050gonV: geodeticToGrid(point.lat, point.lng, projectionParams('rt9050gonV'))
    }))

    expect(golden).toMatchInlineSnapshot(`
      [
        {
          "name": "Stockholm",
          "rt9025gonV": {
            "x": 6580908.649,
            "y": 1628832.526,
          },
          "rt9050gonV": {
            "x": 6587425.922,
            "y": 1756785.837,
          },
          "sweref99tm": {
            "x": 6580743.008,
            "y": 674571.866,
          },
        },
        {
          "name": "Goteborg",
          "rt9025gonV": {
            "x": 6404687.792,
            "y": 1271721.807,
          },
          "rt9050gonV": {
            "x": 6399331.558,
            "y": 1405763.012,
          },
          "sweref99tm": {
            "x": 6400326.036,
            "y": 319758.02,
          },
        },
        {
          "name": "Malmo",
          "rt9025gonV": {
            "x": 6167516.506,
            "y": 1323454.776,
          },
          "rt9050gonV": {
            "x": 6164091.563,
            "y": 1465224.022,
          },
          "sweref99tm": {
            "x": 6163926.553,
            "y": 374243.759,
          },
        },
        {
          "name": "Umea",
          "rt9025gonV": {
            "x": 7087466.741,
            "y": 1719361.733,
          },
          "rt9050gonV": {
            "x": 7097157.043,
            "y": 1829798.803,
          },
          "sweref99tm": {
            "x": 7088280.798,
            "y": 758803.435,
          },
        },
        {
          "name": "Kiruna",
          "rt9025gonV": {
            "x": 7535815.659,
            "y": 1685892.816,
          },
          "rt9050gonV": {
            "x": 7544301.685,
            "y": 1780236.214,
          },
          "sweref99tm": {
            "x": 7536069.97,
            "y": 719583.123,
          },
        },
      ]
    `)
  })
})
