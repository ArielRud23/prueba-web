// ===== VERSIÓN DE LA MEMORIA =====
// Cada vez que cambies cualquier archivo de la app, sube este número
// (v1, v2, v3...) para que el iPhone descargue la versión nueva.
const VERSION = "v18";
const NOMBRE_CACHE = "proyecto-" + VERSION;

// ===== ARCHIVOS QUE SE GUARDAN EN EL TELÉFONO =====
const ARCHIVOS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.json",
  "./img/flat-pikachu.png",
  "./img/pikachu-smile.png",
  "./img/pika-sleep.png",
  "./img/pika-hearth.png",
  "./img/pika-walk.png",
  "./img/pika-walk-swap.png",
  "./img/min-poke.png",
  "./img/pokeball.png",
  "./img/sheet.png",
  "./img/pika-walk-head.png",
  "./img/sasuke.png",
  "./img/kakashi.png",
  "./img/naruto-jutsu.png",
  "./img/sakura-hand.png",
];

// ===== INSTALACIÓN =====
// Se ejecuta la primera vez: guarda todos los archivos en la memoria.
self.addEventListener("install", function (evento) {
  evento.waitUntil(
    caches.open(NOMBRE_CACHE).then(function (cache) {
      return cache.addAll(ARCHIVOS);
    })
  );
  self.skipWaiting();
});

// ===== ACTIVACIÓN =====
// Borra las memorias de versiones viejas para no acumular basura.
self.addEventListener("activate", function (evento) {
  evento.waitUntil(
    caches.keys().then(function (nombres) {
      return Promise.all(
        nombres
          .filter(function (nombre) { return nombre !== NOMBRE_CACHE; })
          .map(function (nombre) { return caches.delete(nombre); })
      );
    })
  );
  self.clients.claim();
});

// ===== PETICIONES =====
// Cuando la app pide un archivo, primero lo busca en la memoria.
// Si no está, lo pide a internet.
self.addEventListener("fetch", function (evento) {
  evento.respondWith(
    caches.match(evento.request).then(function (guardado) {
      return guardado || fetch(evento.request);
    })
  );
});