# Escaparate 3D · Concreto Skate Shop

> **SOLUCIÓN DOCENTE, NO REPARTIR.**
> Referencia para el docente del ejercicio del Bloque I (CC325-21, 2026-2). No se comparte con el grupo.

Escaparate de una tienda de skateboarding hecho con three.js y GSAP. Cumple el piso y las extensiones de la rúbrica `06-rubrica-escaparate-matriz`.

## Correrlo

```bash
npm install
npm run dev        # desarrollo
npm run build      # genera dist/
npm run preview    # sirve dist/ para revisar el build
```

Los assets ya vienen generados. Para regenerarlos (texturas y GLB): `pip install numpy pillow trimesh` y `python3 tools/generate_assets.py`.

**Controles:** click en un producto, ← → para recorrerlos, 1 a 5 para ir directo, Esc para volver, F muestra los fps.

## Estructura

```
index.html
src/
  main.js                  renderer, carga, armado de la escena, loop
  config.js                paleta, medidas de la sala, arreglo PRODUCTOS
  ui.js                    todo lo que toca el DOM
  style.css
  escena/
    texturas.js            TextureLoader, sRGB, repeat, gradientMap
    entorno.js             piso, paredes, marco, neón, decks de pared
    luces.js               las cuatro luces y la única con sombras
    productos.js           los cinco productos y sus pedestales
  interaccion/
    raton.js               Raycaster (hover + click)
    teclado.js             atajos de teclado
    seleccion.js           estado hover / seleccionado, tweens de escala
    camara.js              rig de cámara con GSAP
public/models/skateboard.glb
public/textures/*
tools/generate_assets.py
```

## Dónde se cumple cada criterio

| # | Criterio | Dónde mirar |
|---|---|---|
| 1 | Efectividad y estabilidad | Consola limpia en las pruebas. `main.js` maneja WebGL no disponible y fallas de carga con mensaje al usuario. |
| 2 | Fundamentos | `const`/`let` en todo el proyecto. Arrays y objetos: `PRODUCTOS`, `DECKS_PARED`, `PALETA` (`config.js`). Ciclos: `for` y `forEach` (balines en `crearRodamientos`, decks en `entorno.js`, productos en `main.js`). Condicionales: `seleccion.js`, `camara.js`. Funciones propias: `crearDeckPlano`, `conRepeat`, `crearGradientMap`, `conSombras`. |
| 3 | Meshes y transformaciones | Toda la sala y cuatro productos son geometría + material de three.js. Posición, rotación y escala se usan en `productos.js` (p. ej. `rodamiento.scale.setScalar(2.6)`, `inclinado.rotation.x`). |
| 4 | Modelo importado | `skateboard.glb` con `GLTFLoader` en `main.js`. `crearSkate` recorre sus mallas con `traverse`, activa sombras y anima las ruedas por nombre. |
| 5 | requestAnimationFrame | Un solo loop en `main.js`. Lineal: ruedas, plato giratorio, rodamiento. Oscilatoria con `sin`/`cos`: flotación, cabeceo, neón, decks de pared. |
| 6 | Tweens GSAP | `seleccion.js` (escala con `back.out` y `overwrite: 'auto'`) y `camara.js` (cámara con `killTweensOf`). Los tweens no se apilan. |
| 7 | Click y teclado | Click: `raton.js`. Teclado: `teclado.js`. Ambos llaman las mismas funciones de `seleccion.js`. |
| 8 | Raycaster | `raton.js`: coordenadas normalizadas contra el rectángulo del canvas, solo contra los productos, hover + click, estado que vuelve a reposo, una revisión por frame. |
| 9 | Luz y sombras | `luces.js`: hemisférica, foco con sombras (`bias`, `normalBias`, cámara de sombra ajustada), dos puntos de color. Solo el foco proyecta sombras. |
| 10 | Texturas | `texturas.js`: concreto y madera con `RepeatWrapping`, decks, matcap. `colorSpace` sRGB. Se reutilizan con `conRepeat` en varios objetos. |
| 11 | Materiales | Basic (stickers, neón), Matcap (rodamientos), Phong (ruedas), Toon (conos, con `gradientMap`), Standard (skate, pedestales, piso). El panel de cada producto dice si reacciona a la luz. |
| 12 | Entendimiento del código | Ver ajustes de ejemplo abajo. |
| 13 | Rendimiento | Pixel ratio topado (`RENDIMIENTO.pixelRatioMax`), un solo foco con sombra de 1024, sin crear objetos dentro del loop, el raycaster no corre en cada evento. Medición con la tecla F. |
| 14 | Repo y orden | Estructura de carpetas de arriba, `.gitignore`, corre con Vite. |

## Ajustes en vivo para probar

- Cambiar el material del cono a `MeshStandardMaterial`: `crearConos` en `productos.js`.
- Invertir el giro del plato del skate: `giro.rotation.y += dt * 0.35` en `crearSkate`.
- Cambiar cuántos balines lleva el rodamiento: `const balines = 8` en `crearRodamientos`.
- Asignar otra tecla a "volver": `teclado.js`.
- Mover el foco y ver qué pasa con la sombra: `foco.position` en `luces.js`.

## Cosas que conviene saber

- El GLB se genera por código, no viene de Blender ni Cinema 4D. Para los alumnos el flujo es exportar desde su software.
- Las texturas son procedurales y las hace `tools/generate_assets.py`.
- La animación usa el tiempo real entre frames (delta time), aunque no está en la lista de la rúbrica.
- Las sombras usan `PCFShadowMap`: en three r186 el tipo `PCFSoftShadowMap` ya no existe.
- `MeshMatcapMaterial` y `MeshBasicMaterial` no reciben luz ni sombras; los productos que los usan solo las proyectan.

## Qué se probó y qué no

Probado en Chromium headless con WebGL por software (SwiftShader): carga sin errores de consola, hover, click, click en el vacío, teclado, botón de volver, toque en móvil vertical, y el contador de fps.

**No probado:** los 60 fps reales (el render por software da 2 fps, no es representativo), Safari, Firefox, y pantallas táctiles físicas. Hay que revisar el rendimiento en una computadora real antes de usarlo como referencia del criterio 13.
