import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Inscripcion() {
  const [searchParams, setSearchParams] = useSearchParams();
  const idParam = searchParams.get('id');

  const { usuario, estaAutenticado, esAdmin } = useAuth();

  const [torneos, setTorneos] = useState([]);
  const [torneoSeleccionado, setTorneoSeleccionado] = useState(null);
  const [equipos, setEquipos] = useState([]);
  const [jugadores, setJugadores] = useState([]);

  const [equipoId, setEquipoId] = useState('');
  const [jugadorId, setJugadorId] = useState('');
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');
  const [error, setError] = useState('');

  const cargarDatos = async () => {
    setCargando(true);
    setError('');
    try {
      const [listaTorneos, listaEquipos, listaJugadores] = await Promise.all([
        api.obtenerTorneos(),
        api.obtenerEquipos(),
        api.obtenerJugadores(),
      ]);

      setTorneos(listaTorneos);
      setEquipos(listaEquipos);
      setJugadores(listaJugadores);

      const encontrado = idParam
        ? listaTorneos.find((t) => String(t.id) === String(idParam))
        : listaTorneos.find((t) => t.estado === 'abierto') || listaTorneos[0];

      setTorneoSeleccionado(encontrado || null);
      if (encontrado && !idParam) {
        setSearchParams({ id: encontrado.id }, { replace: true });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [idParam]);

  useEffect(() => {
    if (usuario && !jugadorId) {
      setJugadorId(String(usuario.id));
    }
  }, [usuario]);

  const manejarCambioTorneo = (nuevoId) => {
    setMensajeExito('');
    setError('');
    setEquipoId('');
    setSearchParams({ id: nuevoId });
  };

  const equiposCompatibles = equipos.filter((eq) => {
    if (!torneoSeleccionado?.juego) return true;
    const mismoJuego = eq.juego?.id === torneoSeleccionado.juego.id;
    if (esAdmin) return mismoJuego;
    if (!usuario) return false;
    const esMiembro =
      eq.capitan?.id === usuario.id ||
      eq.integrantes?.some((i) => i.usuario?.id === usuario.id);
    return mismoJuego && esMiembro;
  });

  const manejarInscripcion = async (e) => {
    e.preventDefault();
    if (!torneoSeleccionado) return;

    setError('');
    setMensajeExito('');
    setEnviando(true);

    try {
      const esPorEquipos = torneoSeleccionado.modalidad?.toLowerCase() === 'equipos';
      const payload = esPorEquipos
        ? { torneoId: torneoSeleccionado.id, equipoId: Number(equipoId) }
        : { torneoId: torneoSeleccionado.id, usuarioId: Number(jugadorId || usuario.id) };

      await api.crearInscripcion(payload);
      setMensajeExito('¡Inscripción confirmada exitosamente en el torneo!');
      await cargarDatos();
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main id="contenido-principal">
      <section className="franja">
        <div className="contenedor" style={{ maxWidth: '760px' }}>
          <h1>Detalle e Inscripción a Torneo</h1>
          <p>Revisa los requisitos del torneo y confirma la participación de tu equipo o jugador.</p>

          {cargando ? (
            <p style={{ marginTop: '1.5rem' }}>Cargando información del torneo...</p>
          ) : torneos.length === 0 ? (
            <p className="estado-vacio">No hay torneos disponibles en el sistema.</p>
          ) : (
            <>
              <div style={{ margin: '1.5rem 0' }}>
                <label htmlFor="selector-torneo">Seleccionar torneo</label>
                <select
                  id="selector-torneo"
                  value={torneoSeleccionado?.id || ''}
                  onChange={(e) => manejarCambioTorneo(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', marginTop: '0.4rem' }}
                >
                  {torneos.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nombre} ({t.juego?.nombre} · {t.estado.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              {torneoSeleccionado && (
                <article className="tarjeta-torneo" style={{ marginBottom: '2rem' }}>
                  <span className={`pastilla pastilla--${torneoSeleccionado.estado}`}>
                    {torneoSeleccionado.estado.toUpperCase()}
                  </span>
                  <h2 style={{ marginTop: '0.75rem' }}>{torneoSeleccionado.nombre}</h2>
                  <p className="juego">
                    {torneoSeleccionado.juego?.nombre} · Modalidad: {torneoSeleccionado.modalidad}
                  </p>
                  {torneoSeleccionado.descripcion && (
                    <p style={{ margin: '0.75rem 0' }}>{torneoSeleccionado.descripcion}</p>
                  )}

                  <div className="fila-meta">
                    <span>Cupos disponibles</span>
                    <span>
                      {torneoSeleccionado.cupoMaximo - torneoSeleccionado.cupoOcupado} libres ({torneoSeleccionado.cupoOcupado} / {torneoSeleccionado.cupoMaximo})
                    </span>
                  </div>
                  <div className="fila-meta">
                    <span>Integrantes requeridos</span>
                    <span>{torneoSeleccionado.juego?.integrantesPorEquipo} por inscripción</span>
                  </div>
                  <div className="fila-meta">
                    <span>Cierre de inscripciones</span>
                    <span>{torneoSeleccionado.fechaCierreInscripcion}</span>
                  </div>
                  <div className="fila-meta">
                    <span>Fecha de inicio</span>
                    <span>{torneoSeleccionado.fechaInicio}</span>
                  </div>
                </article>
              )}

              {!estaAutenticado ? (
                <div className="tarjeta-torneo" style={{ textAlign: 'center' }}>
                  <p style={{ marginBottom: '1rem' }}>
                    Debes iniciar sesión con tu cuenta para inscribirte en un torneo.
                  </p>
                  <Link to="/login" className="boton">
                    Ir a Iniciar Sesión
                  </Link>
                </div>
              ) : (
                torneoSeleccionado && (
                  <form onSubmit={manejarInscripcion} className="tarjeta-torneo" style={{ display: 'grid', gap: '1rem' }}>
                    <h3>Formulario de Inscripción</h3>

                    {torneoSeleccionado.modalidad?.toLowerCase() === 'equipos' ? (
                      <div>
                        <label htmlFor="selector-equipo">
                          Selecciona tu equipo de {torneoSeleccionado.juego?.nombre}
                        </label>
                        {equiposCompatibles.length === 0 ? (
                          <p style={{ color: '#FF5C7A', marginTop: '0.5rem' }}>
                            No tienes ningún equipo registrado para {torneoSeleccionado.juego?.nombre}.{' '}
                            <Link to="/gestion" style={{ color: '#00F5D4', textDecoration: 'underline' }}>
                              Crea o gestiona uno en Mi Equipo
                            </Link>
                            .
                          </p>
                        ) : (
                          <select
                            id="selector-equipo"
                            required
                            value={equipoId}
                            onChange={(e) => setEquipoId(e.target.value)}
                            style={{ width: '100%', padding: '0.65rem', marginTop: '0.4rem' }}
                          >
                            <option value="">-- Elige un equipo --</option>
                            {equiposCompatibles.map((eq) => (
                              <option key={eq.id} value={eq.id}>
                                {eq.nombre} ({eq.integrantes?.length || 0} / {torneoSeleccionado.juego?.integrantesPorEquipo} integrantes)
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    ) : (
                      <div>
                        <label htmlFor="selector-jugador">Participante individual</label>
                        {esAdmin ? (
                          <select
                            id="selector-jugador"
                            required
                            value={jugadorId}
                            onChange={(e) => setJugadorId(e.target.value)}
                            style={{ width: '100%', padding: '0.65rem', marginTop: '0.4rem' }}
                          >
                            {jugadores.map((j) => (
                              <option key={j.id} value={j.id}>
                                {j.apodo} ({j.nombre})
                              </option>
                            ))}
                          </select>
                        ) : (
                          <p style={{ marginTop: '0.4rem', color: '#00F5D4', fontWeight: 600 }}>
                            {usuario.apodo} ({usuario.nombre})
                          </p>
                        )}
                      </div>
                    )}

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

                    <button
                      type="submit"
                      className="boton"
                      disabled={
                        enviando ||
                        torneoSeleccionado.estado !== 'abierto' ||
                        (torneoSeleccionado.modalidad?.toLowerCase() === 'equipos' && equiposCompatibles.length === 0)
                      }
                    >
                      {enviando
                        ? 'Registrando inscripción...'
                        : torneoSeleccionado.estado !== 'abierto'
                        ? 'Inscripciones cerradas'
                        : 'Confirmar Inscripción'}
                    </button>
                  </form>
                )
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}