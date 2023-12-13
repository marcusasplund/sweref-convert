# sweref-convert

ES2015 port of http://latlong.mellifica.se

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

    $ yarn

    $ yarn start
````

## build a release

````bash
    $ yarn build

````
This will generate a release directory with your minified/rev'd assets.

## Credits

All geodetic conversion calculations are taken from https://github.com/arnoldandreasson/latlong_mellifica_se
