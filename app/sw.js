// Service Worker -- 离线缓存策略
const CACHE_VERSION = "v2";
const STATIC_CACHE = `fit-static-${CACHE_VERSION}`;
const DATA_CACHE = `fit-data-${CACHE_VERSION}`;
const IMG_CACHE = `fit-img-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/style.css",
  "./js/app.js",
  "./js/store.js",
  "./js/exercise-data.js",
  "./js/plan-engine.js",
  "./data/exercises-zh.min.json",
];

// 安装：预缓存静态资源
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// 激活：清理旧缓存
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => ![STATIC_CACHE, DATA_CACHE, IMG_CACHE].includes(k))
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// 请求拦截：分级缓存策略
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // 只处理 GET 请求
  if (req.method !== "GET") return;

  // JSON 数据：stale-while-revalidate
  if (url.pathname.endsWith(".json")) {
    event.respondWith(
      caches.open(DATA_CACHE).then(async (cache) => {
        const cached = await cache.match(req);
        const fetchPromise = fetch(req)
          .then((res) => {
            cache.put(req, res.clone());
            return res;
          })
          .catch(() => cached);
        return cached || fetchPromise;
      })
    );
    return;
  }

  // 图片和GIF：cache-first，缓存未命中才请求
  if (/\.(jpg|jpeg|png|gif|webp)$/i.test(url.pathname)) {
    event.respondWith(
      caches.open(IMG_CACHE).then(async (cache) => {
        const cached = await cache.match(req);
        if (cached) return cached;
        const res = await fetch(req);
        cache.put(req, res.clone());
        return res;
      })
    );
    return;
  }

  // 其他资源：cache-first 回退到网络
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});
