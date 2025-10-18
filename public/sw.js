// Service Worker for Progressive Web App capabilities
const CACHE_VERSION = 'v2';
const CACHE_NAME = `saleor-storefront-${CACHE_VERSION}`;

// Assets to cache on install
const STATIC_ASSETS = [
	'/',
	'/manifest.json',
	'/fonts/Geometos.ttf',
];

// Cache strategies
const CACHE_STRATEGIES = {
	CACHE_FIRST: 'cache-first',
	NETWORK_FIRST: 'network-first',
	NETWORK_ONLY: 'network-only',
	STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
};

// Route strategies
const ROUTE_STRATEGIES = [
	{ pattern: /\.(woff2|woff|ttf|eot)$/, strategy: CACHE_STRATEGIES.CACHE_FIRST },
	{ pattern: /\.(png|jpg|jpeg|svg|gif|webp|avif)$/, strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE },
	{ pattern: /\/api\//, strategy: CACHE_STRATEGIES.NETWORK_FIRST },
	{ pattern: /\/_next\/static\//, strategy: CACHE_STRATEGIES.CACHE_FIRST },
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			return cache.addAll(STATIC_ASSETS).catch((error) => {
				console.error('Failed to cache static assets:', error);
			});
		})
	);
	self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames
					.filter((name) => name.startsWith('saleor-storefront-') && name !== CACHE_NAME)
					.map((name) => caches.delete(name))
			);
		})
	);
	return self.clients.claim();
});

// Fetch event - handle network requests with appropriate strategies
self.addEventListener('fetch', (event) => {
	const { request } = event;
	const url = new URL(request.url);

	// Skip cross-origin requests
	if (url.origin !== location.origin) {
		return;
	}

	// Skip CSS and JS files - Next.js handles these with its own optimizations
	// Let the browser cache them naturally with the headers from next.config.js
	if (url.pathname.endsWith('.css') || url.pathname.endsWith('.js')) {
		return;
	}

	// Skip _next/static files - Next.js handles these with immutable caching
	if (url.pathname.startsWith('/_next/static/')) {
		return;
	}

	// Find matching strategy
	let strategy = CACHE_STRATEGIES.NETWORK_FIRST;
	for (const route of ROUTE_STRATEGIES) {
		if (route.pattern.test(url.pathname)) {
			strategy = route.strategy;
			break;
		}
	}

	// Apply strategy
	switch (strategy) {
		case CACHE_STRATEGIES.CACHE_FIRST:
			event.respondWith(cacheFirst(request));
			break;
		case CACHE_STRATEGIES.NETWORK_FIRST:
			event.respondWith(networkFirst(request));
			break;
		case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
			event.respondWith(staleWhileRevalidate(request));
			break;
		case CACHE_STRATEGIES.NETWORK_ONLY:
		default:
			// Let browser handle it
			break;
	}
});

// Cache first strategy
async function cacheFirst(request) {
	const cache = await caches.open(CACHE_NAME);
	const cached = await cache.match(request);

	if (cached) {
		return cached;
	}

	try {
		const response = await fetch(request);
		if (response.ok) {
			cache.put(request, response.clone());
		}
		return response;
	} catch (error) {
		console.error('Fetch failed:', error);
		throw error;
	}
}

// Network first strategy
async function networkFirst(request) {
	const cache = await caches.open(CACHE_NAME);

	try {
		const response = await fetch(request);
		if (response.ok) {
			cache.put(request, response.clone());
		}
		return response;
	} catch (error) {
		const cached = await cache.match(request);
		if (cached) {
			return cached;
		}
		throw error;
	}
}

// Stale while revalidate strategy
async function staleWhileRevalidate(request) {
	const cache = await caches.open(CACHE_NAME);
	const cached = await cache.match(request);

	const fetchPromise = fetch(request).then((response) => {
		if (response.ok) {
			cache.put(request, response.clone());
		}
		return response;
	});

	return cached || fetchPromise;
}

// Handle messages from clients
self.addEventListener('message', (event) => {
	if (event.data && event.data.type === 'SKIP_WAITING') {
		self.skipWaiting();
	}
});
