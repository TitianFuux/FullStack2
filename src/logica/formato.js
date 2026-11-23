// Formatos de fecha para mostrar en pantalla
export function formatearFecha(iso) {
  if (!iso) return '—'
  return new Date(`${iso}T00:00:00`).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })
}

// Las iniciales de un nombre ("Valentina Rojas" -> "VR")
export function iniciales(nombre = '') {
  return String(nombre).split(/\s+/).filter(Boolean).map((p) => p[0]).join('').slice(0, 3).toUpperCase()
}
