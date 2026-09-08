document.addEventListener("DOMContentLoaded", function () {
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

    function idJugadorDe(integrante) {
        return typeof integrante === "object"
            ? integrante.jugadorId
            : integrante;
    }

    function llenarSelectorJuegos() {
        const juegosDisponibles = JUEGOS.filter(
            juego => juego.modalidad === "Equipos"
        );

        selectJuego.innerHTML =
            '<option value="">Selecciona un juego</option>' +
            juegosDisponibles.map(juego =>
                `<option value="${juego.id}">${juego.nombre}</option>`
            ).join("");
    }

    function llenarSelectorCapitanes() {
        selectCapitan.innerHTML =
            '<option value="">Selecciona un capitan</option>' +
            JUGADORES.map(jugador =>
                `<option value="${jugador.id}">${jugador.apodo}</option>`
            ).join("");
    }

    function jugadorEnEquipo(idJugador) {
        return equipoEnEdicion &&
            equipoEnEdicion.integrantes.some(
                integrante => idJugadorDe(integrante) === idJugador
            );
    }

    function llenarSelectorAgregarJugador() {
        const juegoId = selectJuego.value;

        if (!juegoId) {
            selectAgregarJugador.innerHTML =
                '<option value="">Selecciona primero un juego</option>';
            return;
        }

        const disponibles = JUGADORES.filter(
            jugador => !jugadorEnEquipo(jugador.id)
        );

        selectAgregarJugador.innerHTML =
            '<option value="">Selecciona un jugador</option>' +
            disponibles.map(jugador =>
                `<option value="${jugador.id}">${jugador.apodo}</option>`
            ).join("");
    }

    function renderizarIntegrantes() {
        if (!equipoEnEdicion) {
            listaIntegrantes.innerHTML =
                "<li>Todavía no has creado un equipo.</li>";
            return;
        }

        listaIntegrantes.innerHTML = equipoEnEdicion.integrantes.map(integrante => {
            const idJugador = idJugadorDe(integrante);
            const jugador = JUGADORES.find(j => j.id === idJugador);

            if (!jugador) return "";

            const esCapitan = idJugador === equipoEnEdicion.capitanId;

            return `
                <li>
                    <strong>${jugador.apodo}</strong>
                    ${esCapitan ? " (Capitán)" : ""}
                    <button type="button"
                            class="btn-quitar"
                            data-id="${jugador.id}"
                            ${esCapitan ? "disabled" : ""}>
                        ${esCapitan ? "Capitán" : "Quitar"}
                    </button>
                </li>
            `;
        }).join("");

        document.querySelectorAll(".btn-quitar:not([disabled])").forEach(
            boton => boton.addEventListener("click", function () {
                quitarJugador(this.dataset.id);
            })
        );
    }

    function quitarJugador(idJugador) {
        if (!equipoEnEdicion) return;

        if (idJugador === equipoEnEdicion.capitanId) {
            alert("No puedes quitar al capitán del equipo.");
            return;
        }

        equipoEnEdicion.integrantes =
            equipoEnEdicion.integrantes.filter(
                integrante => idJugadorDe(integrante) !== idJugador
            );

        renderizarIntegrantes();
        llenarSelectorAgregarJugador();
    }

    formEquipo.addEventListener("submit", function (evento) {
        evento.preventDefault();

        errorNombre.textContent = "";
        errorJuego.textContent = "";
        errorCapitan.textContent = "";

        const nombre = inputNombre.value.trim();
        const juegoId = selectJuego.value;
        const capitanId = selectCapitan.value;

        if (nombre.length < 3) {
            errorNombre.textContent =
                "El nombre debe tener al menos 3 caracteres.";
            return;
        }

        const repetido = EQUIPOS.some(
            equipo => equipo.nombre.toLowerCase() === nombre.toLowerCase()
        );

        if (repetido) {
            errorNombre.textContent =
                "Ya existe un equipo con ese nombre.";
            return;
        }

        const juego = JUEGOS.find(j => j.id === juegoId);

        if (!juego || juego.modalidad !== "Equipos") {
            errorJuego.textContent =
                "Debes seleccionar un juego con modalidad por equipos.";
            return;
        }

        if (!capitanId) {
            errorCapitan.textContent =
                "Debes seleccionar un capitán.";
            return;
        }

        const capitan = JUGADORES.find(j => j.id === capitanId);

        if (!capitan) {
            errorCapitan.textContent =
                "El capitán seleccionado no existe.";
            return;
        }

        if (capitan.sanciones.some(sancion => sancion.vigente)) {
            errorCapitan.textContent =
                "El capitán tiene una sanción vigente y no puede crear el equipo.";
            return;
        }

        equipoEnEdicion = {
            id: "e" + (EQUIPOS.length + 1),
            nombre: nombre,
            juegoId: juegoId,
            capitanId: capitanId,
            activo: true,
            integrantes: [
                {
                    jugadorId: capitanId,
                    rol: "Capitán"
                }
            ]
        };

        EQUIPOS.push(equipoEnEdicion);

        renderizarIntegrantes();
        llenarSelectorAgregarJugador();

        alert("Equipo creado correctamente.");
    });

    selectJuego.addEventListener("change", function () {
        llenarSelectorAgregarJugador();
    });

    btnAgregar.addEventListener("click", function () {
        errorAgregar.textContent = "";

        if (!equipoEnEdicion) {
            errorAgregar.textContent =
                "Primero debes crear un equipo.";
            return;
        }

        const idSeleccionado = selectAgregarJugador.value;

        if (!idSeleccionado) {
            errorAgregar.textContent =
                "Selecciona un jugador para agregar.";
            return;
        }

        if (jugadorEnEquipo(idSeleccionado)) {
            errorAgregar.textContent =
                "Ese jugador ya está en el equipo.";
            return;
        }

        equipoEnEdicion.integrantes.push({
            jugadorId: idSeleccionado,
            rol: "Titular"
        });

        renderizarIntegrantes();
        llenarSelectorAgregarJugador();
    });

    llenarSelectorJuegos();
    llenarSelectorCapitanes();
    llenarSelectorAgregarJugador();
    renderizarIntegrantes();
});
