
const JUEGOS = [
  { id: "g1", nombre: "League of legends", integrantesPorEquipo: 5, modalidad: "Equipos" },
  { id: "g2", nombre: "Rocket League",      integrantesPorEquipo: 3, modalidad: "Equipos" },
  { id: "g3", nombre: "Valorant",   integrantesPorEquipo: 5, modalidad: "Equipos" },
];

const EQUIPOS = [
  { id: "e1", nombre: "Halcones de Neón", juegoId: "g1", capitanId: "j1", activo: true,
    integrantes: [
      { jugadorId: "j1", rol: "Capitán" },
      { jugadorId: "j2", rol: "Titular" },
      { jugadorId: "j3", rol: "Titular" },
      { jugadorId: "j4", rol: "Suplente" }
    ] },
  { id: "e2", nombre: "Rúnicos del Sur", juegoId: "g4", capitanId: "j5", activo: true,
    integrantes: [
      { jugadorId: "j5", rol: "Capitán" },
      { jugadorId: "j2", rol: "Titular" },
    ] },
  { id: "e3", nombre: "Escuadrón Ceniza", juegoId: "g2", capitanId: "j3", activo: false,
    integrantes: [
      { jugadorId: "j3", rol: "Capitán" },
    ] },
];

const JUGADORES = [
  { id: "j1", nombre: "Benjamin Cabrera",  apodo: "DeusCabrex",  correo: "deusCabrex@correo.cl",
    estadisticas: { victorias: 18, derrotas: 7 },
    historial: [
      { torneo: "Copa Apertura Vórtice", resultado: "Campeón" },
      { torneo: "Liga Norte S1", resultado: "Semifinal" },
    ],
    sanciones: [] },
  { id: "j2", nombre: "Valentina Rojas", apodo: "vrx",     correo: "vrojas@correo.cl",
    estadisticas: { victorias: 11, derrotas: 9 },
    historial: [{ torneo: "Copa Apertura Vórtice", resultado: "Campeón" }],
    sanciones: [{ motivo: "Conducta antideportiva", duracion: "Cumplida (2 fechas)", vigente: false }] },
  { id: "j3", nombre: "Ignacio Pino",    apodo: "ip_one",  correo: "ipino@correo.cl",
    estadisticas: { victorias: 6, derrotas: 14 },
    historial: [],
    sanciones: [{ motivo: "Suplantación de identidad en inscripción", duracion: "Vigente hasta el cierre de temporada", vigente: true }] },
  { id: "j4", nombre: "Camila Soto",     apodo: "camsoto", correo: "csoto@correo.cl",
    estadisticas: { victorias: 3, derrotas: 2 },
    historial: [],
    sanciones: [] },
  { id: "j5", nombre: "Benjamín Araya",  apodo: "bnj",     correo: "baraya@correo.cl",
    estadisticas: { victorias: 21, derrotas: 10 },
    historial: [{ torneo: "Liga Norte S1", resultado: "Campeón" }],
    sanciones: [] },
];

const TORNEOS = [
  {
    id: "t1",
    nombre: "Copa Arena de Primavera",
    juegoId: "g1",
    estado: "abierto",
    modalidad: "Equipos",
    cupoMaximo: 16,
    cupoOcupado: 9,
    fechaInicio: "2026-10-05",
    fechaCierreInscripcion: "2026-09-28",
    descripcion: "Torneo clasificatorio de Vórtice Táctico para equipos de la zona centro-sur, formato de eliminación directa a partir de octavos.",
    participantes: ["Halcones de Neón", "Escuadrón Ceniza", "Rúnicos del Sur"],
    rondas: [],
    ranking: [],
    premios: [],
  },
  {
    id: "t2",
    nombre: "Liga Bastión Real S4",
    juegoId: "g4",
    estado: "en_curso",
    modalidad: "Equipos",
    cupoMaximo: 8,
    cupoOcupado: 8,
    fechaInicio: "2026-08-18",
    fechaCierreInscripcion: "2026-08-10",
    descripcion: "Cuarta temporada de la liga regular de Bastión Real, todos contra todos a una vuelta más fase final.",
    participantes: ["Rúnicos del Sur", "Halcones de Neón"],
    rondas: [
      {
        numero: 1,
        partidas: [
          { id: "p1", participanteA: "Rúnicos del Sur", participanteB: "Halcones de Neón", horario: "2026-08-20 19:00", estado: "validada", resultado: "2 - 1" },
          { id: "p2", participanteA: "Halcones de Neón", participanteB: "Por definir", horario: "—", estado: "pendiente", resultado: null },
        ],
      },
      {
        numero: 2,
        partidas: [
          { id: "p3", participanteA: "Rúnicos del Sur", participanteB: "Por definir", horario: "2026-09-10 19:00", estado: "programada", resultado: null },
        ],
      },
    ],
    ranking: [
      { participante: "Rúnicos del Sur", puntos: 6, diferencia: 4 },
      { participante: "Halcones de Neón", puntos: 3, diferencia: -1 },
    ],
    premios: [],
  },
  {
    id: "t3",
    nombre: "Rally Nocturno — Sprint Final",
    juegoId: "g3",
    estado: "finalizado",
    modalidad: "Individual",
    cupoMaximo: 24,
    cupoOcupado: 24,
    fechaInicio: "2026-06-02",
    fechaCierreInscripcion: "2026-05-25",
    descripcion: "Última fecha del circuito individual de Rally Nocturno, puntaje acumulado de tres mangas.",
    participantes: ["kaizen", "bnj", "camsoto"],
    rondas: [
      {
        numero: 1,
        partidas: [
          { id: "p4", participanteA: "kaizen", participanteB: "bnj", horario: "2026-06-02 18:00", estado: "validada", resultado: "1 - 0" },
        ],
      },
    ],
    ranking: [
      { participante: "kaizen", puntos: 30, diferencia: 12 },
      { participante: "bnj", puntos: 24, diferencia: 6 },
      { participante: "camsoto", puntos: 15, diferencia: -2 },
    ],
    premios: [
      { posicion: "1° lugar", premio: "Cupo directo a la final regional + estatuilla" },
      { posicion: "2° lugar", premio: "Insignia digital de temporada" },
      { posicion: "3° lugar", premio: "Insignia digital de temporada" },
    ],
  },
  {
    id: "t4",
    nombre: "Clasificatorio Arena Aérea",
    juegoId: "g2",
    estado: "abierto",
    modalidad: "Equipos",
    cupoMaximo: 12,
    cupoOcupado: 12,
    fechaInicio: "2026-09-20",
    fechaCierreInscripcion: "2026-09-14",
    descripcion: "Clasificatorio de Arena Aérea con cupo agotado; quedan solo las plazas de lista de espera.",
    participantes: ["Escuadrón Ceniza"],
    rondas: [],
    ranking: [],
    premios: [],
  },
];
const Datos = {
  obtenerJuegoPorId(id) { return JUEGOS.find((j) => j.id === id) || null; },
  obtenerTorneoPorId(id) { return TORNEOS.find((t) => t.id === id) || null; },
  obtenerEquipoPorNombre(nombre) { return EQUIPOS.find((e) => e.nombre === nombre) || null; },
  obtenerJugadorPorApodo(apodo) { return JUGADORES.find((j) => j.apodo === apodo) || null; },
  obtenerJugadorPorId(id) { return JUGADORES.find((j) => j.id === id) || null; },
  nombreEstado(estado) {
    return { abierto: "Abierto", en_curso: "En curso", finalizado: "Finalizado" }[estado] || estado;
  },
};
