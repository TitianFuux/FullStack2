const contenedorDestacados = document.getElementById("destacados");
const contenedorCierres = document.getElementById("cierres");

function crearTarjeta(torneo) {
  const juego = Datos.obtenerJuegoPorId(torneo.juegoId);
  return `
    <article class="tarjeta-torneo">
      <span class="pastilla pastilla--${torneo.estado}">${Datos.nombreEstado(torneo.estado)}</span>
      <h3>${torneo.nombre}</h3>
      <p class="juego">${juego ? juego.nombre : "Juego no disponible"} · ${torneo.modalidad}</p>
      <div class="fila-meta">
        <span>Cierra inscripción</span>
        <span>${torneo.fechaCierreInscripcion}</span>
      </div>
      <a class="boton boton-secundario" href="torneo-detalle.html?id=${torneo.id}">Ver detalle</a>
    </article>`;
}

function mostrarTorneos(contenedor, torneos) {
  contenedor.innerHTML = torneos.length
    ? torneos.map(crearTarjeta).join("")
    : '<p class="estado-vacio">No hay torneos disponibles.</p>';
}

const abiertos = TORNEOS.filter((torneo) => torneo.estado === "abierto");
mostrarTorneos(contenedorDestacados, TORNEOS.slice(0, 3));
mostrarTorneos(contenedorCierres, abiertos);