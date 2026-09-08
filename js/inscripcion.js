const inscripciones = [];
const parametros = new URLSearchParams(window.location.search);
const torneoId = parametros.get("id") || "t1";
const torneo = Datos.obtenerTorneoPorId(torneoId) || TORNEOS[0];
const juegoDelTorneo = Datos.obtenerJuegoPorId(torneo.juegoId);

const contenedorDetalle = document.getElementById("detalle-torneo");
const listaRequisitos = document.getElementById("lista-requisitos");
const selectTipo = document.getElementById("tipo-participante");
const contenedorEquipo = document.getElementById("contenedor-selector-equipo");
const selectEquipo = document.getElementById("selector-equipo");
const errorTipo = document.getElementById("error-tipo");
const errorEquipo = document.getElementById("error-equipo");
const mensajeBloqueo = document.getElementById("mensaje-bloqueo");
const form = document.getElementById("form-inscripcion");
const confirmacion = document.getElementById("confirmacion");
const detalleConfirmacion = document.getElementById("detalle-confirmacion");

function mostrarDetalleTorneo() {
  contenedorDetalle.innerHTML = `
    <p><strong>Torneo:</strong> ${torneo.nombre}</p>
    <p><strong>Juego:</strong> ${juegoDelTorneo ? juegoDelTorneo.nombre : "No disponible"}</p>
    <p><strong>Cupos:</strong> ${torneo.cupoOcupado} de ${torneo.cupoMaximo}</p>
    <p><strong>Cierre de inscripción:</strong> ${torneo.fechaCierreInscripcion}</p>`;

  listaRequisitos.innerHTML = `
    <li>Integrantes mínimos por equipo: ${juegoDelTorneo.integrantesPorEquipo}</li>
    <li>Cupo máximo: ${torneo.cupoMaximo}</li>`;
}

function llenarSelectorDeEquipos() {
  const equiposDelJuego = EQUIPOS.filter((equipo) => equipo.juegoId === torneo.juegoId && equipo.activo);
  selectEquipo.innerHTML = '<option value="">Selecciona un equipo</option>' +
    equiposDelJuego.map((equipo) => `<option value="${equipo.id}">${equipo.nombre}</option>`).join("");
}

selectTipo.addEventListener("change", () => {
  errorTipo.textContent = "";
  errorEquipo.textContent = "";
  const esEquipo = selectTipo.value === "equipo";
  contenedorEquipo.hidden = !esEquipo;
  if (esEquipo) llenarSelectorDeEquipos();
});

function validarInscripcion(tipoParticipante, equipoId) {
  const errores = [];
  const hoy = new Date().toISOString().split("T")[0];

  if (hoy > torneo.fechaCierreInscripcion) errores.push("El plazo de inscripción ya cerró.");
  if (torneo.cupoOcupado + inscripciones.length >= torneo.cupoMaximo) errores.push("Este torneo ya no tiene cupos disponibles.");

  if (tipoParticipante === "equipo") {
    const equipo = EQUIPOS.find((item) => item.id === equipoId);
    if (!equipo) {
      errores.push("El equipo seleccionado no existe.");
      return errores;
    }
    if (inscripciones.some((inscripcion) => inscripcion.torneoId === torneo.id && inscripcion.equipoId === equipoId)) {
      errores.push("Este equipo ya está inscrito en este torneo.");
    }
    if (equipo.integrantes.length < juegoDelTorneo.integrantesPorEquipo) {
      errores.push(`El equipo necesita al menos ${juegoDelTorneo.integrantesPorEquipo} integrantes.`);
    }
    const capitan = Datos.obtenerJugadorPorId(equipo.capitanId);
    if (capitan && capitan.sanciones.some((sancion) => sancion.vigente)) {
      errores.push(`El capitán ${capitan.apodo} tiene una sanción vigente.`);
    }
  }
  return errores;
}

form.addEventListener("submit", (evento) => {
  evento.preventDefault();
  errorTipo.textContent = "";
  errorEquipo.textContent = "";
  mensajeBloqueo.hidden = true;

  const tipoParticipante = selectTipo.value;
  const equipoId = selectEquipo.value;
  if (!tipoParticipante) {
    errorTipo.textContent = "Debes seleccionar cómo te inscribirás.";
    return;
  }
  if (tipoParticipante === "equipo" && !equipoId) {
    errorEquipo.textContent = "Debes seleccionar tu equipo.";
    return;
  }

  const errores = validarInscripcion(tipoParticipante, equipoId);
  if (errores.length) {
    mensajeBloqueo.hidden = false;
    mensajeBloqueo.textContent = errores.join(" ");
    confirmacion.hidden = true;
    return;
  }

  inscripciones.push({ torneoId: torneo.id, tipoParticipante, equipoId });
  form.hidden = true;
  confirmacion.hidden = false;
  detalleConfirmacion.textContent = `Te inscribiste correctamente en ${torneo.nombre}.`;
});

mostrarDetalleTorneo();
