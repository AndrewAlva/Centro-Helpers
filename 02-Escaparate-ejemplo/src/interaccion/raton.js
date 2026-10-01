// SOLUCIÓN DOCENTE, NO REPARTIR.
import * as THREE from 'three';

/**
 * Raycaster sobre los productos.
 *  - Solo se le pasan las raíces de los productos (no el piso, las paredes ni los pedestales):
 *    lanzar rayos contra menos objetos es más barato y evita falsos positivos.
 *  - pointermove solo marca "sucio"; el rayo se lanza una vez por frame en `revisar()`,
 *    no una vez por cada evento (un mouse puede disparar cientos por segundo).
 */
export function crearRaton({ canvas, camera, productos, alHover, alClick, alMoverPuntero }) {
  const raycaster = new THREE.Raycaster();
  const puntero = new THREE.Vector2();
  const raices = productos.map((p) => p.raiz);
  let dentro = false;
  let sucio = false;

  // Coordenadas normalizadas (-1..1) relativas al canvas, con Y invertida
  function leerPuntero(e) {
    const r = canvas.getBoundingClientRect();
    puntero.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    puntero.y = -((e.clientY - r.top) / r.height) * 2 + 1;
  }

  // Devuelve el id del producto bajo el puntero (o null). Sube por la jerarquía hasta la raíz.
  function productoBajoPuntero() {
    raycaster.setFromCamera(puntero, camera);
    const impactos = raycaster.intersectObjects(raices, true);
    if (impactos.length === 0) return null;
    let objeto = impactos[0].object;
    while (objeto && !objeto.userData.productoId) objeto = objeto.parent;
    return objeto ? objeto.userData.productoId : null;
  }

  const alMover = (e) => {
    leerPuntero(e);
    dentro = true;
    sucio = true;
    alMoverPuntero(puntero.x, puntero.y, e);
  };
  const alSalir = () => {
    dentro = false;
    alHover(null);
  };
  const alPulsar = (e) => {
    leerPuntero(e); // en táctil no hubo pointermove previo
    alClick(productoBajoPuntero());
  };

  canvas.addEventListener('pointermove', alMover);
  canvas.addEventListener('pointerleave', alSalir);
  canvas.addEventListener('click', alPulsar);

  return {
    /** La cámara se movió bajo un puntero quieto: hay que volver a revisar. */
    marcarSucio() {
      sucio = true;
    },
    /** Llamar una vez por frame. */
    revisar() {
      if (!sucio || !dentro) return;
      sucio = false;
      alHover(productoBajoPuntero());
    },
    destruir() {
      canvas.removeEventListener('pointermove', alMover);
      canvas.removeEventListener('pointerleave', alSalir);
      canvas.removeEventListener('click', alPulsar);
    },
  };
}
