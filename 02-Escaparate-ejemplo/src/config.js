// SOLUCIÓN DOCENTE, NO REPARTIR.
// Todos los datos del escaparate viven aquí. La escena se construye recorriendo estos arreglos.

// ── Constantes (variables con const) ──
export const PALETA = {
  rosa: 0xff2e88,
  cian: 0x2ee6d6,
  amarillo: 0xffd23f,
  naranja: 0xff6a1a,
  blanco: 0xfff6e0,
  tinta: 0x16161a,
};

// La sala es una caja abierta al frente: pared trasera en z = -2, boca del escaparate en z = +2.
export const SALA = { ancho: 10, alto: 4, fondo: 4 };

export const RENDIMIENTO = {
  pixelRatioMax: 1.75, // limita el costo en pantallas retina
  sombra: 1024, // resolución del mapa de sombras
};

// ── Arreglo de objetos: un elemento por producto ──
// `modelo` elige el constructor en escena/productos.js.
// `enfoque` dice dónde se para la cámara al seleccionar (distancia y altura sobre la base del producto).
export const PRODUCTOS = [
  {
    id: 'stickers',
    modelo: 'stickers',
    nombre: 'Stickers de vinil',
    material: 'MeshBasicMaterial',
    reaccionaALuz: false,
    precio: 80,
    x: -3.6,
    alturaBase: 0.55,
    ancho: 1.5,
    enfoque: { distancia: 2.9, altura: 0.8 },
    descripcion:
      'Cuatro stickers de color plano. El material Basic ignora las luces, por eso se ven igual de intensos en cualquier rincón de la vitrina.',
  },
  {
    id: 'rodamientos',
    modelo: 'rodamientos',
    nombre: 'Baleros cromados',
    material: 'MeshMatcapMaterial',
    reaccionaALuz: false,
    precio: 450,
    x: -1.8,
    alturaBase: 0.8,
    enfoque: { distancia: 3.4, altura: 0.9 },
    descripcion:
      'El brillo cromado viene de una textura matcap, no de las luces: es un reflejo pintado que mira siempre a la cámara.',
  },
  {
    id: 'skate',
    modelo: 'skate',
    nombre: 'Skateboard completo',
    material: 'MeshStandardMaterial',
    reaccionaALuz: true,
    precio: 2190,
    x: 0,
    alturaBase: 0.4,
    ancho: 1.7,
    enfoque: { distancia: 3.9, altura: 1.0 },
    descripcion:
      'Modelo importado en GLB. Su material PBR responde a las luces y a las sombras: mira cómo cambian los trucks metálicos mientras gira.',
  },
  {
    id: 'ruedas',
    modelo: 'ruedas',
    nombre: 'Ruedas de 54 mm',
    material: 'MeshPhongMaterial',
    reaccionaALuz: true,
    precio: 620,
    x: 1.8,
    alturaBase: 0.65,
    ancho: 1.3,
    enfoque: { distancia: 3.3, altura: 0.9 },
    descripcion:
      'Uretano con un brillo especular marcado. Phong refleja la luz en un punto claro que se mueve al rodar la rueda.',
  },
  {
    id: 'conos',
    modelo: 'conos',
    nombre: 'Conos de slalom',
    material: 'MeshToonMaterial',
    reaccionaALuz: true,
    precio: 150,
    x: 3.6,
    alturaBase: 0.5,
    ancho: 1.5,
    enfoque: { distancia: 3.0, altura: 0.8 },
    descripcion:
      'Sombreado de caricatura: la luz se corta en escalones en vez de degradarse, como en una ilustración.',
  },
];

// Decks colgados en la pared trasera: [x, y, inclinación, textura]
export const DECKS_PARED = [
  [-4.05, 2.55, 0.05, 'deckB'],
  [-3.4, 2.65, -0.04, 'deckC'],
  [-2.75, 2.5, 0.03, 'deckA'],
  [2.75, 2.5, -0.03, 'deckC'],
  [3.4, 2.65, 0.04, 'deckA'],
  [4.05, 2.55, -0.05, 'deckB'],
];
