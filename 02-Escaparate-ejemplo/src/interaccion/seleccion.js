// SOLUCIÓN DOCENTE, NO REPARTIR.
import gsap from 'gsap';

const ESCALA_HOVER = 1.12;
const ESCALA_SELECCIONADO = 1.05;

/**
 * Un solo lugar decide qué producto está en hover o seleccionado.
 * El mouse y el teclado llaman las mismas funciones, así no hay dos versiones de la lógica.
 */
export function crearSeleccion({ productos, camara, ui, canvas, aspecto }) {
  const porId = new Map(productos.map((p) => [p.datos.id, p]));
  const estado = { hover: null, seleccionado: null };

  function escalaObjetivo(producto) {
    const id = producto.datos.id;
    if (estado.hover === id) return ESCALA_HOVER;
    if (estado.seleccionado === id) return ESCALA_SELECCIONADO;
    return 1;
  }

  // overwrite: 'auto' cancela el tween anterior sobre la misma propiedad: los tweens no se apilan
  function aplicarEscala(producto) {
    const s = escalaObjetivo(producto);
    gsap.to(producto.raiz.scale, { x: s, y: s, z: s, duration: 0.35, ease: 'back.out(2.2)', overwrite: 'auto' });
  }

  function hover(id) {
    if (id === estado.hover) return;
    const anterior = estado.hover;
    estado.hover = id;
    if (anterior) aplicarEscala(porId.get(anterior));
    if (id) aplicarEscala(porId.get(id));
    // La etiqueta sobra si el producto ya está abierto en el panel
    if (id && id !== estado.seleccionado) ui.mostrarEtiqueta(porId.get(id).datos.nombre);
    else ui.ocultarEtiqueta();
    canvas.style.cursor = id ? 'pointer' : 'default';
  }

  function seleccionar(id) {
    const producto = porId.get(id);
    if (!producto) return;
    const anterior = estado.seleccionado;
    estado.seleccionado = id;
    ui.ocultarEtiqueta();
    camara.enfocar(producto, aspecto());
    ui.abrirPanel(producto.datos);
    if (anterior && anterior !== id) aplicarEscala(porId.get(anterior));
    aplicarEscala(producto);
  }

  function volver() {
    const anterior = estado.seleccionado;
    if (!anterior) return;
    estado.seleccionado = null;
    camara.volver(aspecto());
    ui.cerrarPanel();
    aplicarEscala(porId.get(anterior));
  }

  // Desde la vista general, → va al primero y ← al último
  function recorrer(paso) {
    const ids = productos.map((p) => p.datos.id);
    const actual = ids.indexOf(estado.seleccionado);
    const siguiente = actual === -1 ? (paso > 0 ? 0 : ids.length - 1) : (actual + paso + ids.length) % ids.length;
    seleccionar(ids[siguiente]);
  }

  return {
    hover,
    seleccionar,
    volver,
    recorrer,
    seleccionarPorIndice: (i) => seleccionar(productos[i].datos.id),
    // Click sobre un producto lo selecciona; click en el vacío vuelve a la vista general
    alClick: (id) => (id ? seleccionar(id) : volver()),
    estado,
  };
}
