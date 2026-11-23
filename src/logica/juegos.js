// Imagen y color de cada juego. La imagen se busca en public/img/juegos/<nombre-del-juego>.jpg:
// un juego nuevo solo necesita que se copie su archivo ahí (ver public/img/juegos/LEEME.txt).
const PALETA = ['#4FA3FF', '#FFB020', '#FF8FB1', '#E879F9', '#34D3EE', '#A3E635', '#FB923C', '#C084FC']

// "Mario Kart 8 Deluxe" -> "mario-kart-8-deluxe"
export function slugJuego(nombre = '') {
  return String(nombre)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// El mismo juego siempre recibe el mismo color de la paleta
export function colorJuego(juego) {
  const base = slugJuego(juego?.nombre) || String(juego?.id ?? '')
  let suma = 0
  for (const letra of base) suma = (suma * 31 + letra.charCodeAt(0)) % 9973
  return PALETA[suma % PALETA.length]
}

export function visualJuego(juego) {
  if (!juego) return { imagen: null, color: '#9146FF' }
  const slug = slugJuego(juego.nombre)
  return { imagen: slug ? `/img/juegos/${slug}.jpg` : null, color: colorJuego(juego) }
}
