const contenedorDestacados = document.getElementById("destacados");
const contenedorCierres = document.getElementById("cierres");

function crearTarjeta(torneo) {
    const nombresJuegos = {
        "1": "League of Legends",
        "2": "Valorant",
        "3": "Counter-Strike 2",
        "4": "Rocekt League"
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

function mostrarDestacados() {
    const listaDestacados = torneos.filter(torneo => torneo.destacado === true);
    let html = "";
    
    listaDestacados.forEach(torneo => {
        html += crearTarjeta(torneo);
    });

    contenedorDestacados.innerHTML = html;
}

function mostrarCierres() {
    const listaCierres = torneos.filter(torneo => torneo.estado === "ABIERTO");
    let html = "";

    listaCierres.forEach(torneo => {
        html += crearTarjeta(torneo);
    });

    contenedorCierres.innerHTML = html;
}

//aaa

mostrarDestacados();
mostrarCierres();