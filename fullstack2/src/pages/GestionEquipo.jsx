import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function GestionEquipo() {
  const { usuario, estaAutenticado, esAdmin } = useAuth();

  const [equipos, setEquipos] = useState([]);
  const [juegos, setJuegos] = useState([]);
  const [jugadores, setJugadores] = useState([]);

  const [nombreEquipo, setNombreEquipo] = useState('');
  const [juegoId, setJuegoId] = useState('');
  const [capitanId, setCapitanId] = useState('');

  const [seleccionIntegrante, setSeleccionIntegrante] = useState({});

  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [listaEquipos, listaJuegos, listaJugadores] = await Promise.all([
        api.obtenerEquipos(),
        api.obtenerJuegos(),
        api.obtenerJugadores(),
      ]);
      setEquipos(listaEquipos);
      setJuegos(listaJuegos.filter((j) => j.modalidad?.toLowerCase() === 'equipos'));
      setJugadores(listaJugadores);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    if (usuario && !capitanId) {
      setCapitanId(String(usuario.id));
    }
  }, [usuario]);

  const manejarCrearEquipo = async (e) => {
    e.preventDefault();
    setError('');
    setMensajeExito('');
    setProcesando(true);

    try {
      await api.crearEquipo({
        nombre: nombreEquipo,
        juegoId: Number(juegoId),
        capitanId: Number(esAdmin && capitanId ? capitanId : usuario.id),
      });
      setNombreEquipo('');
      setJuegoId('');
      setMensajeExito('¡Equipo creado exitosamente!');
      await cargarDatos();
    } catch (err) {
      setError(err.message);
    } finally {
      setProcesando(false);
    }
  };

  const actualizarSeleccion = (equipoId, campo, valor) => {
    setSeleccionIntegrante((prev) => ({
      ...prev,
      [equipoId]: {
        usuarioId: prev[equipoId]?.usuarioId || '',
        rolEquipo: prev[equipoId]?.rolEquipo || 'Titular',
        [campo]: valor,
      },
    }));
  };

  const manejarAgregarIntegrante = async (equipoId) => {
    const sel = seleccionIntegrante[equipoId];
    if (!sel?.usuarioId) {
      setError('Selecciona un jugador antes de agregarlo a la plantilla.');
      return;
    }

    setError('');
    setMensajeExito('');
    setProcesando(true);

    try {
      await api.agregarIntegrante(equipoId, {
        usuarioId: Number(sel.usuarioId),
        rolEquipo: sel.rolEquipo || 'Titular',
      });
      actualizarSeleccion(equipoId, 'usuarioId', '');
      setMensajeExito('Integrante agregado a la plantilla.');
      await cargarDatos();
    } catch (err) {
      setError(err.message);
    } finally {
      setProcesando(false);
    }
  };

  const manejarQuitarIntegrante = async (equipoId, usuarioId) => {
    setError('');
    setMensajeExito('');
    setProcesando(true);

    try {
      await api.quitarIntegrante(equipoId, usuarioId);
      setMensajeExito('Integrante eliminado de la plantilla.');
      await cargarDatos();
    } catch (err) {
      setError(err.message);
    } finally {
      setProcesando(false);
    }
  };

  return (
    <main id="contenido-principal">
      <section className="franja">
        <div className="contenedor">
          <h1>Gestión de Equipos</h1>
          <p>Crea tu escuadra competitiva, asigna titulares o suplentes y revisa los rosters activos.</p>

          {error && (
            <p role="alert" style={{ color: '#FF5C7A', fontWeight: 600, margin: '1rem 0' }}>
              ⚠ {error}
            </p>
          )}

          {mensajeExito && (
            <p role="status" style={{ color: '#00F5D4', fontWeight: 600, margin: '1rem 0' }}>
              ✔ {mensajeExito}
            </p>
          )}

          {estaAutenticado ? (
            <form
              onSubmit={manejarCrearEquipo}
              className="tarjeta-torneo"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                margin: '1.5rem 0 2.5rem',
                alignItems: 'end',
              }}
            >
              <div>
                <label htmlFor="nombre-equipo">Nombre del nuevo equipo</label>
                <input
                  id="nombre-equipo"
                  type="text"
                  required
                  minLength={3}
                  maxLength={80}
                  value={nombreEquipo}
                  onChange={(e) => setNombreEquipo(e.target.value)}
                  placeholder="Ej: Titans CL"
                  style={{ width: '100%', padding: '0.6rem', marginTop: '0.35rem' }}
                />
              </div>

              <div>
                <label htmlFor="juego-equipo">Videojuego principal</label>
                <select
                  id="juego-equipo"
                  required
                  value={juegoId}
                  onChange={(e) => setJuegoId(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', marginTop: '0.35rem' }}
                >
                  <option value="">-- Selecciona juego --</option>
                  {juegos.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.nombre} (Máx. {j.integrantesPorEquipo} jug.)
                    </option>
                  ))}
                </select>
              </div>

              {esAdmin && (
                <div>
                  <label htmlFor="capitan-equipo">Capitán asignado</label>
                  <select
                    id="capitan-equipo"
                    required
                    value={capitanId}
                    onChange={(e) => setCapitanId(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', marginTop: '0.35rem' }}
                  >
                    {jugadores.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.apodo} ({j.nombre})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <button type="submit" className="boton" disabled={procesando} style={{ width: '100%' }}>
                  {procesando ? 'Guardando...' : 'Crear Equipo'}
                </button>
              </div>
            </form>
          ) : (
            <div className="tarjeta-torneo" style={{ margin: '1.5rem 0 2rem', textAlign: 'center' }}>
              <p style={{ marginBottom: '0.75rem' }}>
                Inicia sesión para crear un equipo o administrar tu plantilla.
              </p>
              <Link to="/login" className="boton">
                Iniciar Sesión
              </Link>
            </div>
          )}

          <h2>Equipos Registrados</h2>
          {cargando ? (
            <p>Cargando equipos...</p>
          ) : equipos.length === 0 ? (
            <p className="estado-vacio">Aún no hay equipos registrados.</p>
          ) : (
            <div className="grilla-tarjetas" style={{ marginTop: '1rem' }}>
              {equipos.map((eq) => {
                const puedeEditar =
                  estaAutenticado && (esAdmin || eq.capitan?.id === usuario?.id);
                const maxIntegrantes = eq.juego?.integrantesPorEquipo || 5;
                const idsEnEquipo = new Set(eq.integrantes?.map((i) => i.usuario?.id) || []);
                const disponibles = jugadores.filter((j) => !idsEnEquipo.has(j.id));

                return (
                  <article className="tarjeta-torneo" key={eq.id}>
                    <span className={`pastilla ${eq.activo ? 'pastilla--abierto' : 'pastilla--finalizado'}`}>
                      {eq.activo ? 'Activo' : 'Inactivo'}
                    </span>
                    <h3 style={{ marginTop: '0.6rem' }}>{eq.nombre}</h3>
                    <p className="juego">
                      {eq.juego?.nombre} · Capitán: <strong>{eq.capitan?.apodo}</strong>
                    </p>

                    <div className="fila-meta">
                      <span>Plantilla</span>
                      <span>
                        {eq.integrantes?.length || 0} / {maxIntegrantes} jugadores
                      </span>
                    </div>

                    <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0', display: 'grid', gap: '0.45rem' }}>
                      {eq.integrantes?.map((item) => {
                        const esCapitan = item.usuario?.id === eq.capitan?.id;
                        return (
                          <li
                            key={item.id || item.usuario?.id}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '0.4rem 0.6rem',
                              background: 'rgba(255,255,255,0.04)',
                              borderRadius: '6px',
                              fontSize: '0.9rem',
                            }}
                          >
                            <span>
                              <strong>{item.usuario?.apodo}</strong> · {item.rolEquipo}
                            </span>
                            {puedeEditar && !esCapitan && (
                              <button
                                type="button"
                                onClick={() => manejarQuitarIntegrante(eq.id, item.usuario?.id)}
                                disabled={procesando}
                                style={{
                                  background: 'transparent',
                                  border: '1px solid #FF5C7A',
                                  color: '#FF5C7A',
                                  borderRadius: '4px',
                                  padding: '0.15rem 0.5rem',
                                  cursor: 'pointer',
                                  fontSize: '0.8rem',
                                }}
                              >
                                Quitar
                              </button>
                            )}
                          </li>
                        );
                      })}
                    </ul>

                    {puedeEditar && (eq.integrantes?.length || 0) < maxIntegrantes && (
                      <div style={{ display: 'grid', gap: '0.5rem', marginTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.75rem' }}>
                        <select
                          aria-label="Seleccionar jugador"
                          value={seleccionIntegrante[eq.id]?.usuarioId || ''}
                          onChange={(e) => actualizarSeleccion(eq.id, 'usuarioId', e.target.value)}
                          style={{ width: '100%', padding: '0.5rem' }}
                        >
                          <option value="">+ Agregar jugador...</option>
                          {disponibles.map((j) => (
                            <option key={j.id} value={j.id}>
                              {j.apodo} ({j.nombre})
                            </option>
                          ))}
                        </select>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <select
                            aria-label="Rol en equipo"
                            value={seleccionIntegrante[eq.id]?.rolEquipo || 'Titular'}
                            onChange={(e) => actualizarSeleccion(eq.id, 'rolEquipo', e.target.value)}
                            style={{ flex: 1, padding: '0.5rem' }}
                          >
                            <option value="Titular">Titular</option>
                            <option value="Suplente">Suplente</option>
                          </select>

                          <button
                            type="button"
                            className="boton boton-secundario"
                            disabled={procesando}
                            onClick={() => manejarAgregarIntegrante(eq.id)}
                          >
                            Agregar
                          </button>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}