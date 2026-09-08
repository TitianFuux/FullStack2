const elBusqueda = document.getElementById("busqueda");
const elJuego = document.getElementById("juego");
const elEstado = document.getElementById("estado");
const elDesde = document.getElementById("desde");
const elHasta = document.getElementById("hasta");
const elError = document.getElementById("error");
const elCatalogo = document.getElementById("catalogo");

function crearTarjeta(torneo) {
    const nombresJuegos = {
        "1": "League of Legends",
        "2": "Valorant",
        "3": "Counter-Strike 2",
        "4": "Rocket League"
    };
    const nombreDelJuego = nombresJuegos[torneo.juego];

    return `
        <article class="tarjeta">
            <h3>${torneo.nombre}</h3>
            <p><strong>Juego:</strong> ${nombreDelJuego}</p>
            <p><strong>Modalidad:</strong> ${torneo.modalidad}</p>
            <p><strong>Estado:</strong> ${torneo.estado}</p>
            <p><strong>Cierre inscripción:</strong> ${torneo.fechaFin}</p>
            <p><strong>Cupos:</strong> ${torneo.cuposOcupados} / ${torneo.cupoMaximo}</p>
        </article>
    `;
}

function filtrar() {
    const texto = elBusqueda.value.toLowerCase().trim();
    const juegoSel = elJuego.value;
    const estadoSel = elEstado.value;
    const desdeVal = elDesde.value;
    const hastaVal = elHasta.value;

    if (desdeVal && hastaVal && desdeVal > hastaVal) {
        elError.textContent = "La fecha inicial no puede ser posterior a la fecha final.";
        elError.style.display = "block";
        elCatalogo.innerHTML = "";
        return;
    } else {
        elError.style.display = "none";
        elError.textContent = "";
    }

    const resultados = torneos.filter(torneo => {
        const coincideNombre = torneo.nombre.toLowerCase().includes(texto);
        const coincideJuego = juegoSel === "todos" || torneo.juego === juegoSel;
        const coincideEstado = estadoSel === "todos" || torneo.estado === estadoSel;

        let coincideFecha = true;
        if (desdeVal && torneo.fechaInicio < desdeVal) coincideFecha = false;
        if (hastaVal && torneo.fechaFin > hastaVal) coincideFecha = false;

        return coincideNombre && coincideJuego && coincideEstado && coincideFecha;
    });

    if (resultados.length === 0) {
        elCatalogo.innerHTML = "<p class='vacio'>No se encontraron torneos con los criterios seleccionados.</p>";
    } else {
        let html = "";
        resultados.forEach(torneo => {
            html += crearTarjeta(torneo);
        });
        elCatalogo.innerHTML = html;
    }
}

elBusqueda.addEventListener("input", filtrar);
elJuego.addEventListener("change", filtrar);
elEstado.addEventListener("change", filtrar);
elDesde.addEventListener("change", filtrar);
elHasta.addEventListener("change", filtrar);

filtrar();