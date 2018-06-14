/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js");

workbox.skipWaiting();
workbox.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "index.html",
    "revision": "2dc67c27946e24db9511ed9c65628352"
  },
  {
    "url": "leaflet.9018a4f9.css",
    "revision": "9f56f57ade06d2d9399e70a3a3164fef"
  },
  {
    "url": "leaflet.9018a4f9.js",
    "revision": "48d6d80b8452727e7066b3f8f309ad19"
  },
  {
    "url": "src.52213b2d.css",
    "revision": "ce6c778799fcbb77111e7dfdda8b44eb"
  },
  {
    "url": "src.52213b2d.js",
    "revision": "109479628bd8c815a8eea1edc02c0c57"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerNavigationRoute("dist/index.html");
