const JUEGOS = [
  { id: "g1", nombre: "League of Legends", integrantesPorEquipo: 5, modalidad: "Equipos" },
  { id: "g2", nombre: "Rocket League", integrantesPorEquipo: 3, modalidad: "Equipos" },
  { id: "g3", nombre: "Mario Kart 8 Deluxe", integrantesPorEquipo: 1, modalidad: "Individual" },
  { id: "g4", nombre: "Valorant", integrantesPorEquipo: 5, modalidad: "Equipos" },
];

const EQUIPOS = [
  { id: "e1", nombre: "Halcones de Neón", juegoId: "g1", capitanId: "j1", activo: true,
    integrantes: [
      { jugadorId: "j1", rol: "Capitán" },
      { jugadorId: "j2", rol: "Titular" },
      { jugadorId: "j3", rol: "Titular" },
      { jugadorId: "j4", rol: "Suplente" },
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
  { id: "j1", nombre: "Benjamin Cabrera", apodo: "DeusCabrex", correo: "deusCabrex@correo.cl",
    estadisticas: { victorias: 18, derrotas: 7 },
    historial: [
      { torneo: "Copa Apertura Vórtice", resultado: "Campeón" },
      { torneo: "Liga Norte S1", resultado: "Semifinal" },
    ],
    sanciones: [] },
  { id: "j2", nombre: "Valentina Rojas", apodo: "vrx", correo: "vrojas@correo.cl",
    estadisticas: { victorias: 11, derrotas: 9 },
    historial: [{ torneo: "Copa Apertura Vórtice", resultado: "Campeón" }],
    sanciones: [{ motivo: "Conducta antideportiva", duracion: "Cumplida (2 fechas)", vigente: false }] },
  { id: "j3", nombre: "Ignacio Pino", apodo: "ip_one", correo: "ipino@correo.cl",
    estadisticas: { victorias: 6, derrotas: 14 },
    historial: [],
    sanciones: [{ motivo: "Suplantación de identidad en inscripción", duracion: "Vigente hasta el cierre de temporada", vigente: true }] },
  { id: "j4", nombre: "Camila Soto", apodo: "camsoto", correo: "csoto@correo.cl",
    estadisticas: { victorias: 3, derrotas: 2 },
    historial: [],
    sanciones: [] },
  { id: "j5", nombre: "Benjamín Araya", apodo: "bnj", correo: "baraya@correo.cl",
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
    descripcion: "Torneo clasificatorio de Vórtice Táctico para equipos de la zona centro-sur.",
    participantes: ["Halcones de Neón", "Escuadrón Ceniza", "Rúnicos del Sur"],
    rondas: [],
    ranking: [],
    premios: [],
  }
];

// Arreglo global para almacenar inscripciones en memoria y evitar el ReferenceError
let inscripciones = [
  { id: "i1", torneoId: "t1", tipo: "equipo", equipoId: "e1" }
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