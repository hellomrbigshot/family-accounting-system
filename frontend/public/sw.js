const CACHE_NAME = 'family-accounting-v0-0-6';
const OFFLINE_URL = '/offline.html';

// 需要预缓存的资源
const urlsToCache = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/icons/icon-72x72.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// 需要动态缓存的资源类型
const CACHEABLE_RESOURCES = [
  '/assets/',
  '.js',
  '.css',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot'
];

// 安装 Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  // 强制激活新的 Service Worker
  self.skipWaiting();
});

// 激活 Service Worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // 立即接管所有客户端
  self.clients.claim();
});

// 处理请求
self.addEventListener('fetch', event => {
  // 只处理 GET 请求
  if (event.request.method !== 'GET') return;

  // 检查是否是 API 请求
  const isApiRequest = event.request.url.includes('/api/');
  
  // API 请求直接走网络，不进行缓存
  if (isApiRequest) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // API 请求失败时返回错误响应
          return new Response('API request failed', {
            status: 503,
            headers: { 'Content-Type': 'text/plain' }
          });
        })
    );
    return;
  }
  
  // 检查是否是可缓存的资源
  const shouldCache = CACHEABLE_RESOURCES.some(resource => 
    event.request.url.includes(resource)
  );
  if(!event.request.url.startsWith('http')){
    //skip request
    return
  }
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果在缓存中找到响应，则返回缓存的响应
        if (response) {
          return response;
        }

        // 发起网络请求
        return fetch(event.request)
          .then(response => {
            // 检查是否收到有效的响应
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // 如果是可缓存的资源，则缓存响应
            if (shouldCache) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
            }

            return response;
          })
          .catch(() => {
            // 如果是页面请求且离线，返回离线页面
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }
            return new Response('Network error happened', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// 处理推送通知
// self.addEventListener('push', event => {
//   const options = {
//     body: event.data.text(),
//     icon: '/icons/icon-192x192.png',
//     badge: '/icons/icon-72x72.png',
//     vibrate: [100, 50, 100],
//     data: {
//       dateOfArrival: Date.now(),
//       primaryKey: 1
//     },
//     actions: [
//       {
//         action: 'explore',
//         title: '查看详情',
//         icon: '/icons/icon-72x72.png'
//       },
//       {
//         action: 'close',
//         title: '关闭',
//         icon: '/icons/icon-72x72.png'
//       }
//     ]
//   };

//   event.waitUntil(
//     self.registration.showNotification('家庭账本', options)
//   );
// });

// 处理通知点击
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
}); 