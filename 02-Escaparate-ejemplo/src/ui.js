// SOLUCIÓN DOCENTE, NO REPARTIR.
// Todo lo que toca el DOM vive aquí, para que main.js solo hable con la escena.

const formatoPrecio = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });

export function crearUI() {
  const $ = (id) => document.getElementById(id);
  const cargando = $('cargando');
  const barra = $('barra-progreso');
  const etiqueta = $('etiqueta');
  const panel = $('panel');
  const fps = $('fps');
  const error = $('error');

  // Medición de fps: se promedia sobre medio segundo para que el número no parpadee
  let acumuladoTiempo = 0;
  let acumuladoFrames = 0;
  let peorFrame = 0;

  return {
    progreso(fraccion) {
      barra.style.width = `${Math.round(fraccion * 100)}%`;
    },
    ocultarCarga() {
      cargando.classList.add('listo');
    },
    mostrarError(mensaje) {
      cargando.classList.add('listo');
      error.textContent = mensaje;
      error.hidden = false;
    },

    mostrarEtiqueta(texto) {
      etiqueta.textContent = texto;
      etiqueta.hidden = false;
    },
    ocultarEtiqueta() {
      etiqueta.hidden = true;
    },
    moverEtiqueta(x, y) {
      etiqueta.style.transform = `translate(${x + 14}px, ${y + 14}px)`;
    },

    abrirPanel(datos) {
      $('panel-nombre').textContent = datos.nombre;
      $('panel-descripcion').textContent = datos.descripcion;
      $('panel-material').textContent = datos.material;
      $('panel-luz').textContent = datos.reaccionaALuz ? 'Sí' : 'No';
      $('panel-precio').textContent = formatoPrecio.format(datos.precio);
      panel.inert = false;
      panel.classList.add('abierto');
      document.body.classList.add('enfocado');
    },
    cerrarPanel() {
      panel.classList.remove('abierto');
      panel.inert = true;
      document.body.classList.remove('enfocado');
    },
    alCerrarPanel(callback) {
      $('panel-cerrar').addEventListener('click', callback);
    },

    alternarFps() {
      fps.hidden = !fps.hidden;
    },
    medirFrame(dt) {
      if (fps.hidden) return;
      acumuladoTiempo += dt;
      acumuladoFrames += 1;
      peorFrame = Math.max(peorFrame, dt);
      if (acumuladoTiempo >= 0.5) {
        const valor = Math.round(acumuladoFrames / acumuladoTiempo);
        fps.textContent = `${valor} fps · peor frame ${(peorFrame * 1000).toFixed(1)} ms`;
        acumuladoTiempo = 0;
        acumuladoFrames = 0;
        peorFrame = 0;
      }
    },
  };
}
