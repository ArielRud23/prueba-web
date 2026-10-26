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
    animacion: "asomar",
    imagen2: "img/sasuke.png",
    posicion2: "abajo-der",
    animacion2: "asomar"
  },
  {
    texto: "A veces, las cosas más especiales no son las que encontramos, sino las que alguien dedica tiempo a construir.",
    boton: "Siguiente →"
  },
  {
    texto: "Porque cuando alguien significa mucho para nosotros, hasta los pequeños detalles pueden convertirse en algo extraordinario.",
    boton: "Siguiente →",
    imagen: "img/pikachu-smile.png",
    posicion: "medio-der",
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
    posicion: "sobre-boton",
    animacion: "asomar-centro"
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
// ===== CREAR UNA ILUSTRACIÓN =====
function agregarIlustracion(ruta, posicion, animacion) {
  const img = document.createElement("img");
  img.src = ruta;
  img.alt = "";
  img.className = "ilustracion " + (posicion || "centro") + " " + (animacion || "");
  appEl.appendChild(img);
}

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

    // Ilustraciones (si la pantalla tiene). Borramos las anteriores.
  document.querySelectorAll(".ilustracion").forEach(function (el) {
    el.remove();
  });

  if (p.imagen) {
    agregarIlustracion(p.imagen, p.posicion, p.animacion);
  }
  if (p.imagen2) {
    agregarIlustracion(p.imagen2, p.posicion2, p.animacion2);
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

// Imágenes de Pikachu
const PIKA_PASO_1 = "img/pika-walk.png";
const PIKA_PASO_2 = "img/pika-walk-swap.png";
const PIKA_CABEZA = "img/pika-walk-head.png";
const PIKA_PARADO = "img/flat-pikachu.png";

// Imágenes de Naruto
const NARU_PASO_1 = "img/naruto-walk.png";
const NARU_PASO_2 = "img/naruto-walk-swap.png";
const NARU_CABEZA = "img/naruto-walk-head.png";
const NARU_PARADO = "img/naruto-finger.png";

const bienvenidaEl = document.getElementById("bienvenida");
const pikaEscena = document.getElementById("pika-escena");
const narutoEscena = document.getElementById("naruto-escena");
const globoEl = document.getElementById("globo");
const btnSi = document.getElementById("btn-si");

globoEl.textContent = PREGUNTA;

// Los dos caminan con el mismo ritmo: cambian de pie cada 380 ms
let pasoActual = 0;
const intervaloPasos = setInterval(function () {
  pasoActual = (pasoActual + 1) % 2;
  pikaEscena.src = pasoActual === 0 ? PIKA_PASO_1 : PIKA_PASO_2;
  narutoEscena.src = pasoActual === 0 ? NARU_PASO_1 : NARU_PASO_2;
}, 380);

// 0.5 s: entran los dos y empiezan a caminar
setTimeout(function () {
  pikaEscena.classList.add("caminando");
  narutoEscena.classList.add("caminando");
}, 500);

// 6.5 s: llegan a su lugar y se detienen
setTimeout(function () {
  clearInterval(intervaloPasos);
  pikaEscena.classList.remove("caminando");
  narutoEscena.classList.remove("caminando");
  pikaEscena.classList.add("quieto");
  narutoEscena.classList.add("quieto");
  pikaEscena.src = PIKA_PASO_1;
  narutoEscena.src = NARU_PASO_1;
}, 6500);

// 7.7 s: voltean la cabeza hacia la pantalla, los dos a la vez
setTimeout(function () {
  pikaEscena.src = PIKA_CABEZA;
  narutoEscena.src = NARU_CABEZA;
}, 7700);

// 9 s: se paran de frente con un saltito de sorpresa
setTimeout(function () {
  pikaEscena.classList.remove("quieto");
  narutoEscena.classList.remove("quieto");
  pikaEscena.src = PIKA_PARADO;
  narutoEscena.src = NARU_PARADO;
  pikaEscena.classList.add("levantado");
  narutoEscena.classList.add("levantado");
}, 9000);

// 9.8 s: aparece el globo con la pregunta
setTimeout(function () {
  globoEl.classList.add("visible");
}, 9800);

// 10.6 s: aparece el botón Sí
setTimeout(function () {
  btnSi.classList.add("visible");
}, 10600);

// Al tocar Sí, la bienvenida se desvanece y queda la app
btnSi.addEventListener("click", function () {
  bienvenidaEl.classList.add("saliendo");
  setTimeout(function () {
    bienvenidaEl.classList.add("oculta");
  }, 700);
});