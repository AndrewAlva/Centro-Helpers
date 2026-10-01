// SOLUCIÓN DOCENTE, NO REPARTIR.
import * as THREE from 'three';
import { PALETA, RENDIMIENTO } from '../config.js';

/**
 * Esquema de cuatro luces, solo UNA proyecta sombras (las sombras son lo más caro de la escena):
 *  - hemisférica: relleno suave para que lo que queda en penumbra no se pierda
 *  - foco (SpotLight): luz principal desde arriba y al frente, la única con sombras
 *  - punto rosa: sale del letrero de neón y tiñe la pared
 *  - punto cian: contraluz frío desde la izquierda
 */
export function crearLuces(escena) {
  const hemisferica = new THREE.HemisphereLight(0x9aa7ff, 0x23232b, 0.55);

  const foco = new THREE.SpotLight(0xfff1dc, 120, 16, 0.8, 0.7, 2);
  foco.position.set(0.5, 3.7, 3.4);
  foco.target.position.set(0, 0.6, -0.2);
  foco.castShadow = true;
  foco.shadow.mapSize.set(RENDIMIENTO.sombra, RENDIMIENTO.sombra);
  // Encuadre ajustado: near/far lo más cerca posible de lo que hay en escena afina la precisión
  foco.shadow.camera.near = 1.5;
  foco.shadow.camera.far = 9;
  foco.shadow.bias = -0.0005; // evita "acné" (rayas) en superficies que reciben sombra
  foco.shadow.normalBias = 0.03;
  foco.shadow.radius = 4; // borde suave

  const neonRosa = new THREE.PointLight(PALETA.rosa, 14, 9, 2);
  neonRosa.position.set(0, 3.0, -1.2);

  const rellenoCian = new THREE.PointLight(PALETA.cian, 7, 9, 2);
  rellenoCian.position.set(-4.2, 1.2, 1.4);

  escena.add(hemisferica, foco, foco.target, neonRosa, rellenoCian);

  const intensidadBase = neonRosa.intensity;
  // Parpadeo del neón: oscilación lenta más un pulso rápido pequeño
  function actualizar(t) {
    neonRosa.intensity = intensidadBase * (0.9 + 0.1 * Math.sin(t * 2.2) + 0.03 * Math.sin(t * 17));
  }

  return { hemisferica, foco, neonRosa, rellenoCian, actualizar };
}
