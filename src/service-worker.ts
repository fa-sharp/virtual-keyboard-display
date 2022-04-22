/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';

declare const self: ServiceWorkerGlobalScope;

clientsClaim();

const manifestURLs = self.__WB_MANIFEST.map((entry) => {
  if (typeof entry === 'string')
    return entry;
  else {
    const url = new URL(entry.url, self.location.href);
    return url.href;
  }
})

// criteria to match URLs that should be cached
const matchURL = (url: URL) =>
  (url.origin === self.location.origin) && 
    (url.pathname === '/' ||  // index.html page
      manifestURLs.includes(url.href) ||  // manifest URLs (js, css)
      url.pathname.endsWith('.png') ||  
      url.pathname.endsWith('.json') || // favico, manifest.json, etc.
      url.pathname.endsWith('.ico') ||
      url.pathname.endsWith('.wav') || // audio sample files
      url.pathname.endsWith('.mp3'))


// Runtime caching
registerRoute(
  ({ url }) => {
    const matchesCriteria = matchURL(url);
    return matchesCriteria;
  },
  // Network First strategy - safest for now.
  new NetworkFirst({
    cacheName: 'assets-v1',
    plugins: [
      // Ensure that once this runtime cache reaches a maximum size the
      // least-recently used files are removed.
      new ExpirationPlugin({ maxEntries: 50 }),
    ],
  })
);

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Any other custom service worker logic can go here.