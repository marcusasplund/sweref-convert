# sweref-convert

ES2015 port of http://latlong.mellifica.se

For batch conversion of geodetic coordinates between [Swedish Grid RT 90](https://en.wikipedia.org/wiki/Swedish_grid), [SWEREF99](https://sv.wikipedia.org/wiki/SWEREF_99) and [WGS84](https://en.wikipedia.org/wiki/World_Geodetic_System) lat, lng

## wip!!
[![Greenkeeper badge](https://badges.greenkeeper.io/marcusasplund/sweref-convert.svg)](https://greenkeeper.io/)
[![GitHub issues](https://img.shields.io/github/issues/marcusasplund/sweref-convert.svg)](https://github.com/marcusasplund/sweref-convert/issues)
[![Build status](https://travis-ci.org/marcusasplund/sweref-convert.svg?branch=master)](https://travis-ci.org/marcusasplund/sweref-convert)
[![dependencies](https://david-dm.org/marcusasplund/sweref-convert.svg)](https://david-dm.org/marcusasplund/sweref-convert)

[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)


## [demo](https://pap.as/sweref/)
Js-framework: [hyperapp.js](https://github.com/hyperapp/hyperapp)
Offline support with service worker


## installation

````bash
    $ git clone https://github.com/marcusasplund/sweref-convert.git

    $ cd sweref-convert

    $ yarn

    $ yarn start
````

Open up application at http://localhost:4000/ in browser

## build a release

````bash
    $ yarn run build

````
This will generate a release directory with your minified/rev'd assets.


## serve static

````bash
    $ yarn run serve

````

This will use serve to statically serve your app from the release directory.

## Credits

All geodetic conversion calculations are taken from https://github.com/arnoldandreasson/latlong_mellifica_se
The rollup and fly config is based on https://github.com/tzellman/hyperapp-boilerplate
