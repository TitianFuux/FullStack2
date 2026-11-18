import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Perfil() {
  const { usuario, estaAutenticado, esAdmin, actualizarUsuarioLocal } = useAuth();

  const [jugadores, setJugadores] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [seleccionadoId, setSeleccionadoId] = useState('');

  const [apodo, setApodo] = useState('');
  const [correo, setCorreo] = useState('');
  const [edad, setEdad] = useState(20);
  const [password, setPassword] = useState('');

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [listaJugadores, listaEquipos] = await Promise.all([
        api.obtenerJugadores(),
        api.obtenerEquipos(),
      ]);
      setJugadores(listaJugadores);
      setEquipos(listaEquipos);

      if (!seleccionadoId && listaJugadores.length > 0) {
        const inicial = usuario
          ? listaJugadores.find((j) => j.id === usuario.id) || listaJugadores[0]
          : listaJugadores[0];
        setSeleccionadoId(String(inicial.id));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const perfilActual = jugadores.find((j) => String(j.id) === String(seleccionadoId));

  useEffect(() => {
    if (perfilActual) {
      setApodo(perfilActual.apodo || '');
      setCorreo(perfilActual.correo || '');
      setEdad(perfilActual.edad || 20);
      setPassword('');
      setError('');
      setMensajeExito('');
    }
  }, [seleccionadoId, jugadores]);

  const puedeEditar =
    estaAutenticado && perfilActual && (esAdmin || usuario?.id === perfilActual.id);

  const equiposDelJugador = perfilActual
    ? equipos.filter(
        (eq) =>
          eq.capitan?.id === perfilActual.id ||
          eq.integrantes?.some((i) => i.usuario?.id === perfilActual.id)
      )
    : [];

  const manejarGuardar = async (e) => {
    e.preventDefault();
    if (!perfilActual) return;

    setError('');
    setMensajeExito('');
    setGuardando(true);

    try {
      const payload = {
        apodo,
        correo,
        edad: Number(edad),
        ...(password.trim() ? { password } : {}),
      };

      const actualizado = await api.actualizarJugador(perfilActual.id, payload);
      if (usuario && usuario.id === actualizado.id) {
        actualizarUsuarioLocal(actualizado);
      }
      setPassword('');
      setMensajeExito('Datos del perfil actualizados correctamente.');
      await cargarDatos();
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <main id="contenido-principal">
      <section className="franja">
        <div className="contenedor" style={{ maxWidth: '820px' }}>
          <h1>Perfil Competitivo</h1>
          <p>Consulta estadísticas, equipos e historial disciplinario de los jugadores.</p>

          {cargando ? (
            <p style={{ marginTop: '1.5rem' }}>Cargando fichas de jugadores...</p>
          ) : jugadores.length === 0 ? (
            <p className="estado-vacio">No hay jugadores registrados.</p>
          ) : (
            <>
              <div style={{ margin: '1.5rem 0' }}>
                <label htmlFor="selector-perfil">Seleccionar jugador</label>
                <select
                  id="selector-perfil"
                  value={seleccionadoId}
                  onChange={(e) => setSeleccionadoId(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', marginTop: '0.4rem' }}
                >
                  {jugadores.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.apodo} — {j.nombre} ({j.rol})
                    </option>
                  ))}
                </select>
              </div>

              {perfilActual && (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  <article className="tarjeta-torneo">
                    <span className="pastilla pastilla--abierto">{perfilActual.rol}</span>
                    <h2 style={{ marginTop: '0.6rem' }}>{perfilActual.apodo}</h2>
                    <p className="juego">
                      {perfilActual.nombre} · {perfilActual.correo} · {perfilActual.edad} años
                    </p>

                    <div className="fila-meta">
                      <span>Partidas ganadas</span>
                      <strong style={{ color: '#00F5D4' }}>{perfilActual.victorias ?? 0}</strong>
                    </div>
                    <div className="fila-meta">
                      <span>Partidas perdidas</span>
                      <span>{perfilActual.derrotas ?? 0}</span>
                    </div>
                    <div className="fila-meta">
                      <span>Equipos actuales</span>
                      <span>
                        {equiposDelJugador.length
                          ? equiposDelJugador.map((e) => e.nombre).join(', ')
                          : 'Sin equipo asignado'}
                      </span>
                    </div>
                  </article>

                  <article className="tarjeta-torneo">
                    <h3>Historial de Sanciones</h3>
                    {!perfilActual.sanciones || perfilActual.sanciones.length === 0 ? (
                      <p style={{ color: '#00F5D4', marginTop: '0.5rem' }}>
                        ✔ Jugador sin sanciones disciplinarias.
                      </p>
                    ) : (
                      <ul style={{ listStyle: 'none', padding: 0, marginTop: '0.75rem', display: 'grid', gap: '0.5rem' }}>
                        {perfilActual.sanciones.map((s) => (
                          <li
                            key={s.id}
                            style={{
                              padding: '0.65rem',
                              borderRadius: '6px',
                              background: s.vigente ? 'rgba(255, 92, 122, 0.15)' : 'rgba(255,255,255,0.05)',
                              borderLeft: `4px solid ${s.vigente ? '#FF5C7A' : '#00F5D4'}`,
                            }}
                          >
                            <strong>{s.vigente ? '⚠ SANCIÓN VIGENTE:' : 'Cumplida:'}</strong> {s.motivo} ({s.duracion})
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>

                  {puedeEditar && (
                    <form onSubmit={manejarGuardar} className="tarjeta-torneo" style={{ display: 'grid', gap: '1rem' }}>
                      <h3>Editar Datos de Perfil</h3>

                      <div>
                        <label htmlFor="edit-apodo">Apodo (3 a 15 caracteres sin espacios)</label>
                        <input
                          id="edit-apodo"
                          type="text"
                          required
                          minLength={3}
                          maxLength={15}
                          value={apodo}
                          onChange={(e) => setApodo(e.target.value)}
                          style={{ width: '100%', padding: '0.6rem', marginTop: '0.35rem' }}
                        />
                      </div>

                      <div>
                        <label htmlFor="edit-correo">Correo electrónico</label>
                        <input
                          id="edit-correo"
                          type="email"
                          required
                          value={correo}
                          onChange={(e) => setCorreo(e.target.value)}
                          style={{ width: '100%', padding: '0.6rem', marginTop: '0.35rem' }}
                        />
                      </div>

                      <div>
                        <label htmlFor="edit-edad">Edad</label>
                        <input
                          id="edit-edad"
                          type="number"
                          required
                          min={13}
                          max={99}
                          value={edad}
                          onChange={(e) => setEdad(e.target.value)}
                          style={{ width: '100%', padding: '0.6rem', marginTop: '0.35rem' }}
                        />
                      </div>

                      <div>
                        <label htmlFor="edit-pass">Nueva contraseña (dejar vacío para mantener actual)</label>
                        <input
                          id="edit-pass"
                          type="password"
                          minLength={8}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Mínimo 8 caracteres"
                          style={{ width: '100%', padding: '0.6rem', marginTop: '0.35rem' }}
                        />
                      </div>

                      {error && (
                        <p role="alert" style={{ color: '#FF5C7A', fontWeight: 600, margin: 0 }}>
                          ⚠ {error}
                        </p>
                      )}

                      {mensajeExito && (
                        <p role="status" style={{ color: '#00F5D4', fontWeight: 600, margin: 0 }}>
                          ✔ {mensajeExito}
                        </p>
                      )}

                      <button type="submit" className="boton" disabled={guardando}>
                        {guardando ? 'Guardando cambios...' : 'Guardar Cambios'}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}