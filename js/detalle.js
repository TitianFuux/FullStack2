document.addEventListener("DOMContentLoaded", () => {
  const parametros = new URLSearchParams(window.location.search);
  const id = parametros.get("id");
  const torneo = id ? Datos.obtenerTorneoPorId(id) : null;

  const contenedor = document.getElementById("contenedor-detalle");

  if (!torneo) {
    contenedor.innerHTML = `
      <p class="estado-vacio">
        No encontramos ese torneo. <a href="torneos.html">Vuelve al listado completo</a>.
      </p>`;
    return;
  }

  document.title = `eSports Arena Manager — ${torneo.nombre}`;
  renderizarEncabezado(torneo, contenedor);
  renderizarCuerpo(torneo, contenedor);
});

function renderizarEncabezado(torneo, contenedor) {
  const juego = Datos.obtenerJuegoPorId(torneo.juegoId);
  const encabezado = document.createElement("div");
  encabezado.innerHTML = `
    <img
      src="https://picsum.photos/seed/${torneo.juegoId}/640/220"
      alt="Imagen de portada del juego ${juego ? juego.nombre : "del torneo"}"
      style="width:100%; max-height:220px; object-fit:cover; border-radius:var(--radio-borde); border:1px solid var(--color-borde); margin-bottom:1rem;">
    <span class="pastilla pastilla--${torneo.estado}">${Datos.nombreEstado(torneo.estado)}</span>
    <h1>${torneo.nombre}</h1>
    <p>${torneo.descripcion}</p>
    <div class="grilla-stats" style="max-width: 640px; margin-bottom: 1.5rem;">
      <div class="tarjeta-stat"><div class="valor">${juego ? juego.nombre : "—"}</div><div class="rotulo">Juego</div></div>
      <div class="tarjeta-stat"><div class="valor">${torneo.cupoOcupado}/${torneo.cupoMaximo}</div><div class="rotulo">Cupos</div></div>
      <div class="tarjeta-stat"><div class="valor">${torneo.fechaInicio}</div><div class="rotulo">Inicio</div></div>
      <div class="tarjeta-stat"><div class="valor">${torneo.fechaCierreInscripcion}</div><div class="rotulo">Cierre inscripción</div></div>
    </div>
  `;
  contenedor.appendChild(encabezado);
}

function renderizarCuerpo(torneo, contenedor) {
  const columnas = document.createElement("div");
  columnas.className = "dos-columnas";

  const principal = document.createElement("div");
  if (torneo.estado === "finalizado") {
    principal.appendChild(crearSeccionVideoFinal(torneo));
  }
  principal.appendChild(crearSeccionParticipantes(torneo));
  principal.appendChild(crearSeccionLlaves(torneo));

  const lateral = document.createElement("div");
  lateral.appendChild(crearSeccionRanking(torneo));
  if (torneo.estado === "finalizado") {
    lateral.appendChild(crearSeccionPremios(torneo));
  }

  columnas.appendChild(principal);
  columnas.appendChild(lateral);
  contenedor.appendChild(columnas);
}

function crearSeccionParticipantes(torneo) {
  const seccion = document.createElement("section");
  seccion.setAttribute("aria-labelledby", "titulo-participantes");
  if (torneo.participantes.length === 0) {
    seccion.innerHTML = `<h2 id="titulo-participantes">Participantes inscritos</h2>
      <p class="estado-vacio">Aún no hay participantes inscritos en este torneo.</p>`;
    return seccion;
  }
  const items = torneo.participantes.map((p) => `<li class="integrante"><span>${p}</span></li>`).join("");
  seccion.innerHTML = `
    <h2 id="titulo-participantes">Participantes inscritos (${torneo.participantes.length})</h2>
    <ul class="lista-integrantes">${items}</ul>
  `;
  return seccion;
}

function crearSeccionLlaves(torneo) {
  const seccion = document.createElement("section");
  seccion.style.marginTop = "2rem";
  seccion.setAttribute("aria-labelledby", "titulo-llaves");

  if (torneo.rondas.length === 0) {
    seccion.innerHTML = `<h2 id="titulo-llaves">Llaves y calendario</h2>
      <p class="estado-vacio">Las llaves se publicarán una vez que el organizador programe las partidas.</p>`;
    return seccion;
  }

  const botonesRonda = torneo.rondas
    .map((r, i) => `<button type="button" data-ronda="${i}" aria-pressed="${i === 0}">Ronda ${r.numero}</button>`)
    .join("");

  seccion.innerHTML = `
    <h2 id="titulo-llaves">Llaves y calendario</h2>
    <div class="selector-rondas" role="group" aria-label="Seleccionar ronda">${botonesRonda}</div>
    <ul class="lista-partidas" id="lista-partidas"></ul>
  `;

  // La ronda visible se maneja como estado local en memoria (equivalente al useState de EP2).
  let rondaActiva = 0;

  function pintarRonda() {
    const listaPartidas = seccion.querySelector("#lista-partidas");
    listaPartidas.innerHTML = "";
    torneo.rondas[rondaActiva].partidas.forEach((partida) => {
      const li = document.createElement("li");
      li.className = "partida";
      li.innerHTML = `
        <span class="enfrentamiento">${partida.participanteA} vs ${partida.participanteB}</span>
        <span class="etiqueta-dato">${partida.horario}</span>
        <span class="pastilla">${partida.estado}</span>
        ${partida.resultado ? `<span class="etiqueta-dato">Resultado: ${partida.resultado}</span>` : ""}
      `;
      listaPartidas.appendChild(li);
    });
    seccion.querySelectorAll("[data-ronda]").forEach((boton) => {
      boton.setAttribute("aria-pressed", boton.dataset.ronda == rondaActiva);
    });
  }

  seccion.addEventListener("click", (evento) => {
    const boton = evento.target.closest("[data-ronda]");
    if (!boton) return;
    rondaActiva = Number(boton.dataset.ronda);
    pintarRonda();
  });

  // Primer pintado se hace después de insertar en el DOM real (ver más abajo).
  setTimeout(pintarRonda, 0);
  return seccion;
}

function crearSeccionRanking(torneo) {
  const seccion = document.createElement("section");
  seccion.setAttribute("aria-labelledby", "titulo-ranking");

  if (torneo.ranking.length === 0) {
    seccion.innerHTML = `<h2 id="titulo-ranking">Tabla de posiciones</h2>
      <p class="estado-vacio">La tabla se calculará cuando existan resultados validados.</p>`;
    return seccion;
  }

  const filas = torneo.ranking
    .slice()
    .sort((a, b) => b.puntos - a.puntos || b.diferencia - a.diferencia)
    .map((fila, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${fila.participante}</td>
        <td>${fila.puntos}</td>
        <td>${fila.diferencia > 0 ? "+" : ""}${fila.diferencia}</td>
      </tr>
    `).join("");

  seccion.innerHTML = `
    <h2 id="titulo-ranking">Tabla de posiciones</h2>
    <div class="tabla-envoltorio">
      <table>
        <thead><tr><th scope="col">#</th><th scope="col">Participante</th><th scope="col">Pts</th><th scope="col">Dif.</th></tr></thead>
        <tbody>${filas}</tbody>
      </table>
    </div>
  `;
  return seccion;
}

function crearSeccionPremios(torneo) {
  const seccion = document.createElement("section");
  seccion.style.marginTop = "2rem";
  seccion.setAttribute("aria-labelledby", "titulo-premios");

  const items = torneo.premios.map((p) => `
    <li class="integrante"><span>${p.posicion}</span><span class="etiqueta-dato">${p.premio}</span></li>
  `).join("");

  seccion.innerHTML = `
    <h2 id="titulo-premios">Premios</h2>
    <ul class="lista-integrantes">${items}</ul>
  `;
  return seccion;
}
