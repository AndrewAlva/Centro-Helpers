// SOLUCIÓN DOCENTE, NO REPARTIR.
import * as THREE from 'three';

const ruta = (p) => `${import.meta.env.BASE_URL}${p}`;

/**
 * Carga todas las texturas en paralelo y las deja listas.
 * - Las texturas de color van en sRGB; si no, se ven lavadas.
 * - Concreto y madera repiten (RepeatWrapping) porque son tileables.
 */
export async function cargarTexturas(manager, renderer) {
  const cargador = new THREE.TextureLoader(manager);
  const anisotropia = Math.min(4, renderer.capabilities.getMaxAnisotropy());

  const archivos = {
    concreto: 'textures/concrete.jpg',
    madera: 'textures/wood.jpg',
    deckA: 'textures/deck-a.png',
    deckB: 'textures/deck-b.png',
    deckC: 'textures/deck-c.png',
    matcap: 'textures/matcap-chrome.png',
  };

  const nombres = Object.keys(archivos);
  const texturas = await Promise.all(nombres.map((n) => cargador.loadAsync(ruta(archivos[n]))));

  const resultado = {};
  nombres.forEach((nombre, i) => {
    const t = texturas[i];
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = anisotropia;
    resultado[nombre] = t;
  });

  for (const nombre of ['concreto', 'madera']) {
    resultado[nombre].wrapS = resultado[nombre].wrapT = THREE.RepeatWrapping;
  }
  return resultado;
}

/**
 * Copia una textura con otro `repeat`. Comparte la imagen (no se sube dos veces a la GPU),
 * pero cada copia puede repetirse distinto según el tamaño de la superficie.
 */
export function conRepeat(textura, x, y) {
  const copia = textura.clone();
  copia.repeat.set(x, y);
  copia.needsUpdate = true;
  return copia;
}

/**
 * Rampa de N escalones para MeshToonMaterial. NearestFilter evita que los escalones se difuminen.
 */
export function crearGradientMap(escalones = 4) {
  const datos = new Uint8Array(escalones);
  for (let i = 0; i < escalones; i++) {
    datos[i] = Math.round(80 + (175 * i) / (escalones - 1));
  }
  const textura = new THREE.DataTexture(datos, escalones, 1, THREE.RedFormat);
  textura.minFilter = textura.magFilter = THREE.NearestFilter;
  textura.generateMipmaps = false;
  textura.needsUpdate = true;
  return textura;
}
