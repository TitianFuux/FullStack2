import { iniciales } from './formato.js'

// Portada generada (SVG) con el color del juego; se usa si no hay imagen o el archivo no carga
export function portadaGenerada(nombre, color = '#9146FF') {
  const sigla = iniciales(nombre || 'Arena')
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 450' preserveAspectRatio='xMidYMid slice'>` +
    `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${color}' stop-opacity='.9'/>` +
    `<stop offset='1' stop-color='#0E0B16'/></linearGradient>` +
    `<pattern id='p' width='40' height='40' patternUnits='userSpaceOnUse' patternTransform='rotate(35)'>` +
    `<rect width='6' height='40' fill='white' fill-opacity='.06'/></pattern></defs>` +
    `<rect width='800' height='450' fill='url(#g)'/><rect width='800' height='450' fill='url(#p)'/>` +
    `<text x='50' y='350' font-family='Oswald,Arial Narrow,sans-serif' font-weight='700' font-size='230' ` +
    `fill='white' fill-opacity='.18'>${sigla}</text></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
