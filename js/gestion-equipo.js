const formEquipo = document.getElementById("form-equipo");
const inputNombre = document.getElementById("nombre-equipo");
const selectJuego = document.getElementById("juego-principal");
const selectCapitan = document.getElementById("capitan");
const errorNombre = document.getElementById("error-nombre");
const errorJuego = document.getElementById("error-juego");
const errorCapitan = document.getElementById("error-capitan");
const listaIntegrantes = document.getElementById("lista-integrantes");
const selectAgregarJugador = document.getElementById("agregar-jugador");
const btnAgregar = document.getElementById("btn-agregar");
const errorAgregar = document.getElementById("error-agregar");

let equipoEnEdicion = null;

function llenarSelectorJuegos() {
  selectJuego.innerHTML = '<option value="">Selecciona un juego</option>' +
    JUEGOS.map((juego) => `<option value="${juego.id}">${juego.nombre}</option>`).join("");
}

function llenarSelectorCapitanes() {
  selectCapitan.innerHTML = '<option value="">Selecciona un capitán</option>' +
    JUGADORES.map((jugador) => `<option value="${jugador.id}">${jugador.apodo}</option>`).join("");
}

function llenarSelectorAgregarJugador() {
  selectAgregarJugador.innerHTML = JUGADORES
    .map((jugador) => `<option value="${jugador.id}">${jugador.apodo}</option>`).join("");
}

function renderizarIntegrantes() {
  if (!equipoEnEdicion) {
    listaIntegrantes.innerHTML = "<li>Todavía no has creado un equipo.</li>";
    return;
  }

  listaIntegrantes.innerHTML = equipoEnEdicion.integrantes.map((integrante) => {
    const jugador = Datos.obtenerJugadorPorId(integrante.jugadorId);
    const esCapitan = integrante.jugadorId === equipoEnEdicion.capitanId;
    return `<li class="integrante"><span>${jugador ? jugador.apodo : "Jugador desconocido"} ${esCapitan ? "(Capitán)" : ""}</span>
      <button type="button" data-id="${integrante.jugadorId}" class="boton boton-secundario btn-quitar">Quitar</button></li>`;
  }).join("");

  listaIntegrantes.querySelectorAll(".btn-quitar").forEach((boton) => {
    boton.addEventListener("click", () => quitarJugador(boton.dataset.id));
  });
}

function quitarJugador(idJugador) {
  if (idJugador === equipoEnEdicion.capitanId) {
    alert("No puedes quitar al capitán del equipo.");
    return;
  }
  equipoEnEdicion.integrantes = equipoEnEdicion.integrantes.filter(
    (integrante) => integrante.jugadorId !== idJugador
  );
  renderizarIntegrantes();
}

formEquipo.addEventListener("submit", (evento) => {
  evento.preventDefault();
  errorNombre.textContent = "";
  errorJuego.textContent = "";
  errorCapitan.textContent = "";

  const nombre = inputNombre.value.trim();
  const juegoId = selectJuego.value;
  const capitanId = selectCapitan.value;

  if (!nombre) errorNombre.textContent = "El nombre del equipo es obligatorio.";
  else if (EQUIPOS.some((equipo) => equipo.nombre.toLowerCase() === nombre.toLowerCase())) {
    errorNombre.textContent = "Ya existe un equipo con ese nombre.";
  }
  if (!juegoId) errorJuego.textContent = "Debes seleccionar un juego.";
  if (!capitanId) errorCapitan.textContent = "Debes seleccionar un capitán.";
  if (errorNombre.textContent || errorJuego.textContent || errorCapitan.textContent) return;

  equipoEnEdicion = {
    id: `e${EQUIPOS.length + 1}`,
    nombre,
    juegoId,
    capitanId,
    activo: true,
    integrantes: [{ jugadorId: capitanId, rol: "Capitán" }],
  };
  EQUIPOS.push(equipoEnEdicion);
  renderizarIntegrantes();
  formEquipo.reset();
});

btnAgregar.addEventListener("click", () => {
  errorAgregar.textContent = "";
  if (!equipoEnEdicion) {
    errorAgregar.textContent = "Primero debes crear un equipo.";
    return;
  }
  const jugadorId = selectAgregarJugador.value;
  if (equipoEnEdicion.integrantes.some((integrante) => integrante.jugadorId === jugadorId)) {
    errorAgregar.textContent = "Ese jugador ya está en el equipo.";
    return;
  }
  equipoEnEdicion.integrantes.push({ jugadorId, rol: "Titular" });
  renderizarIntegrantes();
});

llenarSelectorJuegos();
llenarSelectorCapitanes();
llenarSelectorAgregarJugador();
renderizarIntegrantes();
