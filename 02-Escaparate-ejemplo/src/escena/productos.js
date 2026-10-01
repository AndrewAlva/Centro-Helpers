// SOLUCIÓN DOCENTE, NO REPARTIR.
import * as THREE from 'three';
import { PALETA, PRODUCTOS } from '../config.js';
import { conRepeat } from './texturas.js';

/** Asigna sombras a todas las mallas de un grupo. `recibe` es false en materiales que ignoran la luz. */
function conSombras(obj, emite = true, recibe = true) {
  obj.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = emite;
      o.receiveShadow = recibe;
    }
  });
  return obj;
}

// ───────────────────────── 1 · Stickers → MeshBasicMaterial ─────────────────────────
function crearStickers() {
  const modelo = new THREE.Group();
  const colores = [PALETA.rosa, PALETA.cian, PALETA.amarillo, PALETA.blanco];
  const abanico = [
    [-0.46, 0.4, 0.0, 0.25],
    [-0.15, 0.48, 0.04, -0.1],
    [0.16, 0.46, 0.08, 0.12],
    [0.47, 0.38, 0.12, -0.26],
  ]; // x, y, z, inclinación

  const geoDisco = new THREE.CylinderGeometry(0.3, 0.3, 0.012, 40);
  const geoCentro = new THREE.CylinderGeometry(0.16, 0.16, 0.012, 40);
  const matCentro = new THREE.MeshBasicMaterial({ color: PALETA.tinta });

  colores.forEach((color, i) => {
    const [x, y, z, inclinacion] = abanico[i];
    const pivote = new THREE.Group();
    pivote.position.set(x, y, z);
    pivote.rotation.z = inclinacion;

    const cara = new THREE.Group();
    cara.rotation.x = Math.PI / 2; // el cilindro mira hacia la cámara
    const disco = new THREE.Mesh(geoDisco, new THREE.MeshBasicMaterial({ color }));
    const centro = new THREE.Mesh(geoCentro, matCentro);
    centro.position.y = 0.004;
    cara.add(disco, centro);
    pivote.add(cara);
    modelo.add(pivote);
  });

  // Basic no recibe luz ni sombra, pero sí puede proyectarla sobre el pedestal
  conSombras(modelo, true, false);

  function actualizar(t) {
    modelo.position.y = 0.05 * Math.sin(t * 1.6); // flota
    modelo.rotation.y = 0.18 * Math.sin(t * 0.8); // se asoma de un lado a otro
  }
  return { modelo, actualizar };
}

// ───────────────────────── 2 · Rodamientos → MeshMatcapMaterial ─────────────────────────
function crearRodamientos(texturas) {
  const material = new THREE.MeshMatcapMaterial({ matcap: texturas.matcap, side: THREE.DoubleSide });

  // Aro por revolución de un perfil cerrado (radio interior, radio exterior, alto)
  const aro = (rInt, rExt, alto) =>
    new THREE.LatheGeometry(
      [
        new THREE.Vector2(rInt, -alto / 2),
        new THREE.Vector2(rExt, -alto / 2),
        new THREE.Vector2(rExt, alto / 2),
        new THREE.Vector2(rInt, alto / 2),
        new THREE.Vector2(rInt, -alto / 2),
      ],
      48,
    );

  const rodamiento = new THREE.Group();
  rodamiento.add(new THREE.Mesh(aro(0.13, 0.2, 0.07), material)); // pista exterior
  rodamiento.add(new THREE.Mesh(aro(0.06, 0.1, 0.07), material)); // pista interior

  const geoBalin = new THREE.SphereGeometry(0.0155, 16, 12);
  const balines = 8;
  for (let i = 0; i < balines; i++) {
    const angulo = (i / balines) * Math.PI * 2;
    const balin = new THREE.Mesh(geoBalin, material);
    balin.position.set(Math.cos(angulo) * 0.115, 0, Math.sin(angulo) * 0.115);
    rodamiento.add(balin);
  }
  rodamiento.scale.setScalar(2.6); // tamaño de vitrina

  const inclinado = new THREE.Group();
  inclinado.position.y = 0.55;
  inclinado.rotation.x = 1.0; // recostado hacia la cámara
  inclinado.add(rodamiento);

  const modelo = new THREE.Group();
  modelo.add(inclinado);
  conSombras(modelo, true, false); // matcap: el sombreado ya está en la textura

  function actualizar(t, dt) {
    rodamiento.rotation.y += dt * 0.9; // giro lineal sobre su propio eje
    inclinado.rotation.z = 0.18 * Math.sin(t * 0.9); // cabeceo oscilatorio
  }
  return { modelo, actualizar };
}

// ───────────────────────── 3 · Skateboard → MeshStandardMaterial (GLB importado) ─────────────────────────
function crearSkate(gltf) {
  const tabla = gltf.scene;
  tabla.scale.setScalar(2.2); // el GLB mide 0.81 m de largo: lo agrandamos para la vitrina

  // Recorremos las mallas del modelo: sombras y búsqueda de ruedas por nombre
  const ruedas = [];
  tabla.traverse((o) => {
    if (!o.isMesh) return;
    o.castShadow = true;
    o.receiveShadow = true;
    if (o.name.startsWith('Wheel')) ruedas.push(o);
  });

  // Jerarquía: modelo (flota) > inclinado (se recuesta) > giro (plato giratorio) > tabla (rueda sobre su eje largo)
  const giro = new THREE.Group();
  giro.add(tabla);

  const inclinado = new THREE.Group();
  inclinado.rotation.set(0.25, 0, 0.12);
  inclinado.add(giro);

  const modelo = new THREE.Group();
  modelo.add(inclinado);

  function actualizar(t, dt) {
    giro.rotation.y += dt * 0.35; // plato giratorio (lineal)
    tabla.rotation.x += dt * 0.5; // rueda sobre su eje largo: muestra el gráfico y la lija
    modelo.position.y = 0.55 + 0.04 * Math.sin(t * 1.3); // flota (oscilatorio)
    for (const rueda of ruedas) rueda.rotation.z -= dt * 6; // las ruedas ruedan
  }
  return { modelo, actualizar };
}

// ───────────────────────── 4 · Ruedas → MeshPhongMaterial ─────────────────────────
function crearRuedas() {
  const uretano = new THREE.MeshPhongMaterial({
    color: PALETA.amarillo,
    specular: 0x999999,
    shininess: 90,
    side: THREE.DoubleSide,
  });
  const nucleo = new THREE.MeshPhongMaterial({
    color: 0xf3efe6,
    specular: 0x333333,
    shininess: 25,
    side: THREE.DoubleSide,
  });

  const v = (x, y) => new THREE.Vector2(x, y);
  const perfilUretano = [
    v(0.16, -0.09), v(0.23, -0.09), v(0.26, -0.07), v(0.27, -0.04), v(0.27, 0.04),
    v(0.26, 0.07), v(0.23, 0.09), v(0.16, 0.09), v(0.16, -0.09),
  ];
  const perfilNucleo = [v(0.06, -0.085), v(0.16, -0.085), v(0.16, 0.085), v(0.06, 0.085), v(0.06, -0.085)];
  const geoUretano = new THREE.LatheGeometry(perfilUretano, 48);
  const geoNucleo = new THREE.LatheGeometry(perfilNucleo, 48);

  const modelo = new THREE.Group();
  const giros = [];
  const posiciones = [
    [-0.42, 0.5], // x, giro en Y (para verlas de tres cuartos)
    [0.42, -0.45],
  ];
  for (const [x, yaw] of posiciones) {
    const pivote = new THREE.Group();
    pivote.position.set(x, 0.44, 0);
    pivote.rotation.y = yaw;
    pivote.scale.setScalar(1.6);

    const orientacion = new THREE.Group();
    orientacion.rotation.x = Math.PI / 2; // el eje de la rueda apunta hacia la cámara

    const giro = new THREE.Group();
    giro.add(new THREE.Mesh(geoUretano, uretano), new THREE.Mesh(geoNucleo, nucleo));
    orientacion.add(giro);
    pivote.add(orientacion);
    modelo.add(pivote);
    giros.push(giro);
  }
  conSombras(modelo, true, true);

  function actualizar(t, dt) {
    giros[0].rotation.y += dt * 1.6; // giro lineal, cada rueda a su ritmo
    giros[1].rotation.y -= dt * 1.1;
    modelo.position.y = 0.03 * Math.sin(t * 1.4 + 1);
  }
  return { modelo, actualizar };
}

// ───────────────────────── 5 · Conos → MeshToonMaterial ─────────────────────────
function crearConos(gradientMap) {
  const naranja = new THREE.MeshToonMaterial({ color: PALETA.naranja, gradientMap });
  const blanco = new THREE.MeshToonMaterial({ color: PALETA.blanco, gradientMap });
  const base = new THREE.MeshToonMaterial({ color: 0xd4500f, gradientMap });

  const alturaCono = 0.6;
  const radioCono = 0.22;
  const grosorBase = 0.04;
  // Radio del cono a una altura dada medida desde su base: la franja blanca debe seguir esa pendiente
  const radioA = (y) => (radioCono * (alturaCono - y)) / alturaCono;

  const geoCono = new THREE.ConeGeometry(radioCono, alturaCono, 32);
  const geoBase = new THREE.BoxGeometry(0.5, grosorBase, 0.5);
  const geoFranja = new THREE.CylinderGeometry(radioA(0.32) + 0.004, radioA(0.22) + 0.004, 0.1, 32, 1, true);

  const crearCono = () => {
    const cono = new THREE.Group(); // el origen está en el centro de la base: el cono se mece desde ahí
    const placa = new THREE.Mesh(geoBase, base);
    placa.position.y = grosorBase / 2;
    const cuerpo = new THREE.Mesh(geoCono, naranja);
    cuerpo.position.y = grosorBase + alturaCono / 2;
    const franja = new THREE.Mesh(geoFranja, blanco);
    franja.position.y = grosorBase + 0.27;
    cono.add(placa, cuerpo, franja);
    return cono;
  };

  const modelo = new THREE.Group();
  const conos = [];
  const disposicion = [
    [-0.44, 0.12, 1.0],
    [0.0, -0.2, 0.85],
    [0.44, 0.12, 1.0],
  ]; // x, z, escala
  for (const [x, z, escala] of disposicion) {
    const cono = crearCono();
    cono.position.set(x, 0, z);
    cono.scale.setScalar(escala);
    conos.push(cono);
    modelo.add(cono);
  }
  conSombras(modelo, true, true);

  function actualizar(t) {
    conos.forEach((cono, i) => {
      cono.rotation.z = 0.07 * Math.sin(t * 2 + i * 1.7); // se mecen como si los rozaran
      cono.rotation.x = 0.05 * Math.cos(t * 1.6 + i);
    });
  }
  return { modelo, actualizar };
}

// ───────────────────────── Ensamble ─────────────────────────
function crearPedestal(datos, texturas) {
  const ancho = datos.ancho ?? 1.1;
  const pedestal = new THREE.Mesh(
    new THREE.BoxGeometry(ancho, datos.alturaBase, ancho),
    new THREE.MeshStandardMaterial({ map: conRepeat(texturas.madera, 1.2, datos.alturaBase * 1.4), roughness: 0.75 }),
  );
  pedestal.position.set(datos.x, datos.alturaBase / 2, 0);
  pedestal.castShadow = true;
  pedestal.receiveShadow = true;
  return pedestal;
}

/**
 * Zona de click: una caja invisible que envuelve al producto.
 * Sin ella, el raycaster solo acierta sobre la geometría real y falla en huecos
 * (el centro de un rodamiento, el espacio entre conos). No se dibuja, pero el raycaster sí la ve.
 */
function agregarZonaDeClick(raiz) {
  raiz.updateWorldMatrix(true, true);
  const caja = new THREE.Box3().setFromObject(raiz);
  const tamano = caja.getSize(new THREE.Vector3());
  const centro = caja.getCenter(new THREE.Vector3());

  const zona = new THREE.Mesh(new THREE.BoxGeometry(tamano.x, tamano.y, tamano.z), new THREE.MeshBasicMaterial());
  zona.position.copy(centro).sub(raiz.position); // de coordenadas del mundo a las de la raíz
  zona.visible = false;
  raiz.add(zona);
}

/**
 * Recorre el arreglo PRODUCTOS y arma cada uno: pedestal + modelo animado.
 * Cada producto queda como objeto: { datos, raiz, pedestal, actualizar }.
 * La `raiz` es lo que escucha el raycaster y lo que se escala al pasar el mouse.
 */
export function crearProductos(recursos) {
  const { texturas, gltf, gradientMap } = recursos;
  const constructores = {
    stickers: () => crearStickers(),
    rodamientos: () => crearRodamientos(texturas),
    skate: () => crearSkate(gltf),
    ruedas: () => crearRuedas(),
    conos: () => crearConos(gradientMap),
  };

  return PRODUCTOS.map((datos) => {
    const { modelo, actualizar } = constructores[datos.modelo]();

    const raiz = new THREE.Group();
    raiz.position.set(datos.x, datos.alturaBase, 0);
    raiz.userData.productoId = datos.id; // así el raycaster sabe a quién pertenece cada malla
    raiz.add(modelo);
    agregarZonaDeClick(raiz);

    return { datos, raiz, pedestal: crearPedestal(datos, texturas), actualizar };
  });
}
