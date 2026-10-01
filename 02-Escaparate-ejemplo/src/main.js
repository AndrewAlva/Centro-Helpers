// SOLUCIÓN DOCENTE, NO REPARTIR.
// Escaparate 3D de una tienda de skateboarding · Bloque I · CC325-21
//
// Recorrido del archivo:
//   1. renderer, escena y cámara
//   2. carga de recursos (texturas + modelo GLB) con barra de progreso
//   3. armado de la escena a partir de los datos de config.js
//   4. interacción (mouse, teclado, cámara)
//   5. loop de animación con requestAnimationFrame
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

import { RENDIMIENTO } from './config.js';
import { crearUI } from './ui.js';
import { cargarTexturas, crearGradientMap } from './escena/texturas.js';
import { crearEntorno } from './escena/entorno.js';
import { crearLuces } from './escena/luces.js';
import { crearProductos } from './escena/productos.js';
import { crearRigCamara } from './interaccion/camara.js';
import { crearSeleccion } from './interaccion/seleccion.js';
import { crearRaton } from './interaccion/raton.js';
import { crearTeclado } from './interaccion/teclado.js';

const ui = crearUI();
const canvas = document.getElementById('escena');
const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const aspecto = () => window.innerWidth / window.innerHeight;

function webglDisponible() {
  try {
    return !!document.createElement('canvas').getContext('webgl2');
  } catch {
    return false;
  }
}

async function iniciar() {
  if (!webglDisponible()) {
    ui.mostrarError('Tu navegador no puede mostrar gráficos 3D (WebGL 2). Prueba con Chrome, Edge, Firefox o Safari actualizados.');
    return;
  }

  // ── 1 · Renderer, escena y cámara ──
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, RENDIMIENTO.pixelRatioMax));
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.shadowMap.enabled = true; // sin esto, castShadow no hace nada
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.NeutralToneMapping; // conserva los colores del neón

  const escena = new THREE.Scene();
  escena.background = new THREE.Color(0x0e0e12);

  // Sin entorno, los metales (trucks) se ven casi negros porque no tienen qué reflejar
  const pmrem = new THREE.PMREMGenerator(renderer);
  escena.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  escena.environmentIntensity = 0.35;
  pmrem.dispose();

  const camera = new THREE.PerspectiveCamera(40, aspecto(), 0.1, 60);

  // ── 2 · Carga de recursos ──
  const manager = new THREE.LoadingManager();
  manager.onProgress = (_url, cargados, total) => ui.progreso(cargados / total);
  manager.onError = (url) => console.error(`No se pudo cargar: ${url}`);

  let texturas;
  let gltf;
  try {
    [texturas, gltf] = await Promise.all([
      cargarTexturas(manager, renderer),
      new GLTFLoader(manager).loadAsync(`${import.meta.env.BASE_URL}models/skateboard.glb`),
    ]);
  } catch (error) {
    console.error(error);
    ui.mostrarError('No se pudo cargar la tienda. Revisa tu conexión y recarga la página.');
    return;
  }

  // ── 3 · Armado de la escena ──
  const entorno = crearEntorno(texturas);
  const luces = crearLuces(escena);
  const productos = crearProductos({ texturas, gltf, gradientMap: crearGradientMap(4) });

  escena.add(entorno.grupo);
  for (const producto of productos) escena.add(producto.pedestal, producto.raiz);

  // ── 4 · Interacción ──
  let raton;
  const rig = crearRigCamara(camera, { reducirMovimiento, alMoverse: () => raton.marcarSucio() });
  const seleccion = crearSeleccion({ productos, camara: rig, ui, canvas, aspecto });

  raton = crearRaton({
    canvas,
    camera,
    productos,
    alHover: seleccion.hover,
    alClick: seleccion.alClick,
    alMoverPuntero: (nx, ny, evento) => {
      rig.puntero(nx, ny);
      ui.moverEtiqueta(evento.clientX, evento.clientY);
    },
  });

  const teclado = crearTeclado({
    cantidad: productos.length,
    alRecorrer: seleccion.recorrer,
    alElegir: seleccion.seleccionarPorIndice,
    alVolver: seleccion.volver,
    alAlternarFps: ui.alternarFps,
  });
  ui.alCerrarPanel(seleccion.volver);

  function ajustarTamano() {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, RENDIMIENTO.pixelRatioMax));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    camera.aspect = aspecto();
    camera.updateProjectionMatrix();
    rig.reencuadrar(aspecto());
  }
  window.addEventListener('resize', ajustarTamano);

  // Compilar los shaders antes de mostrar la tienda evita un tirón en el primer frame
  rig.entrada(aspecto());
  rig.actualizar(0);
  await renderer.compileAsync(escena, camera);
  ui.ocultarCarga();

  // ── 5 · Loop de animación ──
  const ritmo = reducirMovimiento ? 0.25 : 1;
  let tiempo = 0; // segundos de animación acumulados
  let previo = performance.now();
  let frameId = 0;

  function tick(ahora) {
    frameId = requestAnimationFrame(tick);

    // delta time: lo que cambia por frame depende del tiempo transcurrido, no de la velocidad del equipo
    const real = (ahora - previo) / 1000; // tiempo real del frame: es el que mide el contador de fps
    const dt = Math.min(real, 0.05); // tope para la animación: evita un salto al volver de otra pestaña
    previo = ahora;
    tiempo += dt * ritmo;

    for (const producto of productos) producto.actualizar(tiempo, dt * ritmo);
    entorno.actualizar(tiempo);
    luces.actualizar(tiempo);
    rig.actualizar(dt);
    raton.revisar();
    ui.medirFrame(real);

    renderer.render(escena, camera);
  }
  frameId = requestAnimationFrame(tick);

  // Limpieza cuando Vite recarga el módulo en desarrollo: sin esto se acumulan loops y listeners
  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', ajustarTamano);
      raton.destruir();
      teclado.destruir();
      renderer.dispose();
    });
  }
}

iniciar();
