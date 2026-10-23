// ===== TEXTOS E IMÁGENES DE LA APP =====
// Todo lo que se ve en pantalla está aquí, en un solo lugar.
// El día de la sorpresa solo cambias estos textos.
//
// Campos de cada pantalla:
//   texto       -> texto principal
//   secundario  -> texto pequeño (opcional)
//   boton       -> texto del botón
//   imagen      -> ruta de la ilustración (opcional)
//   posicion    -> dónde va la imagen: "abajo-izq", "arriba-der", "abajo-der", "centro"
//   animacion   -> "asomar" (sube desde abajo), "respirar" (vaivén), "flotar" (sube y baja)
const pantallas = [
  {
    texto: "Hay cosas que merecen descubrirse sin prisa.",
    secundario: "Una pequeña experiencia.",
    boton: "Comenzar →",
    imagen: "img/flat-pikachu.png",
    posicion: "abajo-izq",
    animacion: "asomar"
  },
  {
    texto: "A veces, las cosas más especiales no son las que encontramos, sino las que alguien dedica tiempo a construir.",
    boton: "Siguiente →"
  },
  {
    texto: "Porque cuando alguien significa mucho para nosotros, hasta los pequeños detalles pueden convertirse en algo extraordinario.",
    boton: "Siguiente →",
    imagen: "img/pikachu-smile.png",
    posicion: "arriba-der",
    animacion: "asomar"
  },
  {
    texto: "Y hay una forma muy particular de decirle a alguien que es importante: dedicarle algo que no existía antes.",
    boton: "Siguiente →"
  },
  {
    texto: "¿Sabes qué tienen en común todas estas palabras?",
    boton: "Quiero saber →",
    imagen: "img/pika-sleep.png",
    posicion: "abajo-der",
    animacion: "respirar"
  },
  {
    texto: "Esta es la última pantalla de la prueba.",
    secundario: "Pronto habrá más.",
    boton: "Volver al inicio",
    imagen: "img/pika-hearth.png",
    posicion: "abajo-izq",
    animacion: "flotar"
  }
];

// ===== REFERENCIAS A LOS ELEMENTOS DE LA PÁGINA =====
const screenEl = document.getElementById("screen");
const btnNext = document.getElementById("btn-next");
const btnBack = document.getElementById("btn-back");
const counterEl = document.getElementById("counter");
const dotsEl = document.getElementById("dots");
const appEl = document.getElementById("app");

// ===== ESTADO =====
let actual = 0;

// ===== DIBUJAR UNA PANTALLA =====
function mostrarPantalla(indice) {
  const p = pantallas[indice];

  // Texto de la pantalla
  let html = '<p class="texto-principal">' + p.texto + '</p>';
  html += '<div class="separador"></div>';
  if (p.secundario) {
    html += '<p class="texto-secundario">' + p.secundario + '</p>';
  }
  screenEl.innerHTML = html;

  // Reiniciamos la animación de entrada del texto
  screenEl.classList.remove("entrando");
  void screenEl.offsetWidth;
  screenEl.classList.add("entrando");

  // Ilustración (si la pantalla tiene)
  const viejo = document.getElementById("ilustracion");
  if (viejo) viejo.remove();

  if (p.imagen) {
    const img = document.createElement("img");
    img.id = "ilustracion";
    img.src = p.imagen;
    img.alt = "";
    img.className = "ilustracion " + (p.posicion || "centro") + " " + (p.animacion || "");
    appEl.appendChild(img);
  }

  // Texto del botón
  btnNext.textContent = p.boton;

  // Contador y botón atrás
  if (indice === 0) {
    counterEl.textContent = "";
    btnBack.classList.add("oculto");
  } else {
    counterEl.textContent = indice + "/" + (pantallas.length - 1);
    btnBack.classList.remove("oculto");
  }

  dibujarPuntos(indice);
}

// ===== PUNTITOS DE PROGRESO =====
function dibujarPuntos(indice) {
  dotsEl.innerHTML = "";
  for (let i = 0; i < pantallas.length; i++) {
    const punto = document.createElement("span");
    punto.className = "dot" + (i === indice ? " activo" : "");
    dotsEl.appendChild(punto);
  }
}

// ===== BOTONES =====
btnNext.addEventListener("click", function () {
  if (actual < pantallas.length - 1) {
    actual++;
  } else {
    actual = 0;
  }
  mostrarPantalla(actual);
});

btnBack.addEventListener("click", function () {
  if (actual > 0) {
    actual--;
    mostrarPantalla(actual);
  }
});

// ===== SERVICE WORKER =====
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("sw.js");
  });
}

// ===== ARRANQUE =====
mostrarPantalla(actual);

// ===== ESCENA DE BIENVENIDA =====
// Texto de la pregunta. El día de la sorpresa cambias solo esta línea.
const PREGUNTA = "¿Eres tú?";

const bienvenidaEl = document.getElementById("bienvenida");
const pikaEscena = document.getElementById("pika-escena");
const globoEl = document.getElementById("globo");
const btnSi = document.getElementById("btn-si");

globoEl.textContent = PREGUNTA;

// Los dos fotogramas del caminar
const fotogramas = ["img/pika-walk.png", "img/pika-walk-swap.png"];
let fotogramaActual = 0;

// Cambia de fotograma cada 280 milisegundos para simular los pasos
const intervaloPasos = setInterval(function () {
  fotogramaActual = (fotogramaActual + 1) % fotogramas.length;
  pikaEscena.src = fotogramas[fotogramaActual];
}, 280);

// Arranca a caminar medio segundo después de abrir
setTimeout(function () {
  pikaEscena.classList.add("caminando");
}, 500);

// A los 4.5 segundos llega al centro: se detiene y voltea de frente
setTimeout(function () {
  clearInterval(intervaloPasos);
  pikaEscena.classList.remove("caminando");
  pikaEscena.src = "img/flat-pikachu.png";
  pikaEscena.classList.add("volteando");
}, 4500);

// A los 5.2 segundos aparece el globo con la pregunta
setTimeout(function () {
  globoEl.classList.add("visible");
}, 5200);

// A los 6 segundos aparece el botón Sí
setTimeout(function () {
  btnSi.classList.add("visible");
}, 6000);

// Al tocar Sí, la bienvenida se desvanece y queda la app
btnSi.addEventListener("click", function () {
  bienvenidaEl.classList.add("saliendo");
  setTimeout(function () {
    bienvenidaEl.classList.add("oculta");
  }, 700);
});