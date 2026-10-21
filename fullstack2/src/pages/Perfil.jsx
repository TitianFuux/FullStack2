import React, { useState } from 'react';
import { JUGADORES, Datos } from '../data/datos';

export default function Perfil() {
  const [jugadorId, setJugadorId] = useState(JUGADORES[0]?.id || '');
  const [apodo, setApodo] = useState('');
  const [correo, setCorreo] = useState('');
  const [edad, setEdad] = useState('');
  const [clave, setClave] = useState('');
  const [claveConfirmar, setClaveConfirmar] = useState('');
  const [errores, setErrores] = useState({});
  const [mensajeExito, setMensajeExito] = useState('');

  const jugador = Datos.obtenerJugadorPorId(jugadorId);

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevosErrores = {};

    if (apodo) {
      if (/\s/.test(apodo)) nuevosErrores.apodo = "El apodo no puede contener espacios.";
      else if (apodo.length < 3 || apodo.length > 15) nuevosErrores.apodo = "El apodo debe tener entre 3 y 15 caracteres.";
    }

    const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (correo && !patronCorreo.test(correo)) {
      nuevosErrores.correo = "Ingresa un correo con formato válido, ej: nombre@dominio.cl";
    }

    if (edad && (Number(edad) < 13 || Number(edad) > 99)) {
      nuevosErrores.edad = "La edad debe estar entre 13 y 99 años.";
    }

    if (clave || claveConfirmar) {
      if (clave.length < 8) nuevosErrores.clave = "La contraseña debe tener al menos 8 caracteres.";
      if (clave !== claveConfirmar) nuevosErrores.claveConfirmar = "Las contraseñas no coinciden.";
    }

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length === 0) {
      setMensajeExito("Datos de perfil actualizados correctamente.");
      setApodo('');
      setCorreo('');
      setEdad('');
      setClave('');
      setClaveConfirmar('');
    } else {
      setMensajeExito('');
    }
  };

  return (
    <main id="contenido-principal">
      <section className="franja">
        <div className="contenedor">
          <h1>Perfil de jugador</h1>

          <div className="campo" style={{ maxWidth: '320px', marginBottom: '1.5rem' }}>
            <label htmlFor="selector-jugador">Ver ficha de</label>
            <select id="selector-jugador" value={jugadorId} onChange={(e) => setJugadorId(e.target.value)}>
              {JUGADORES.map((j) => (
                <option key={j.id} value={j.id}>{j.nombre} ({j.apodo})</option>
              ))}
            </select>
          </div>

          {jugador && (
            <div className="dos-columnas">
              <div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.8rem' }}>
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(jugador.nombre)}&background=241B3D&color=F1ECFF&bold=true&size=96`}
                    alt={`Perfil de ${jugador.nombre}`} width="72" height="72" style={{ borderRadius: '50%', border: '2px solid var(--color-borde)' }}
                  />
                  <div>
                    <h2 style={{ marginBottom: '0.2rem' }}>{jugador.nombre}</h2>
                    <p className="etiqueta-dato">@{jugador.apodo} · {jugador.correo}</p>
                  </div>
                </div>

                <div className="grilla-stats" style={{ maxWidth: '320px', marginTop: '0.8rem' }}>
                  <div className="tarjeta-stat"><div className="valor">{jugador.estadisticas.victorias}</div><div className="rotulo">Victorias</div></div>
                  <div className="tarjeta-stat"><div className="valor">{jugador.estadisticas.derrotas}</div><div className="rotulo">Derrotas</div></div>
                </div>

                <h2 style={{ marginTop: '2rem' }}>Historial de torneos</h2>
                <div className="tabla-envoltorio">
                  <table>
                    <thead><tr><th>Torneo</th><th>Resultado</th></tr></thead>
                    <tbody>
                      {jugador.historial.length ? (
                        jugador.historial.map((h, i) => <tr key={i}><td>{h.torneo}</td><td>{h.resultado}</td></tr>)
                      ) : (
                        <tr><td colSpan="2">Sin torneos jugados todavía.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <h2 style={{ marginTop: '2rem' }}>Sanciones</h2>
                <ul className="lista-integrantes">
                  {jugador.sanciones.length ? (
                    jugador.sanciones.map((s, i) => (
                      <li className="integrante" key={i}>
                        <span>{s.motivo}</span>
                        <span className="pastilla" style={{ color: s.vigente ? "var(--color-error)" : "var(--color-texto-tenue)" }}>
                          {s.vigente ? "Vigente" : "Cumplida"}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="integrante"><span>Sin sanciones registradas.</span></li>
                  )}
                </ul>
              </div>

              <div>
                <h2>Editar datos de contacto</h2>
                <form className="formulario" onSubmit={handleSubmit} noValidate>
                  <div className={`campo ${errores.apodo ? 'con-error' : ''}`}>
                    <label htmlFor="campo-apodo">Apodo</label>
                    <input type="text" id="campo-apodo" value={apodo} onChange={(e) => setApodo(e.target.value)} placeholder={jugador.apodo} />
                    {errores.apodo && <span className="mensaje-error">{errores.apodo}</span>}
                  </div>

                  <div className={`campo ${errores.correo ? 'con-error' : ''}`}>
                    <label htmlFor="campo-correo">Correo electrónico</label>
                    <input type="email" id="campo-correo" value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder={jugador.correo} />
                    {errores.correo && <span className="mensaje-error">{errores.correo}</span>}
                  </div>

                  <div className={`campo ${errores.edad ? 'con-error' : ''}`}>
                    <label htmlFor="campo-edad">Edad</label>
                    <input type="number" id="campo-edad" value={edad} onChange={(e) => setEdad(e.target.value)} placeholder="18 a 99 años" />
                    {errores.edad && <span className="mensaje-error">{errores.edad}</span>}
                  </div>

                  <div className={`campo ${errores.clave ? 'con-error' : ''}`}>
                    <label htmlFor="campo-clave">Nueva contraseña</label>
                    <input type="password" id="campo-clave" value={clave} onChange={(e) => setClave(e.target.value)} />
                    {errores.clave && <span className="mensaje-error">{errores.clave}</span>}
                  </div>

                  <div className={`campo ${errores.claveConfirmar ? 'con-error' : ''}`}>
                    <label htmlFor="campo-clave-confirmar">Confirmar contraseña</label>
                    <input type="password" id="campo-clave-confirmar" value={claveConfirmar} onChange={(e) => setClaveConfirmar(e.target.value)} />
                    {errores.claveConfirmar && <span className="mensaje-error">{errores.claveConfirmar}</span>}
                  </div>

                  {mensajeExito && <div className="aviso aviso--exito">{mensajeExito}</div>}
                  <button type="submit" className="boton boton-primario">Guardar cambios</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}