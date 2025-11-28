const CACHE_PREFIX = 'lavender-pwa'
const PRECACHE_VERSION = 'v1'
const PRECACHE_NAME = `${CACHE_PREFIX}-${PRECACHE_VERSION}`
const RUNTIME_NAME = `${CACHE_PREFIX}-runtime`
const OFFLINE_URL = '/offline.html'

self.__PRECACHE_MANIFEST = self.__PRECACHE_MANIFEST || []
const APP_SHELL = [
  '/',
  '/index.html',
  OFFLINE_URL,
  '/manifest.webmanifest',
  '/icons/lavender-192.png',
  '/icons/lavender-512.png',
]
const PRECACHE_URLS = [...new Set([...APP_SHELL, ...self.__PRECACHE_MANIFEST])]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(PRECACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith(CACHE_PREFIX) && key !== PRECACHE_NAME && key !== RUNTIME_NAME)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') {
    return
  }

  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request))
    return
  }

  const url = new URL(request.url)

  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(request))
    return
  }

  if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'image' ||
    request.destination === 'font'
  ) {
    event.respondWith(staleWhileRevalidate(request))
  }
})

async function handleNavigation(request) {
  try {
    const response = await fetch(request)
    const cache = await caches.open(RUNTIME_NAME)
    cache.put(request, response.clone())
    return response
  } catch {
    const cache = await caches.open(PRECACHE_NAME)
    const cached = await cache.match(OFFLINE_URL)
    return cached ?? Response.error()
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(PRECACHE_NAME)
  const cached = await cache.match(request)
  if (cached) {
    return cached
  }

  const response = await fetch(request)
  cache.put(request, response.clone())
  return response
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_NAME)
  const cached = await cache.match(request)

  const networkFetch = fetch(request)
    .then((response) => {
      cache.put(request, response.clone())
      return response
    })
    .catch(() => cached)

  return cached ?? networkFetch
}
