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

  
    if (!form || !selectTipo || !selectEquipo) {
        console.error("Error: no se encontraron los elementos del formulario de inscripción.");
        return;
    }

    if (!torneo) {
        contenedorDetalle.innerHTML =
            "<p>No se encontró el torneo seleccionado.</p>";
        form.hidden = true;
        return;
    }

    const juegoDelTorneo = JUEGOS.find(j => j.id === torneo.juegoId);

    if (!juegoDelTorneo) {
        contenedorDetalle.innerHTML =
            "<p>No se encontro el juego asociado al torneo.</p>";
        form.hidden = true;
        return;
    }

    function cantidadInscritos() {
        return torneo.cupoOcupado +
            inscripciones.filter(i => i.torneoId === torneo.id).length;
    }

    function mostrarDetalleTorneo() {
        contenedorDetalle.innerHTML = `
            <p><strong>Torneo:</strong> ${torneo.nombre}</p>
            <p><strong>Juego:</strong> ${juegoDelTorneo.nombre}</p>
            <p><strong>Modalidad:</strong> ${torneo.modalidad}</p>
            <p><strong>Cupos:</strong> ${cantidadInscritos()} de ${torneo.cupoMaximo}</p>
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
        const equipos = EQUIPOS.filter(e =>
            e.juegoId === torneo.juegoId && e.activo
        );

        selectEquipo.innerHTML =
            '<option value="">Selecciona un equipo</option>' +
            equipos.map(e =>
                `<option value="${e.id}">${e.nombre}</option>`
            ).join("");

        if (equipos.length === 0) {
            selectEquipo.innerHTML =
                '<option value="">No hay equipos disponibles</option>';
        }
    }

    function mostrarError(texto) {
        mensajeBloqueo.textContent = texto;
        mensajeBloqueo.hidden = false;
    }

    selectTipo.addEventListener("change", function () {
        errorTipo.textContent = "";
        errorEquipo.textContent = "";
        mensajeBloqueo.hidden = true;

        if (selectTipo.value === "equipo") {
            contenedorEquipo.hidden = false;
            llenarSelectorDeEquipos();
        } else {
            contenedorEquipo.hidden = true;
            selectEquipo.value = "";
        }
    });

    form.addEventListener("submit", function (evento) {
        evento.preventDefault();

        errorTipo.textContent = "";
        errorEquipo.textContent = "";
        mensajeBloqueo.hidden = true;

        const tipo = selectTipo.value;
        const equipoId = selectEquipo.value;


        if (!tipo) {
            errorTipo.textContent =
                "Debes seleccionar el tipo de participante.";
            return;
        }

        if (tipo !== "equipo") {
            errorTipo.textContent =
                "Este torneo requiere inscripción por equipo.";
            return;
        }

        if (!equipoId) {
            errorEquipo.textContent =
                "Debes seleccionar un equipo.";
            return;
        }


        const hoy = new Date().toISOString().split("T")[0];

        if (hoy > torneo.fechaCierreInscripcion) {
            mostrarError(
                "El plazo de inscripción para este torneo ya cerró."
            );
            return;
        }


        if (torneo.estado !== "abierto") {
            mostrarError(
                "El torneo no está abierto para nuevas inscripciones."
            );
            return;
        }

        if (cantidadInscritos() >= torneo.cupoMaximo) {
            mostrarError(
                "Este torneo ya no tiene cupos disponibles."
            );
            return;
        }

        const equipo = EQUIPOS.find(e => e.id === equipoId);

        if (!equipo) {
            mostrarError("El equipo seleccionado no existe.");
            return;
        }


        if (!equipo.activo) {
            mostrarError("Este equipo está inactivo.");
            return;
        }


        if (equipo.integrantes.length <
            juegoDelTorneo.integrantesPorEquipo) {

            mostrarError(
                `El equipo necesita al menos ${juegoDelTorneo.integrantesPorEquipo} integrantes.`
            );
            return;
        }

        // 8. Capitán sancionado.
        const capitan = JUGADORES.find(
            j => j.id === equipo.capitanId
        );

        if (
            capitan &&
            capitan.sanciones &&
            capitan.sanciones.some(s => s.vigente)
        ) {
            mostrarError(
                `El capitán ${capitan.apodo} tiene una sanción vigente.`
            );
            return;
        }

        const yaInscrito =
            torneo.participantes.includes(equipo.nombre) ||
            inscripciones.some(
                i =>
                    i.torneoId === torneo.id &&
                    i.equipoId === equipo.id
            );

        if (yaInscrito) {
            mostrarError(
                "Este equipo ya está inscrito en este torneo."
            );
            return;
        }

    
        inscripciones.push({
            id: "i" + (inscripciones.length + 1),
            torneoId: torneo.id,
            tipo: "equipo",
            equipoId: equipo.id
        });

     
        form.hidden = true;
        confirmacion.hidden = false;

        detalleConfirmacion.textContent =
            `El equipo ${equipo.nombre} se inscribió correctamente en ${torneo.nombre}.`;

        mostrarDetalleTorneo();
    });

  
    mostrarDetalleTorneo();

    
    selectTipo.innerHTML =
        '<option value="">Selecciona una opción</option>' +
        '<option value="equipo">Equipo</option>';

});
