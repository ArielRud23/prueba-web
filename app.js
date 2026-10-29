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
    texto: "A partir de ahora, nosotros vamos a acompañarte hasta el fin de este recorrido",
    secundario: "¿Aceptas?",
    boton: "Comenzar →",
    imagen: "img/flat-pikachu.png",
    posicion: "abajo-izq",
    animacion: "asomar",
    imagen2: "img/sasuke.png",
    posicion2: "abajo-der",
    animacion2: "asomar"
  },
  {
    texto: "Hemos investigado un poco sobre ti y hemos descubierto que eres una persona muy especial... También sabemos que desde que tú eres pequeña, nos has acompañado durante todo este tiempo!",
    secundario: "Es momento de devolverte el favor... así que, nosotros queremos acompañarte a ti en este bonito día.",
    boton: "Siguiente →",
    clase: "pantalla-larga",
    imagen: "img/kakashi.png",
    posicion: "abajo-izq",
    animacion: "asomar espejo",
    imagen2: "img/naruto-jutsu.png",
    posicion2: "abajo-centro",
    animacion2: "asomar",
    imagen3: "img/sakura-hand.png",
    posicion3: "abajo-der",
    animacion3: "asomar"
  },
  {
    texto: "¿Que te parece si nos buscas... no sé, tal vez en un, Miniso? Y nos traes a la realidad para acompañarte más de cerca.",
    boton: "¡Ya los encontramos! →",
    imagen: "img/pikachu-smile.png",
    posicion: "medio-der",
    animacion: "asomar",
    imagen2: "img/naruto-smile-left.png",
    posicion2: "medio-izq",
    animacion2: "asomar"
  },
  {
    texto: "Espero que en una próxima vez, él nos acompañe en forma de peluchito, así como nosotros nos volvimos realidad y permaneceremos siempre contigo... Te encontraremos, Choco!",
    boton: "Siguiente →",
    clase: "pantalla-choco",
    imagen: "img/choco.png",
    posicion: "choco-izq",
    animacion: "asomar",
    imagen2: "img/naruto-pokeball.png",
    posicion2: "naruto-der",
    animacion2: "asomar"
  },
  {
    texto: "Y bueno, mi amor... pero antes de que todo esto termine, quiero que caminemos un poco, por que nos queda un último detalle que quiero que descubras, iremos los dos... o bueno, tenemos algo de compañia...",
    boton: "Quiero saber →",
    clase: "pantalla-final-trio",
    imagen: "img/pika-sleep.png",
    posicion: "trio-der",
    animacion: "respirar",
    imagen2: "img/choco-acostado.png",
    posicion2: "trio-izq",
    animacion2: "respirar espejo",
    imagen3: "img/ariel-karina.png",
    posicion3: "trio-centro",
    animacion3: "asomar"
  },
  {
    texto: "Parece que si tenemos compañía...",
    boton: "Siguiente →",
    clase: "pantalla-compania",
    imagen: "img/pika-hearth.png",
    posicion: "sobre-boton",
    animacion: "asomar-centro",
    secuencia: "compania"
  },
  {
    texto: "Última misión.",
    boton: "Continuar →",
    esRegalo: true
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
let temporizadorRegalo = null;
let temporizadoresSecuencia = [];

// =====================================================
// ===== CONFIGURACIÓN FÁCIL (aquí cambias lo importante) =====
// =====================================================

// Pantalla del Miniso (cuenta desde 0). Si cambias el orden, cambia este número.
const PANTALLA_MINISO = 2;

// Código que se descubre al raspar. El día de la sorpresa ponlo aquí.
const CODIGO_REGALO = "486C6F0A";

// Color borgoña del iPhone (vino chocolate).
const COLOR_BORGONA = [90, 31, 43];

// Avisos de hora. Formato 24 horas: 20 y 20 son las 8:20 p. m.
// Cada aviso sale una sola vez.
const AVISOS = [
  {
    id: "aviso-1",
    hora: 20,
    minuto: 20,
    urgente: false,
    texto: "Hay una última misión pendiente... y el tiempo se acaba."
  },
  {
    id: "aviso-2",
    hora: 20,
    minuto: 30,
    urgente: true,
    texto: "¡Ahora o nunca!"
  }
];

// Clave con que se guarda el progreso en el teléfono.
const CLAVE_PROGRESO = "progreso-karina";
const CLAVE_AVISOS = "avisos-vistos";

// ===== MEMORIA DEL PROGRESO =====
function guardarProgreso(indice) {
  try {
    localStorage.setItem(CLAVE_PROGRESO, String(indice));
  } catch (e) {}
}

function leerProgreso() {
  try {
    const valor = localStorage.getItem(CLAVE_PROGRESO);
    if (valor === null) return null;
    const n = parseInt(valor, 10);
    if (isNaN(n) || n < 0 || n >= pantallas.length) return null;
    return n;
  } catch (e) {
    return null;
  }
}

function borrarProgreso() {
  try {
    localStorage.removeItem(CLAVE_PROGRESO);
    localStorage.removeItem(CLAVE_AVISOS);
  } catch (e) {}
}

// ===== HORA ACTUAL (con modo de prueba) =====
// Para ensayar sin esperar, abre la app con ?hora=20:25 al final de la dirección.
// Ejemplo: arielrud23.github.io/prueba-web/?hora=20:25
function horaActual() {
  const params = new URLSearchParams(window.location.search);
  const simulada = params.get("hora");
  if (simulada) {
    const partes = simulada.split(":");
    const h = parseInt(partes[0], 10);
    const m = parseInt(partes[1] || "0", 10);
    if (!isNaN(h) && !isNaN(m)) {
      return { hora: h, minuto: m };
    }
  }
  const ahora = new Date();
  return { hora: ahora.getHours(), minuto: ahora.getMinutes() };
}

// ===== AVISOS DE HORA =====
function avisosVistos() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_AVISOS) || "[]");
  } catch (e) {
    return [];
  }
}

function marcarAvisoVisto(id) {
  try {
    const vistos = avisosVistos();
    if (vistos.indexOf(id) === -1) vistos.push(id);
    localStorage.setItem(CLAVE_AVISOS, JSON.stringify(vistos));
  } catch (e) {}
}

let avisoAbierto = false;

function revisarAvisos() {
  if (avisoAbierto) return;
  const ahora = horaActual();
  const minutosAhora = ahora.hora * 60 + ahora.minuto;
  const vistos = avisosVistos();

  // Buscamos el aviso más tardío que ya toca y que no se ha visto.
  let pendiente = null;
  for (let i = 0; i < AVISOS.length; i++) {
    const a = AVISOS[i];
    const minutosAviso = a.hora * 60 + a.minuto;
    if (minutosAhora >= minutosAviso && vistos.indexOf(a.id) === -1) {
      pendiente = a;
    }
  }
  if (!pendiente) return;

  // Si ya toca el último, damos por vistos los anteriores para no apilar avisos.
  for (let i = 0; i < AVISOS.length; i++) {
    const a = AVISOS[i];
    if (a.hora * 60 + a.minuto < pendiente.hora * 60 + pendiente.minuto) {
      marcarAvisoVisto(a.id);
    }
  }
  mostrarAviso(pendiente);
}

function mostrarAviso(aviso) {
  const capa = document.getElementById("aviso");
  const texto = document.getElementById("aviso-texto");
  const boton = document.getElementById("btn-aviso");

  avisoAbierto = true;
  texto.textContent = aviso.texto;
  capa.classList.toggle("urgente", !!aviso.urgente);
  capa.classList.remove("saliendo");
  capa.classList.remove("oculta");

  boton.onclick = function () {
    marcarAvisoVisto(aviso.id);
    capa.classList.add("saliendo");
    setTimeout(function () {
      capa.classList.add("oculta");
      avisoAbierto = false;
    }, 500);
  };
}

// ===== PANTALLA DE REANUDAR =====
function mostrarReanudar(indiceGuardado, alElegir) {
  const capa = document.getElementById("reanudar");
  capa.classList.remove("saliendo");
  capa.classList.remove("oculta");

  function cerrar() {
    capa.classList.add("saliendo");
    setTimeout(function () {
      capa.classList.add("oculta");
    }, 500);
  }

  document.getElementById("btn-seguir").onclick = function () {
    cerrar();
    alElegir(indiceGuardado);
  };

  document.getElementById("btn-reiniciar").onclick = function () {
    borrarProgreso();
    cerrar();
    alElegir(null);
  };
}

// ===== PANTALLA DEL REGALO =====
function mostrarRegalo() {
  const capa = document.getElementById("regalo-pantalla");
  const caja = document.getElementById("regalo-caja");
  caja.src = "img/gift.png";
  caja.classList.remove("abriendo");
  capa.classList.remove("oculta");

  // Después de un momento, el regalo se entreabre: algo quiere salir.
  setTimeout(function () {
    caja.src = "img/semiopen-gift.png";
  }, 2500);

  caja.onclick = function () {
    caja.onclick = null;
    caja.classList.add("abriendo");
    setTimeout(function () {
      capa.classList.add("oculta");
      mostrarRasca();
    }, 900);
  };
}

// ===== RASCA Y GANA =====
function mostrarRasca() {
  const capa = document.getElementById("rasca-pantalla");
  const canvas = document.getElementById("rasca-canvas");
  const codigo = document.getElementById("rasca-codigo");
  const mensaje = document.getElementById("rasca-mensaje");
  const caja = document.getElementById("rasca-caja");

  codigo.textContent = CODIGO_REGALO;
  mensaje.classList.remove("visible");
  capa.classList.remove("oscuro");
  capa.style.background = "#F4EDE2";
  capa.classList.remove("oculta");

  // Ajustamos el canvas al tamaño real de la caja.
  const ancho = caja.clientWidth;
  const alto = caja.clientHeight;
  const escala = window.devicePixelRatio || 1;
  canvas.width = ancho * escala;
  canvas.height = alto * escala;
  const ctx = canvas.getContext("2d");
  ctx.scale(escala, escala);

  // Capa gris que se va a raspar.
  ctx.globalCompositeOperation = "source-over";
  const gris = ctx.createLinearGradient(0, 0, ancho, alto);
  gris.addColorStop(0, "#B8B8B8");
  gris.addColorStop(0.5, "#D2D2D2");
  gris.addColorStop(1, "#A8A8A8");
  ctx.fillStyle = gris;
  ctx.fillRect(0, 0, ancho, alto);
  ctx.fillStyle = "#8E8E8E";
  ctx.font = "16px Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Raspa aquí", ancho / 2, alto / 2);

  let rascando = false;
  let terminado = false;
  let ultimaMedicion = 0;

  function raspar(evento) {
    if (terminado) return;
    const rect = canvas.getBoundingClientRect();
    const x = evento.clientX - rect.left;
    const y = evento.clientY - rect.top;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 11, 0, Math.PI * 2);
    ctx.fill();

    // Medimos el avance cada cierto tiempo (es costoso hacerlo en cada movimiento).
    const ahora = Date.now();
    if (ahora - ultimaMedicion > 90) {
      ultimaMedicion = ahora;
      actualizarAvance();
    }
  }

  function actualizarAvance() {
    const datos = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparentes = 0;
    let total = 0;
    // Revisamos un píxel de cada 16 para que sea rápido.
    for (let i = 3; i < datos.length; i += 64) {
      total++;
      if (datos[i] < 128) transparentes++;
    }
    const avance = transparentes / total; // de 0 a 1

    // El fondo se va pintando de borgoña según lo que se ha raspado.
    const t = Math.min(1, avance / 0.85);
    const base = [244, 237, 226];
    const r = Math.round(base[0] + (COLOR_BORGONA[0] - base[0]) * t);
    const g = Math.round(base[1] + (COLOR_BORGONA[1] - base[1]) * t);
    const b = Math.round(base[2] + (COLOR_BORGONA[2] - base[2]) * t);
    capa.style.background = "rgb(" + r + "," + g + "," + b + ")";
    if (t > 0.45) capa.classList.add("oscuro");

    // Cuando ya se raspó casi todo, terminamos solos.
    if (avance > 0.85) {
      terminar();
    }
  }

  function terminar() {
    terminado = true;
    capa.style.background = "rgb(" + COLOR_BORGONA.join(",") + ")";
    capa.classList.add("oscuro");
    // Quitamos lo que quede de gris.
    canvas.style.transition = "opacity 600ms";
    canvas.style.opacity = "0";
    setTimeout(function () {
      mensaje.classList.add("visible");
    }, 700);
  }

  canvas.onpointerdown = function (e) {
    rascando = true;
    canvas.setPointerCapture(e.pointerId);
    raspar(e);
  };
  canvas.onpointermove = function (e) {
    if (rascando) raspar(e);
  };
  canvas.onpointerup = function () {
    rascando = false;
  };
  canvas.onpointercancel = function () {
    rascando = false;
  };
}

// ===== DIBUJAR UNA PANTALLA =====
// ===== CREAR UNA ILUSTRACIÓN =====
function agregarIlustracion(ruta, posicion, animacion) {
  const img = document.createElement("img");
  img.src = ruta;
  img.alt = "";
  img.className = "ilustracion " + (posicion || "centro") + " " + (animacion || "");
  appEl.appendChild(img);
}

// ===== SECUENCIA AUTOMÁTICA DE LA PANTALLA "COMPAÑÍA" =====
// Tiempos en milisegundos desde que entra la pantalla. Cámbialos aquí.
const TIEMPO_PIKA_SALE = 3500;      // Pikachu empieza a desvanecerse
const TIEMPO_TODOS_ENTRAN = 4300;   // entra la imagen de todos los personajes
const TIEMPO_PAREJA_ENTRA = 8000;   // entran Ariel y Karina desde abajo

function limpiarSecuencia() {
  temporizadoresSecuencia.forEach(function (t) {
    clearTimeout(t);
  });
  temporizadoresSecuencia = [];
}

function iniciarSecuenciaCompania() {
  // 1. Pikachu se desvanece
  temporizadoresSecuencia.push(setTimeout(function () {
    const pika = document.querySelector(".ilustracion.sobre-boton");
    if (pika) pika.classList.add("desvaneciendo");
  }, TIEMPO_PIKA_SALE));

  // 2. Entran todos los personajes, en el centro
  temporizadoresSecuencia.push(setTimeout(function () {
    const todos = document.createElement("img");
    todos.src = "img/all-anime.png";
    todos.alt = "";
    todos.className = "ilustracion todos-centro";
    appEl.appendChild(todos);
  }, TIEMPO_TODOS_ENTRAN));

  // 3. Entran Ariel y Karina desde abajo, preocupados
  temporizadoresSecuencia.push(setTimeout(function () {
    const pareja = document.createElement("img");
    pareja.src = "img/ariel-karina-preocupados.png";
    pareja.alt = "";
    pareja.className = "ilustracion pareja-abajo";
    appEl.appendChild(pareja);
  }, TIEMPO_PAREJA_ENTRA));
}

function mostrarPantalla(indice) {
  const p = pantallas[indice];
  guardarProgreso(indice);

  // Texto de la pantalla
  let html = '<p class="texto-principal">' + p.texto + '</p>';
  html += '<div class="separador"></div>';
  if (p.secundario) {
    html += '<p class="texto-secundario">' + p.secundario + '</p>';
  }
  screenEl.innerHTML = html;
  // Clase extra opcional para ajustar una pantalla en particular
  screenEl.className = p.clase || "";

  // Reiniciamos la animación de entrada del texto
  screenEl.classList.remove("entrando");
  void screenEl.offsetWidth;
  screenEl.classList.add("entrando");

    // Ilustraciones (si la pantalla tiene). Borramos las anteriores.
  document.querySelectorAll(".ilustracion").forEach(function (el) {
    el.remove();
  });

// Cancelamos cualquier secuencia anterior
  limpiarSecuencia();

  if (p.imagen) {
    agregarIlustracion(p.imagen, p.posicion, p.animacion);
  }
  if (p.imagen2) {
    agregarIlustracion(p.imagen2, p.posicion2, p.animacion2);
  }
  if (p.imagen3) {
    agregarIlustracion(p.imagen3, p.posicion3, p.animacion3);
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

   // Si es la pantalla del regalo, abrimos la escena especial
   // Limpiamos cualquier cuenta regresiva anterior del regalo
  if (temporizadorRegalo) {
    clearTimeout(temporizadorRegalo);
    temporizadorRegalo = null;
  }

  // Si es la pantalla del regalo, damos 4 segundos para leerla.
  // Si Karina toca el botón antes, el regalo se abre en ese momento.
  if (p.esRegalo) {
    temporizadorRegalo = setTimeout(mostrarRegalo, 4000);
  }
   // Si la pantalla tiene secuencia automática, la iniciamos
  if (p.secuencia === "compania") {
    iniciarSecuenciaCompania();
  }
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
  // En la pantalla del regalo, Continuar abre la escena al instante
  if (pantallas[actual].esRegalo) {
    if (temporizadorRegalo) {
      clearTimeout(temporizadorRegalo);
      temporizadorRegalo = null;
    }
    mostrarRegalo();
    return;
  }

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

// ===== ESCENA DE BIENVENIDA =====
// Texto de la pregunta. El día de la sorpresa cambias solo esta línea.
const PREGUNTA = "¡Oye!, ¿tú eres Karina?";

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

// ===== ARRANQUE =====
// Siempre dibujamos la pantalla 0 por detrás (la bienvenida la tapa).
mostrarPantalla(actual);

const progresoGuardado = leerProgreso();

if (progresoGuardado !== null && progresoGuardado > 0) {
  // Ya había avanzado: quitamos la bienvenida y preguntamos.
  bienvenidaEl.classList.add("oculta");
  clearInterval(intervaloPasos);

  mostrarReanudar(progresoGuardado, function (indice) {
    if (indice === null) {
      // Empezar de nuevo: recargamos para que corra la bienvenida completa.
      window.location.reload();
    } else {
      actual = indice;
      mostrarPantalla(actual);
      revisarAvisos();
    }
  });
}

// Revisamos la hora al abrir y luego cada 30 segundos mientras esté abierta.
revisarAvisos();
setInterval(revisarAvisos, 30000);