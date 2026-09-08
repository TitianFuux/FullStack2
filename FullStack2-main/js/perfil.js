document.addEventListener("DOMContentLoaded", () => {
  const selector = document.getElementById("selector-jugador");
  selector.innerHTML = JUGADORES.map((j) => `<option value="${j.id}">${j.nombre} (${j.apodo})</option>`).join("");
  selector.addEventListener("change", () => renderizarFicha(selector.value));
  renderizarFicha(selector.value);

  const form = document.getElementById("form-perfil");
  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    validarFormularioPerfil();
  });
});

function renderizarFicha(jugadorId) {
  const jugador = Datos.obtenerJugadorPorId(jugadorId);
  if (!jugador) return;

  const iniciales = encodeURIComponent(jugador.nombre);
  document.getElementById("ficha-jugador").innerHTML = `
    <div style="display:flex; gap:1rem; align-items:center; margin-bottom:0.8rem;">
      <img
        src="https://ui-avatars.com/api/?name=${iniciales}&background=241B3D&color=F1ECFF&bold=true&size=96"
        alt="Foto de perfil de ${jugador.nombre}, apodo ${jugador.apodo}"
        width="72" height="72"
        style="border-radius:50%; border:2px solid var(--color-borde);">
      <div>
        <h2 style="margin-bottom:0.2rem;">${jugador.nombre}</h2>
        <p class="etiqueta-dato">@${jugador.apodo} · ${jugador.correo}</p>
      </div>
    </div>
    <div class="grilla-stats" style="max-width:320px; margin-top:0.8rem;">
      <div class="tarjeta-stat"><div class="valor">${jugador.estadisticas.victorias}</div><div class="rotulo">Victorias</div></div>
      <div class="tarjeta-stat"><div class="valor">${jugador.estadisticas.derrotas}</div><div class="rotulo">Derrotas</div></div>
    </div>
  `;

  const cuerpoHistorial = document.getElementById("cuerpo-historial");
  cuerpoHistorial.innerHTML = jugador.historial.length
    ? jugador.historial.map((h) => `<tr><td>${h.torneo}</td><td>${h.resultado}</td></tr>`).join("")
    : `<tr><td colspan="2">Sin torneos jugados todavía.</td></tr>`;

  const listaSanciones = document.getElementById("lista-sanciones");
  listaSanciones.innerHTML = jugador.sanciones.length
    ? jugador.sanciones.map((s) => `
        <li class="integrante">
          <span>${s.motivo}</span>
          <span class="pastilla" style="color:${s.vigente ? "var(--color-error)" : "var(--color-texto-tenue)"}">${s.vigente ? "Vigente" : "Cumplida"}</span>
        </li>`).join("")
    : `<li class="integrante"><span>Sin sanciones registradas.</span></li>`;

  document.getElementById("campo-apodo").dataset.original = jugador.apodo;
}

function validarFormularioPerfil() {
  const form = document.getElementById("form-perfil");
  limpiarErrores(form);
  let valido = true;

  const apodo = document.getElementById("campo-apodo").value.trim();
  const correo = document.getElementById("campo-correo").value.trim();
  const edad = document.getElementById("campo-edad").value;
  const clave = document.getElementById("campo-clave").value;
  const claveConfirmar = document.getElementById("campo-clave-confirmar").value;

  if (apodo) {
    if (/\s/.test(apodo)) {
      marcarError("grupo-apodo", "El apodo no puede contener espacios.");
      valido = false;
    } else if (apodo.length < 3 || apodo.length > 15) {
      marcarError("grupo-apodo", "El apodo debe tener entre 3 y 15 caracteres.");
      valido = false;
    }
  }

  const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (correo && !patronCorreo.test(correo)) {
    marcarError("grupo-correo", "Ingresa un correo con formato válido, ej: nombre@dominio.cl");
    valido = false;
  }

  if (edad && (Number(edad) < 13 || Number(edad) > 99)) {
    marcarError("grupo-edad", "La edad debe estar entre 13 y 99 años.");
    valido = false;
  }

  if (clave || claveConfirmar) {
    if (clave.length < 8) {
      marcarError("grupo-clave", "La contraseña debe tener al menos 8 caracteres.");
      valido = false;
    }
    if (clave !== claveConfirmar) {
      marcarError("grupo-clave-confirmar", "Las contraseñas no coinciden.");
      valido = false;
    }
  }

  if (!valido) return;

  const aviso = document.getElementById("confirmacion-perfil");
  aviso.textContent = "Datos de perfil actualizados correctamente.";
  aviso.classList.remove("oculto");
  document.getElementById("campo-clave").value = "";
  document.getElementById("campo-clave-confirmar").value = "";
}

function marcarError(idGrupo, mensaje) {
  const grupo = document.getElementById(idGrupo);
  grupo.classList.add("con-error");
  grupo.querySelector(".mensaje-error").textContent = mensaje;
}
function limpiarErrores(form) {
  form.querySelectorAll(".mensaje-error").forEach((el) => (el.textContent = ""));
  form.querySelectorAll(".con-error").forEach((el) => el.classList.remove("con-error"));
  document.getElementById("confirmacion-perfil").classList.add("oculto");
}
