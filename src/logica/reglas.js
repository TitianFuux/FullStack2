import { formatearFecha } from './formato.js'

// Reglas de negocio puras (sin React): se prueban en reglas.spec.js

// Ordena por puntos (desc) y desempata por diferencia de puntaje (desc). No modifica el arreglo recibido.
export function ordenarRanking(filas) {
  return [...filas].sort(
    (a, b) => b.puntos - a.puntos || b.diferencia - a.diferencia || a.participante.localeCompare(b.participante),
  )
}

// Asigna puntos por victoria y por derrota a partir de [{ participante, resultado: 'victoria' | 'derrota' }]
export function calcularPuntos(resultados, reglas = { victoria: 3, derrota: 0 }) {
  return resultados.reduce((acc, r) => {
    const puntos = r.resultado === 'victoria' ? reglas.victoria : reglas.derrota
    acc[r.participante] = (acc[r.participante] || 0) + puntos
    return acc
  }, {})
}

// Cupo máximo menos inscripciones vigentes; nunca devuelve un valor negativo
export function cuposDisponibles(cupoMaximo, inscripcionesVigentes) {
  return Math.max(0, cupoMaximo - inscripcionesVigentes)
}

// Verdadero si la fecha actual supera el cierre (el mismo día del cierre todavía está en plazo)
export function inscripcionFueraDePlazo(fechaCierre, hoy = new Date()) {
  return hoy > new Date(`${fechaCierre}T23:59:59`)
}

// Verdadero si el jugador tiene al menos una sanción vigente
export function tieneSancionActiva(jugador) {
  return Boolean(jugador?.sanciones?.some((s) => s.vigente))
}

// Verdadero si el equipo tiene al menos los integrantes que exige el juego
export function equipoCompleto(equipo, juego) {
  return (equipo?.integrantes?.length ?? 0) >= (juego?.integrantesPorEquipo ?? 1)
}

// Días de calendario que faltan hasta una fecha ISO (0 = hoy, negativo = ya pasó)
export function diasRestantes(fechaIso, hoy = new Date()) {
  const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
  const objetivo = new Date(`${fechaIso}T00:00:00`)
  return Math.round((objetivo - inicioHoy) / 86400000)
}

// Un torneo se inscribe por equipos o de forma individual según su modalidad
export function esPorEquipos(torneo) {
  return String(torneo?.modalidad ?? torneo?.juego?.modalidad ?? '').toLowerCase() === 'equipos'
}

// Nombres de quienes ya están inscritos en un torneo, a partir de la lista de inscripciones
export function participantesDe(torneo, inscripciones = []) {
  return inscripciones
    .filter((i) => i.torneo?.id === torneo.id)
    .map((i) => i.equipo?.nombre ?? i.usuario?.apodo ?? 'Participante')
}

// Evalúa las reglas de inscripción antes de enviar y devuelve el motivo del bloqueo (texto para la persona)
// o null si se puede inscribir. El backend vuelve a validar todo: esto solo evita viajes inútiles.
export function evaluarInscripcion({ torneo, participante, inscritos = [], jugadores = [], hoy = new Date() }) {
  if (torneo.estado !== 'abierto') return 'Este torneo ya no recibe inscripciones.'
  if (inscripcionFueraDePlazo(torneo.fechaCierreInscripcion, hoy)) {
    return `El plazo de inscripción cerró el ${formatearFecha(torneo.fechaCierreInscripcion)}.`
  }
  if (cuposDisponibles(torneo.cupoMaximo, torneo.cupoOcupado) === 0) {
    return `El torneo alcanzó su cupo máximo (${torneo.cupoMaximo}).`
  }
  if (!participante) return null

  const porEquipos = esPorEquipos(torneo)
  const nombre = porEquipos ? participante.nombre : participante.apodo
  const delTorneo = inscritos.filter((i) => i.torneo?.id === torneo.id)
  const yaInscrito = delTorneo.some((i) => (porEquipos ? i.equipo?.id : i.usuario?.id) === participante.id)
  if (yaInscrito) return `"${nombre}" ya está inscrito en este torneo.`

  if (porEquipos) {
    if (participante.activo === false) return `"${nombre}" está inactivo y no puede inscribirse.`
    if (!equipoCompleto(participante, torneo.juego)) {
      return `"${nombre}" tiene ${participante.integrantes?.length ?? 0} de ${torneo.juego?.integrantesPorEquipo} integrantes exigidos.`
    }
    const capitan = jugadores.find((j) => j.id === participante.capitan?.id)
    if (tieneSancionActiva(capitan)) {
      return `El capitán ${capitan.apodo} tiene una sanción vigente (${capitan.sanciones.find((s) => s.vigente).motivo}).`
    }
    return null
  }

  if (tieneSancionActiva(participante)) {
    return `${nombre} tiene una sanción vigente (${participante.sanciones.find((s) => s.vigente).motivo}).`
  }
  return null
}
