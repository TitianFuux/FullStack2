document.addEventListener("DOMContentLoaded", () => {
  const elBusqueda = document.getElementById("busqueda");
  const elJuego = document.getElementById("juego");
  const elEstado = document.getElementById("estado");
  const elDesde = document.getElementById("desde");
  const elHasta = document.getElementById("hasta");
  const elError = document.getElementById("error");
  const elCatalogo = document.getElementById("catalogo");

  if (!elBusqueda || !elJuego || !elEstado || !elDesde || !elHasta || !elError || !elCatalogo) return;

  function crearTarjeta(torneo) {
    const juego = Datos.obtenerJuegoPorId(torneo.juegoId);
    return `
      <article class="tarjeta-torneo">
        <span class="pastilla pastilla--${torneo.estado}">${Datos.nombreEstado(torneo.estado)}</span>
        <h3>${torneo.nombre}</h3>
        <p class="juego">${juego ? juego.nombre : "Juego no disponible"} · ${torneo.modalidad}</p>
        <p class="etiqueta-dato">Cierre: ${torneo.fechaCierreInscripcion}</p>
        <p class="etiqueta-dato">Cupos: ${torneo.cupoOcupado} / ${torneo.cupoMaximo}</p>
      </article>`;
  }

  function filtrar() {
    const texto = elBusqueda.value.toLowerCase().trim();
    const juegoSeleccionado = elJuego.value;
    const estadoSeleccionado = elEstado.value;
    const desde = elDesde.value;
    const hasta = elHasta.value;

    if (desde && hasta && desde > hasta) {
      elError.textContent = "La fecha inicial no puede ser posterior a la fecha final.";
      elCatalogo.innerHTML = "";
      return;
    }
    elError.textContent = "";

    const resultados = TORNEOS.filter((torneo) => {
      const coincideNombre = torneo.nombre.toLowerCase().includes(texto);
      const coincideJuego = !juegoSeleccionado || juegoSeleccionado === "todos" || torneo.juegoId === juegoSeleccionado;
      const coincideEstado = !estadoSeleccionado || estadoSeleccionado === "todos" || torneo.estado === estadoSeleccionado;
      const coincideDesde = !desde || torneo.fechaInicio >= desde;
      const coincideHasta = !hasta || torneo.fechaInicio <= hasta;
      return coincideNombre && coincideJuego && coincideEstado && coincideDesde && coincideHasta;
    });

    elCatalogo.innerHTML = resultados.length
      ? resultados.map(crearTarjeta).join("")
      : "<p class='estado-vacio'>No se encontraron torneos con los criterios seleccionados.</p>";
  }

  [elBusqueda, elJuego, elEstado, elDesde, elHasta].forEach((elemento) => {
    elemento.addEventListener("input", filtrar);
    elemento.addEventListener("change", filtrar);
  });
  filtrar();
});
