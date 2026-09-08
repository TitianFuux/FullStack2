/* Vista Listado de torneos: filtros por juego, estado, rango de fechas y buscador por nombre. */
document.addEventListener("DOMContentLoaded", () => {
  poblarSelectorJuegos();
  aplicarFiltros();

  document.getElementById("form-filtros").addEventListener("input", aplicarFiltros);
  document.getElementById("boton-limpiar").addEventListener("click", limpiarFiltros);
});

function poblarSelectorJuegos() {
  const select = document.getElementById("filtro-juego");
  JUEGOS.forEach((juego) => {
    const opcion = document.createElement("option");
    opcion.value = juego.id;
    opcion.textContent = juego.nombre;
    select.appendChild(opcion);
  });
}

function aplicarFiltros() {
  const busqueda = document.getElementById("filtro-busqueda").value.trim().toLowerCase();
  const juegoId = document.getElementById("filtro-juego").value;
  const estado = document.getElementById("filtro-estado").value;
  const desde = document.getElementById("filtro-desde").value;
  const hasta = document.getElementById("filtro-hasta").value;
  const errorRango = document.getElementById("error-rango-fechas");

  // Validación: la fecha inicial no puede ser posterior a la final.
  if (desde && hasta && desde > hasta) {
    errorRango.textContent = "La fecha inicial no puede ser posterior a la final.";
    renderizarTorneos([]);
    return;
  }
  errorRango.textContent = "";

  const resultado = TORNEOS.filter((torneo) => {
    const coincideNombre = torneo.nombre.toLowerCase().includes(busqueda);
    const coincideJuego = !juegoId || torneo.juegoId === juegoId;
    const coincideEstado = !estado || torneo.estado === estado;
    const coincideDesde = !desde || torneo.fechaInicio >= desde;
    const coincideHasta = !hasta || torneo.fechaInicio <= hasta;
    return coincideNombre && coincideJuego && coincideEstado && coincideDesde && coincideHasta;
  });

  renderizarTorneos(resultado);
}

function renderizarTorneos(lista) {
  const contenedor = document.getElementById("lista-torneos");
  contenedor.innerHTML = "";

  if (lista.length === 0) {
    contenedor.innerHTML = `
      <p class="estado-vacio">
        Ningún torneo cumple con los filtros seleccionados. Prueba ampliando el rango de fechas o el estado.
      </p>`;
    return;
  }

  lista.forEach((torneo) => {
    const juego = Datos.obtenerJuegoPorId(torneo.juegoId);
    const porcentaje = Math.min(100, Math.round((torneo.cupoOcupado / torneo.cupoMaximo) * 100));

    const articulo = document.createElement("article");
    articulo.className = "tarjeta-torneo";
    articulo.innerHTML = `
      <span class="pastilla pastilla--${torneo.estado}">${Datos.nombreEstado(torneo.estado)}</span>
      <h3>${torneo.nombre}</h3>
      <p class="juego">${juego ? juego.nombre : "—"} · ${torneo.modalidad}</p>
      <div>
        <div class="barra-cupo" role="img" aria-label="${torneo.cupoOcupado} de ${torneo.cupoMaximo} cupos ocupados">
          <span style="width:${porcentaje}%"></span>
        </div>
        <p class="etiqueta-dato">${torneo.cupoOcupado} / ${torneo.cupoMaximo} cupos</p>
      </div>
      <div class="fila-meta">
        <span>Cierra inscripción</span>
        <span>${torneo.fechaCierreInscripcion}</span>
      </div>
      <a class="boton boton-secundario" href="torneo-detalle.html?id=${torneo.id}">Ver detalle</a>
    `;
    contenedor.appendChild(articulo);
  });
}

function limpiarFiltros() {
  document.getElementById("form-filtros").reset();
  document.getElementById("error-rango-fechas").textContent = "";
  aplicarFiltros();
}
