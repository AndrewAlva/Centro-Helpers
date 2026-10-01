// SOLUCIÓN DOCENTE, NO REPARTIR.
import * as THREE from 'three';
import gsap from 'gsap';

/**
 * La cámara no se anima directamente: se anima un par de vectores (`pos` y `look`) con GSAP
 * y en cada frame la cámara los sigue. Así un tween nuevo puede interrumpir al anterior
 * sin que se acumulen ni haya saltos.
 */
export function crearRigCamara(camera, { reducirMovimiento = false, alMoverse = () => {} } = {}) {
  const pos = new THREE.Vector3();
  const look = new THREE.Vector3(0, 1.5, 0);
  const parallax = new THREE.Vector2();
  const objetivoParallax = new THREE.Vector2();
  const tmpDestino = new THREE.Vector3();
  const tmpMirada = new THREE.Vector3();

  let productoActual = null; // null = vista general

  // Distancia que permite ver todo el escaparate; en pantallas angostas hay que alejarse más
  function vistaGeneral(aspecto, salida) {
    const tanMitad = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const z = THREE.MathUtils.clamp(5.9 / (tanMitad * aspecto), 8.5, 22) + 2;
    return salida.set(0, 1.95, z);
  }

  function moverA(destino, mirada, duracion, ease = 'power3.inOut') {
    gsap.killTweensOf([pos, look]); // un tween nuevo reemplaza al anterior
    const d = reducirMovimiento ? 0 : duracion;
    if (d === 0) {
      pos.copy(destino);
      look.copy(mirada);
      alMoverse();
      return;
    }
    gsap.to(pos, { x: destino.x, y: destino.y, z: destino.z, duration: d, ease, onUpdate: alMoverse });
    gsap.to(look, { x: mirada.x, y: mirada.y, z: mirada.z, duration: d, ease });
  }

  function destinoProducto(producto, aspecto) {
    const { distancia, altura } = producto.datos.enfoque;
    const extra = Math.max(1, 1.15 / aspecto); // en vertical, más lejos
    const lado = aspecto > 1.3 ? 0.65 : 0; // en horizontal, el producto queda a la izquierda y el panel a la derecha
    const base = producto.raiz.position;
    tmpDestino.set(base.x + lado, base.y + altura, base.z + distancia * extra);
    // En vertical el panel ocupa la parte baja: mirar más abajo sube el producto en el cuadro
    const subir = aspecto < 1 ? 1.4 : 0;
    tmpMirada.set(base.x + lado, base.y + 0.4 - subir, base.z);
  }

  return {
    pos,
    look,

    /** Coloca la cámara de inicio y hace la entrada. */
    entrada(aspecto) {
      vistaGeneral(aspecto, tmpDestino);
      pos.set(tmpDestino.x, tmpDestino.y + 1.4, tmpDestino.z + 6);
      tmpMirada.set(0, 1.5, 0);
      look.copy(tmpMirada);
      moverA(tmpDestino, tmpMirada, 2.4, 'power2.out');
    },

    enfocar(producto, aspecto) {
      productoActual = producto;
      destinoProducto(producto, aspecto);
      moverA(tmpDestino, tmpMirada, 1.1);
    },

    volver(aspecto) {
      productoActual = null;
      vistaGeneral(aspecto, tmpDestino);
      tmpMirada.set(0, 1.5, 0);
      moverA(tmpDestino, tmpMirada, 1.0);
    },

    /** Reencuadra sin animación cuando cambia el tamaño de la ventana. */
    reencuadrar(aspecto) {
      if (productoActual) destinoProducto(productoActual, aspecto);
      else {
        vistaGeneral(aspecto, tmpDestino);
        tmpMirada.set(0, 1.5, 0);
      }
      moverA(tmpDestino, tmpMirada, 0);
    },

    /** Posición normalizada del puntero (-1..1) para el paralaje. */
    puntero(x, y) {
      objetivoParallax.set(x, y);
    },

    /** Se llama una vez por frame. */
    actualizar(dt) {
      const amplitud = reducirMovimiento ? 0 : productoActual ? 0.12 : 0.5;
      parallax.lerp(objetivoParallax, 1 - Math.exp(-dt * 3)); // suavizado independiente del framerate
      camera.position.set(pos.x + parallax.x * amplitud, pos.y + parallax.y * amplitud * 0.6, pos.z);
      camera.lookAt(look);
    },
  };
}
