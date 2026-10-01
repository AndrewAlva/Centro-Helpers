// SOLUCIÓN DOCENTE, NO REPARTIR.
import * as THREE from 'three';
import { DECKS_PARED, PALETA, SALA } from '../config.js';
import { conRepeat } from './texturas.js';

/**
 * Deck plano para colgar en la pared: rectángulo con extremos redondos, extruido 2 cm.
 * ExtrudeGeometry no trae UV útiles, así que los calculamos nosotros (función propia):
 * u corre a lo largo del deck (eje vertical) y v a lo ancho.
 */
export function crearDeckPlano(ancho, alto, textura) {
  const r = ancho / 2;
  const forma = new THREE.Shape();
  forma.moveTo(-r, -alto / 2 + r);
  forma.lineTo(-r, alto / 2 - r);
  forma.absarc(0, alto / 2 - r, r, Math.PI, 0, true);
  forma.lineTo(r, -alto / 2 + r);
  forma.absarc(0, -alto / 2 + r, r, 0, Math.PI, true);

  const geometria = new THREE.ExtrudeGeometry(forma, { depth: 0.02, bevelEnabled: false, curveSegments: 20 });
  const pos = geometria.attributes.position;
  const uv = geometria.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, pos.getY(i) / alto + 0.5, pos.getX(i) / ancho + 0.5);
  }
  uv.needsUpdate = true;

  const material = new THREE.MeshStandardMaterial({ map: textura, roughness: 0.55, metalness: 0 });
  return new THREE.Mesh(geometria, material);
}

export function crearEntorno(texturas) {
  const grupo = new THREE.Group();
  const { ancho, alto, fondo } = SALA;
  const zFondo = -fondo / 2;
  const zFrente = fondo / 2;

  // ── Piso: se extiende hasta la banqueta para que la cámara no vea el borde ──
  const piso = new THREE.Mesh(
    new THREE.PlaneGeometry(14, 10),
    new THREE.MeshStandardMaterial({ map: conRepeat(texturas.concreto, 7, 5), roughness: 0.92, metalness: 0 }),
  );
  piso.rotation.x = -Math.PI / 2;
  piso.position.set(0, 0, 2);
  piso.receiveShadow = true;

  // ── Pared trasera y paredes laterales ──
  const materialPared = new THREE.MeshStandardMaterial({
    map: conRepeat(texturas.concreto, 5, 2),
    color: 0xb4b4c2,
    roughness: 0.95,
  });
  const paredTrasera = new THREE.Mesh(new THREE.PlaneGeometry(ancho, alto), materialPared);
  paredTrasera.position.set(0, alto / 2, zFondo);
  paredTrasera.receiveShadow = true;

  const materialLateral = new THREE.MeshStandardMaterial({
    map: conRepeat(texturas.concreto, 2, 2),
    color: 0x8f8fa0,
    roughness: 0.95,
  });
  const laterales = [-1, 1].map((lado) => {
    const p = new THREE.Mesh(new THREE.PlaneGeometry(fondo, alto), materialLateral);
    p.position.set((lado * ancho) / 2, alto / 2, 0);
    p.rotation.y = -lado * (Math.PI / 2);
    p.receiveShadow = true;
    return p;
  });

  const techo = new THREE.Mesh(
    new THREE.PlaneGeometry(ancho, fondo),
    new THREE.MeshStandardMaterial({ color: 0x1b1b21, roughness: 1 }),
  );
  techo.rotation.x = Math.PI / 2;
  techo.position.set(0, alto, 0);

  // ── Marco de la vitrina (mismo material para las cuatro piezas) ──
  const materialMarco = new THREE.MeshStandardMaterial({ color: 0x101014, metalness: 0.6, roughness: 0.4 });
  const piezasMarco = [
    [0.305, alto + 0.305, 0.4, -ancho / 2 - 0.15, alto / 2 + 0.15, zFrente],
    [0.305, alto + 0.305, 0.4, ancho / 2 + 0.15, alto / 2 + 0.15, zFrente],
    [ancho + 0.05, 0.305, 0.4, 0, alto + 0.15, zFrente],
    [ancho + 0.05, 0.12, 0.45, 0, 0.06, zFrente + 0.02],
  ];
  for (const [w, h, d, x, y, z] of piezasMarco) {
    const pieza = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), materialMarco);
    pieza.position.set(x, y, z);
    grupo.add(pieza);
  }

  // ── Letrero de neón: MeshBasicMaterial, no le afectan las luces ──
  const neon = new THREE.Group();
  neon.position.set(0, 3.05, zFondo + 0.06);
  const anilloRosa = new THREE.Mesh(
    new THREE.TorusGeometry(0.6, 0.028, 12, 64),
    new THREE.MeshBasicMaterial({ color: PALETA.rosa }),
  );
  const anilloCian = new THREE.Mesh(
    new THREE.TorusGeometry(0.44, 0.028, 12, 64),
    new THREE.MeshBasicMaterial({ color: PALETA.cian }),
  );
  neon.add(anilloRosa, anilloCian);

  // ── Decks de la pared: se recorre el arreglo DECKS_PARED ──
  const decks = [];
  for (const [x, y, inclinacion, clave] of DECKS_PARED) {
    const deck = crearDeckPlano(0.3, 1.2, texturas[clave]);
    deck.position.set(x, y, zFondo + 0.01);
    deck.rotation.z = inclinacion;
    deck.userData.inclinacionBase = inclinacion;
    deck.castShadow = true; // sombra sobre la pared: da profundidad
    decks.push(deck);
    grupo.add(deck);
  }

  grupo.add(piso, paredTrasera, ...laterales, techo, neon);

  // Loop de animación del entorno: oscilaciones con sin y cos
  function actualizar(t) {
    neon.scale.setScalar(1 + 0.018 * Math.cos(t * 2.2));
    decks.forEach((deck, i) => {
      deck.rotation.z = deck.userData.inclinacionBase + 0.014 * Math.sin(t * 0.9 + i * 1.3);
    });
  }

  return { grupo, neon, actualizar };
}
