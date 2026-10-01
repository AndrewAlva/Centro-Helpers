// SOLUCIÓN DOCENTE, NO REPARTIR.

/**
 * Atajos de teclado. Un solo listener con un switch, y se puede quitar con `destruir()`.
 *   ← →      recorrer productos
 *   1 a N    ir directo a un producto
 *   Esc / 0  volver a la vista general
 *   F        mostrar u ocultar los fps
 */
export function crearTeclado({ cantidad, alRecorrer, alElegir, alVolver, alAlternarFps }) {
  function alTeclear(e) {
    if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        alRecorrer(1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        alRecorrer(-1);
        break;
      case 'Escape':
      case '0':
        alVolver();
        break;
      case 'f':
      case 'F':
        alAlternarFps();
        break;
      default: {
        const numero = Number(e.key);
        if (Number.isInteger(numero) && numero >= 1 && numero <= cantidad) alElegir(numero - 1);
      }
    }
  }

  window.addEventListener('keydown', alTeclear);
  return {
    destruir() {
      window.removeEventListener('keydown', alTeclear);
    },
  };
}
