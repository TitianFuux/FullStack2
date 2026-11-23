import {
  ordenarRanking,
  calcularPuntos,
  cuposDisponibles,
  inscripcionFueraDePlazo,
  tieneSancionActiva,
  equipoCompleto,
  diasRestantes,
  esPorEquipos,
  participantesDe,
  evaluarInscripcion,
} from './reglas'

describe('ordenarRanking', () => {
  it('ordena por puntos y desempata por diferencia de puntaje', () => {
    const filas = [
      { participante: 'B', puntos: 6, diferencia: 1 },
      { participante: 'A', puntos: 6, diferencia: 4 },
      { participante: 'C', puntos: 9, diferencia: -2 },
    ]
    expect(ordenarRanking(filas).map((f) => f.participante)).toEqual(['C', 'A', 'B'])
  })

  it('no modifica el arreglo original', () => {
    const filas = [
      { participante: 'B', puntos: 1, diferencia: 0 },
      { participante: 'A', puntos: 5, diferencia: 0 },
    ]
    ordenarRanking(filas)
    expect(filas[0].participante).toBe('B')
  })
})

describe('calcularPuntos', () => {
  const resultados = [
    { participante: 'A', resultado: 'victoria' },
    { participante: 'A', resultado: 'victoria' },
    { participante: 'B', resultado: 'derrota' },
    { participante: 'B', resultado: 'victoria' },
  ]

  it('asigna los puntos definidos por victoria y por derrota', () => {
    expect(calcularPuntos(resultados, { victoria: 3, derrota: 1 })).toEqual({ A: 6, B: 4 })
  })

  it('usa 3 puntos por victoria y 0 por derrota si no se indican reglas', () => {
    expect(calcularPuntos(resultados)).toEqual({ A: 6, B: 3 })
  })
})

describe('cuposDisponibles', () => {
  it('resta las inscripciones vigentes al cupo máximo', () => {
    expect(cuposDisponibles(16, 9)).toBe(7)
  })

  it('nunca retorna un valor negativo', () => {
    expect(cuposDisponibles(8, 8)).toBe(0)
    expect(cuposDisponibles(8, 11)).toBe(0)
  })
})

describe('inscripcionFueraDePlazo', () => {
  it('retorna verdadero cuando la fecha actual supera el cierre', () => {
    expect(inscripcionFueraDePlazo('2026-09-28', new Date('2026-09-29T08:00:00'))).toBeTrue()
  })

  it('retorna falso el mismo día del cierre y antes de él', () => {
    expect(inscripcionFueraDePlazo('2026-09-28', new Date('2026-09-28T22:00:00'))).toBeFalse()
    expect(inscripcionFueraDePlazo('2026-09-28', new Date('2026-09-01T10:00:00'))).toBeFalse()
  })
})

describe('tieneSancionActiva', () => {
  it('bloquea al participante con sanción vigente', () => {
    expect(tieneSancionActiva({ sanciones: [{ motivo: 'x', vigente: true }] })).toBeTrue()
  })

  it('permite al que ya cumplió la sanción o no tiene ninguna', () => {
    expect(tieneSancionActiva({ sanciones: [{ motivo: 'x', vigente: false }] })).toBeFalse()
    expect(tieneSancionActiva({ sanciones: [] })).toBeFalse()
    expect(tieneSancionActiva(undefined)).toBeFalse()
  })
})

describe('equipoCompleto', () => {
  const juego = { integrantesPorEquipo: 5 }
  const equipoCon = (n) => ({ integrantes: Array.from({ length: n }, (_, i) => ({ usuario: { id: i } })) })

  it('es falso si faltan integrantes', () => {
    expect(equipoCompleto(equipoCon(4), juego)).toBeFalse()
  })

  it('es verdadero con la cantidad exigida por el juego', () => {
    expect(equipoCompleto(equipoCon(5), juego)).toBeTrue()
  })
})

describe('diasRestantes', () => {
  const hoy = new Date('2026-10-21T15:00:00')

  it('cuenta días de calendario hasta la fecha', () => {
    expect(diasRestantes('2026-10-21', hoy)).toBe(0)
    expect(diasRestantes('2026-10-25', hoy)).toBe(4)
  })

  it('es negativo si la fecha ya pasó', () => {
    expect(diasRestantes('2026-10-20', hoy)).toBe(-1)
  })
})

describe('esPorEquipos y participantesDe', () => {
  it('detecta la modalidad sin distinguir mayúsculas', () => {
    expect(esPorEquipos({ modalidad: 'Equipos' })).toBeTrue()
    expect(esPorEquipos({ modalidad: 'EQUIPOS' })).toBeTrue()
    expect(esPorEquipos({ modalidad: 'Individual' })).toBeFalse()
  })

  it('lista los nombres inscritos en el torneo pedido', () => {
    const inscripciones = [
      { torneo: { id: 1 }, equipo: { id: 10, nombre: 'Halcones' } },
      { torneo: { id: 1 }, usuario: { id: 5, apodo: 'bnj' } },
      { torneo: { id: 2 }, equipo: { id: 11, nombre: 'Otros' } },
    ]
    expect(participantesDe({ id: 1 }, inscripciones)).toEqual(['Halcones', 'bnj'])
  })
})

describe('evaluarInscripcion', () => {
  const jugadores = [{ id: 1, apodo: 'cap', sanciones: [] }]
  let torneo
  let equipo

  // Cada prueba parte con datos limpios
  beforeEach(() => {
    torneo = {
      id: 1,
      estado: 'abierto',
      modalidad: 'Equipos',
      cupoMaximo: 4,
      cupoOcupado: 1,
      fechaCierreInscripcion: '2099-01-01',
      juego: { id: 1, integrantesPorEquipo: 2 },
    }
    equipo = {
      id: 10,
      nombre: 'Nuevo',
      activo: true,
      capitan: { id: 1 },
      integrantes: [{ usuario: { id: 1 } }, { usuario: { id: 2 } }],
    }
  })

  const evaluar = (cambios = {}) => evaluarInscripcion({ torneo, participante: equipo, jugadores, ...cambios })

  it('permite inscribir un equipo completo, activo y sin sanciones', () => {
    expect(evaluar()).toBeNull()
  })

  it('bloquea un torneo que ya no está abierto', () => {
    torneo.estado = 'finalizado'
    expect(evaluar()).toContain('ya no recibe')
  })

  it('bloquea cuando no quedan cupos', () => {
    torneo.cupoOcupado = 4
    expect(evaluar()).toContain('cupo máximo')
  })

  it('bloquea cuando el plazo venció', () => {
    torneo.fechaCierreInscripcion = '2020-01-01'
    expect(evaluar()).toContain('plazo')
  })

  it('bloquea la inscripción duplicada', () => {
    const inscritos = [{ torneo: { id: 1 }, equipo: { id: 10 } }]
    expect(evaluar({ inscritos })).toContain('ya está inscrito')
  })

  it('bloquea equipos inactivos', () => {
    equipo.activo = false
    expect(evaluar()).toContain('inactivo')
  })

  it('bloquea equipos incompletos', () => {
    equipo.integrantes = [{ usuario: { id: 1 } }]
    expect(evaluar()).toContain('1 de 2 integrantes')
  })

  it('bloquea si el capitán tiene una sanción vigente', () => {
    const conSancion = [{ id: 1, apodo: 'cap', sanciones: [{ motivo: 'Trampa', vigente: true }] }]
    expect(evaluar({ jugadores: conSancion })).toContain('sanción vigente')
  })

  it('en un torneo individual bloquea al jugador con sanción vigente y permite al que no tiene', () => {
    torneo.modalidad = 'Individual'
    const sancionado = { id: 7, apodo: 'ip_one', sanciones: [{ motivo: 'Trampa', vigente: true }] }
    const limpio = { id: 8, apodo: 'camsoto', sanciones: [] }
    expect(evaluarInscripcion({ torneo, participante: sancionado })).toContain('sanción vigente')
    expect(evaluarInscripcion({ torneo, participante: limpio })).toBeNull()
  })
})
