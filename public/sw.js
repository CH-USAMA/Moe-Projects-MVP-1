// Moe Limo Hub Service Worker
const CACHE_NAME = 'moelimo-v1';
// Cache installation removed to prevent ERR_FAILED on dynamic Inertia redirects
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// We only want the Service Worker for Push Notifications right now.
// Intercepting fetch for dynamic Inertia routes often causes opaque redirect errors.
self.addEventListener('fetch', (event) => {
    // Pass through all requests normally
});


self.addEventListener('push', (event) => {
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }

    const data = event.data ? event.data.json() : { title: 'Moe Limo Hub', body: 'New notification' };

    const title = data.title;
    const options = {
        body: data.body,
        icon: '/pwa-icon-192.png',
        badge: '/pwa-icon-192.png',
        data: {
            url: data.url || '/'
        }
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});

