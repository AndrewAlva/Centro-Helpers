// SOLUCIÓN DOCENTE, NO REPARTIR.
import { defineConfig } from 'vite';

export default defineConfig({
  // Rutas relativas: el build corre igual en la raíz de un dominio o en una subcarpeta.
  base: './',
  build: {
    chunkSizeWarningLimit: 900, // three.js pesa ~700 kB sin comprimir; es esperado
  },
});
