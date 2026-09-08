document.addEventListener("DOMContentLoaded", function () {
    const torneoActualId = "t1";
    const torneo = TORNEOS.find(t => t.id === torneoActualId);

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

    if (!torneo) {
        contenedorDetalle.innerHTML =
            "<p>No se encontró el torneo seleccionado.</p>";
        form.hidden = true;
        return;
    }

    const juegoDelTorneo = JUEGOS.find(j => j.id === torneo.juegoId);

    function mostrarDetalleTorneo() {
        const inscritos = torneo.cupoOcupado + inscripciones.filter(
            inscripcion => inscripcion.torneoId === torneo.id
        ).length;

        contenedorDetalle.innerHTML = `
            <p><strong>Torneo:</strong> ${torneo.nombre}</p>
            <p><strong>Juego:</strong> ${juegoDelTorneo.nombre}</p>
            <p><strong>Modalidad:</strong> ${torneo.modalidad}</p>
            <p><strong>Cupos:</strong> ${inscritos} de ${torneo.cupoMaximo}</p>
            <p><strong>Cierre de inscripción:</strong> ${torneo.fechaCierreInscripcion}</p>
            <p>${torneo.descripcion}</p>
        `;

        listaRequisitos.innerHTML = `
            <li>Modalidad: ${torneo.modalidad}</li>
            <li>Integrantes mínimos por equipo: ${juegoDelTorneo.integrantesPorEquipo}</li>
            <li>Cupo máximo: ${torneo.cupoMaximo}</li>
        `;
    }

    function llenarSelectorDeEquipos() {
        const equiposDisponibles = EQUIPOS.filter(
            equipo =>
                equipo.juegoId === torneo.juegoId &&
                equipo.activo
        );

        selectEquipo.innerHTML =
            '<option value="">Selecciona un equipo</option>' +
            equiposDisponibles.map(equipo =>
                `<option value="${equipo.id}">${equipo.nombre}</option>`
            ).join("");
    }

    selectTipo.addEventListener("change", function () {
        errorTipo.textContent = "";

        if (selectTipo.value === "equipo") {
            contenedorEquipo.hidden = false;
            llenarSelectorDeEquipos();
        } else {
            contenedorEquipo.hidden = true;
            selectEquipo.value = "";
        }
    });

    function validarInscripcion(equipoId) {
        const errores = [];
        const hoy = new Date().toISOString().split("T")[0];

        if (hoy > torneo.fechaCierreInscripcion) {
            errores.push(
                "El plazo de inscripción para este torneo ya cerró."
            );
        }

        if (torneo.estado !== "abierto") {
            errores.push(
                "Este torneo no está abierto para inscripciones."
            );
        }

        const inscritos = torneo.cupoOcupado + inscripciones.filter(
            inscripcion => inscripcion.torneoId === torneo.id
        ).length;

        if (inscritos >= torneo.cupoMaximo) {
            errores.push("Este torneo ya no tiene cupos disponibles.");
        }

        const equipo = EQUIPOS.find(e => e.id === equipoId);

        if (!equipo) {
            errores.push("El equipo seleccionado no existe.");
            return errores;
        }

        if (!equipo.activo) {
            errores.push("Este equipo está inactivo.");
        }

        if (equipo.integrantes.length <
            juegoDelTorneo.integrantesPorEquipo) {
            errores.push(
                `El equipo necesita al menos ${juegoDelTorneo.integrantesPorEquipo} integrantes.`
            );
        }

        const capitan = JUGADORES.find(j => j.id === equipo.capitanId);

        if (
            capitan &&
            capitan.sanciones.some(sancion => sancion.vigente)
        ) {
            errores.push(
                `El capitán ${capitan.apodo} tiene una sanción vigente.`
            );
        }

        const yaInscrito = torneo.participantes.includes(equipo.nombre) ||
            inscripciones.some(
                inscripcion =>
                    inscripcion.torneoId === torneo.id &&
                    inscripcion.equipoId === equipo.id
            );

        if (yaInscrito) {
            errores.push("Este equipo ya está inscrito en este torneo.");
        }

        return errores;
    }

    form.addEventListener("submit", function (evento) {
        evento.preventDefault();

        errorTipo.textContent = "";
        errorEquipo.textContent = "";
        mensajeBloqueo.hidden = true;

        if (selectTipo.value === "") {
            errorTipo.textContent =
                "Debes seleccionar cómo te inscribirás.";
            return;
        }

        if (selectTipo.value !== "equipo") {
            errorTipo.textContent =
                "Este torneo requiere inscripción por equipo.";
            return;
        }

        if (selectEquipo.value === "") {
            errorEquipo.textContent =
                "Debes seleccionar tu equipo.";
            return;
        }

        const errores = validarInscripcion(selectEquipo.value);

        if (errores.length > 0) {
            mensajeBloqueo.textContent = errores.join(" ");
            mensajeBloqueo.hidden = false;
            return;
        }

        const equipo = EQUIPOS.find(
            e => e.id === selectEquipo.value
        );

        inscripciones.push({
            id: "i" + (inscripciones.length + 1),
            torneoId: torneo.id,
            tipo: "equipo",
            equipoId: equipo.id
        });

        form.hidden = true;
        confirmacion.hidden = false;

        detalleConfirmacion.textContent =
            `${equipo.nombre} se inscribió correctamente en ${torneo.nombre}.`;
    });

    mostrarDetalleTorneo();

    // Para este torneo, que es por equipos.
    selectTipo.innerHTML =
        '<option value="">Selecciona una opción</option>' +
        '<option value="equipo">Equipo</option>';
});
