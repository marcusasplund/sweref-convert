import { describe, expect, it } from 'vitest'
import { geodeticToGrid } from './geodeticToGrid'
import { gridToGeodetic } from './gridToGeodetic'
import { projectionParams } from './projectionParams'
import { convertRow } from './conversionLogic'

// Lantmäteriet, Kontrollpunkter RT90 ↔ SWEREF 99, 2006-05-03.
// https://www.lantmateriet.se/contentassets/0f296052c56d425bb180430084d491d9/kontrollpunkter.pdf
// Use the direct-projection column, not the seven-parameter transformation.
const controls = [
  { name: 'A', rt90: [7453389.762, 1727060.905], tm: [7454204.638, 761811.242], sweref: [67 + 5 / 60 + 26.452769 / 3600, 21 + 2 / 60 + 5.101575 / 3600], bessel: [67 + 5 / 60 + 31.562861 / 3600, 21 + 2 / 60 + 21.178495 / 3600] },
  { name: 'B', rt90: [7047738.415, 1522128.637], tm: [7046077.605, 562140.337], sweref: [63 + 32 / 60 + 14.761735 / 3600, 16 + 14 / 60 + 59.594626 / 3600], bessel: [63 + 32 / 60 + 18.479016 / 3600, 16 + 15 / 60 + 11.688015 / 3600] },
  { name: 'C', rt90: [6671665.273, 1441843.186], tm: [6669189.376, 486557.055], sweref: [60 + 9 / 60 + 33.882413 / 3600, 14 + 45 / 60 + 28.167152 / 3600], bessel: [60 + 9 / 60 + 36.127426 / 3600, 14 + 45 / 60 + 38.951409 / 3600] },
  { name: 'D', rt90: [6249111.351, 1380573.079], tm: [6246136.458, 430374.835], sweref: [56 + 21 / 60 + 17.199245 / 3600, 13 + 52 / 60 + 23.754022 / 3600], bessel: [56 + 21 / 60 + 17.776903 / 3600, 13 + 52 / 60 + 33.749724 / 3600] }
]

// Numerical agreement with rounded control data, not physical transformation accuracy.
const toleranceMetres = 0.002
const errorMetres = (lat: number, lng: number, expected: number[]) => Math.hypot(
  (lat - expected[0]) * 111320,
  (lng - expected[1]) * 111320 * Math.cos(expected[0] * Math.PI / 180)
)

for (const point of controls) {
  describe(`Lantmäteriet control ${point.name}`, () => {
    it('matches independent RT90 direct-projection coordinates in both directions', () => {
      const params = projectionParams('rt9025gonV')
      const grid = geodeticToGrid(point.sweref[0], point.sweref[1], params)
      expect(Math.hypot(grid.x - point.rt90[0], grid.y - point.rt90[1])).toBeLessThan(toleranceMetres)
      const geo = gridToGeodetic(point.rt90[0], point.rt90[1], params)
      expect(errorMetres(geo.lat, geo.lng, point.sweref)).toBeLessThan(toleranceMetres)
    })

    it('matches independent SWEREF99 TM coordinates in both directions', () => {
      const params = projectionParams('sweref99tm')
      const grid = geodeticToGrid(point.sweref[0], point.sweref[1], params)
      expect(Math.hypot(grid.x - point.tm[0], grid.y - point.tm[1])).toBeLessThan(toleranceMetres)
      const geo = gridToGeodetic(point.tm[0], point.tm[1], params)
      expect(errorMetres(geo.lat, geo.lng, point.sweref)).toBeLessThan(toleranceMetres)
    })

    it('matches the published grid-to-grid transformation', () => {
      const row = convertRow(point.rt90[0], point.rt90[1], 'rt9025gonV', 'sweref99tm')
      expect(Math.hypot(row.x2 - point.tm[0], row.y2 - point.tm[1])).toBeLessThan(toleranceMetres)
    })

    it('matches Bessel geographic coordinates without treating them as WGS84', () => {
      const params = projectionParams('besselRt9025gonV')
      const grid = geodeticToGrid(point.bessel[0], point.bessel[1], params)
      expect(Math.hypot(grid.x - point.rt90[0], grid.y - point.rt90[1])).toBeLessThan(toleranceMetres)
      const geo = gridToGeodetic(point.rt90[0], point.rt90[1], params)
      expect(errorMetres(geo.lat, geo.lng, point.bessel)).toBeLessThan(toleranceMetres)
    })
  })
}
