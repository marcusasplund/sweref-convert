# sweref-convert

Modernized port of https://latlong.mellifica.se

For batch conversion of geodetic coordinates between [Swedish Grid RT 90](https://en.wikipedia.org/wiki/Swedish_grid), [SWEREF99](https://sv.wikipedia.org/wiki/SWEREF_99) and [WGS84](https://en.wikipedia.org/wiki/World_Geodetic_System) lat, lng


[![GitHub issues](https://img.shields.io/github/issues/marcusasplund/sweref-convert.svg)](https://github.com/marcusasplund/sweref-convert/issues)
[![Build status](https://travis-ci.org/marcusasplund/sweref-convert.svg?branch=master)](https://travis-ci.org/marcusasplund/sweref-convert)
[![Known Vulnerabilities](https://snyk.io/test/github/marcusasplund/sweref-convert/badge.svg?targetFile=package.json)](https://snyk.io/test/github/marcusasplund/sweref-convert?targetFile=package.json)

[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard) 

## [Demo](https://pap.as/sweref/)
Built with [SolidJS](https://github.com/solidjs/solid) and [SUID](https://github.com/swordev/suid)

Offline support with service worker


## installation

````bash
    $ git clone https://github.com/marcusasplund/sweref-convert.git

    $ cd sweref-convert

    $ yarn || npm install

    $ yarn start || npm run start
````

## build a release

````bash
    $ yarn build || npm run build

````
This will generate a release directory with your minified/rev'd assets.

## Credits

All geodetic conversion calculations are taken from https://github.com/arnoldandreasson/latlong_mellifica_se

## Reference systems and accuracy

Grid coordinates use `x` for northing and `y` for easting, in metres. Geographic coordinates use latitude first and longitude second, in decimal degrees.

The app's WGS84 option treats geographic coordinates as SWEREF 99 latitude and longitude for projection calculations. It does not transform between WGS84 realisations, observation epochs, or heights. WGS84 and SWEREF 99 are distinct reference systems. Do not use this approximation for survey work that requires precise datum or epoch transformations. See [Lantmäteriet's WGS84 guidance](https://www.lantmateriet.se/sv/geodata/gps-geodesi-och-swepos/Referenssystem/Tredimensionella-system/WGS-84/).

The selectable RT90 variants use direct projection on GRS80. For RT90 2.5 gon V, the parameters match [Lantmäteriet's RT90–SWEREF 99 direct projection](https://www.lantmateriet.se/sv/geodata/gps-geodesi-och-swepos/Transformationer/RT-90---SWEREF-99/). Lantmäteriet reports a mean error just under 0.07 m and a maximum error just over 0.2 m for this transformation. This app does not apply the residual correction model.

The `besselRt90...` parameter sets are available in the calculation modules but not in the app's projection selector. They project geographic coordinates on Bessel 1841 in the RT90 datum. They do not transform those coordinates to WGS84 or SWEREF 99. Do not route Bessel geographic coordinates through `convertRow`, whose geographic intermediate assumes SWEREF 99.

Calculations retain full floating-point precision. The table and CSV export round grid coordinates to three decimal places. Millimetre output precision does not imply millimetre transformation accuracy.

## Verify coordinate calculations

Run `npm test -- --run`. The independent reference tests in `src/index/App/referenceCoordinates.test.ts` use points A–D from [Lantmäteriet's control-point sheet, dated 2006-05-03](https://www.lantmateriet.se/contentassets/0f296052c56d425bb180430084d491d9/kontrollpunkter.pdf). The fixtures use the direct-projection column, not the seven-parameter transformation column.

The tests check forward and inverse RT90, SWEREF 99 TM, and Bessel projections, plus RT90-to-SWEREF 99 TM conversion. The numerical tolerance is 0.002 m against the published, rounded values. This tolerance checks the calculation and is separate from the physical accuracy of the transformation. The other selectable projection zones retain round-trip tests and selected outputs retain snapshots. Those tests detect regressions but do not establish independent accuracy for every zone.
