// ===== TEXTOS DE LA APP =====
// Todo lo que se lee en pantalla está aquí, en un solo lugar.
// El día de la sorpresa solo cambias estos textos.
const pantallas = [
  {
    texto: "Hay cosas que merecen descubrirse sin prisa.",
    secundario: "Una pequeña experiencia.",
    boton: "Comenzar →"
  },
  {
    texto: "A veces, las cosas más especiales no son las que encontramos, sino las que alguien dedica tiempo a construir.",
    boton: "Siguiente →"
  },
  {
    texto: "Porque cuando alguien significa mucho para nosotros, hasta los pequeños detalles pueden convertirse en algo extraordinario.",
    boton: "Siguiente →"
  },
  {
    texto: "Y hay una forma muy particular de decirle a alguien que es importante: dedicarle algo que no existía antes.",
    boton: "Siguiente →"
  },
  {
    texto: "¿Sabes qué tienen en común todas estas palabras?",
    boton: "Quiero saber →"
  },
  {
    texto: "Esta es la última pantalla de la prueba.",
    secundario: "Pronto habrá más.",
    boton: "Volver al inicio"
  }
];

// ===== REFERENCIAS A LOS ELEMENTOS DE LA PÁGINA =====
const screenEl = document.getElementById("screen");
const btnNext = document.getElementById("btn-next");
const btnBack = document.getElementById("btn-back");
const counterEl = document.getElementById("counter");
const dotsEl = document.getElementById("dots");

// ===== ESTADO =====
// Guarda en qué pantalla va la persona. Empieza en la 0 (la primera).
let actual = 0;

// ===== DIBUJAR UNA PANTALLA =====
function mostrarPantalla(indice) {
  const p = pantallas[indice];

  // Construimos el contenido de la pantalla
  let html = '<p class="texto-principal">' + p.texto + '</p>';
  html += '<div class="separador"></div>';
  if (p.secundario) {
    html += '<p class="texto-secundario">' + p.secundario + '</p>';
  }
  screenEl.innerHTML = html;

  // Reiniciamos la animación de entrada
  screenEl.classList.remove("entrando");
  void screenEl.offsetWidth;
  screenEl.classList.add("entrando");

  // Texto del botón
  btnNext.textContent = p.boton;

  // Contador arriba (vacío en la primera pantalla)
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
    actual = 0; // en la última pantalla, vuelve al inicio
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
// Permite que la app funcione sin conexión.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("sw.js");
  });
}

// ===== ARRANQUE =====
mostrarPantalla(actual);