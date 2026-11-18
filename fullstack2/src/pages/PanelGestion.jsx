import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const inputStyle = { width: '100%', padding: '0.55rem', marginTop: '0.3rem' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.9rem', alignItems: 'end' };

export default function PanelGestion() {
  const { esGestion, esAdmin, rol } = useAuth();
  const [datos, setDatos] = useState({ torneos: [], juegos: [], jugadores: [], inscripciones: [] });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  const cargarTodo = async () => {
    if (!esGestion) return;
    setCargando(true);
    try {
      const [torneos, juegos, jugadores, inscripciones] = await Promise.all([
        api.obtenerTorneos(),
        api.obtenerJuegos(),
        api.obtenerJugadores(),
        api.obtenerInscripciones(),
      ]);
      setDatos({ torneos, juegos, jugadores, inscripciones });
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargarTodo(); }, [esGestion]);

  const ejecutar = async (promesa, msg, form = null) => {
    setError('');
    setExito('');
    try {
      await promesa;
      if (form) form.reset();
      setExito(msg);
      await cargarTodo();
    } catch (err) {
      setError(err.message);
    }
  };

  if (!esGestion) {
    return (
      <main id="contenido-principal">
        <section className="franja">
          <div className="contenedor" style={{ textAlign: 'center', maxWidth: '500px' }}>
            <h1>Acceso Restringido</h1>
            <p style={{ margin: '1rem 0' }}>Tu rol (<strong>{rol}</strong>) no tiene acceso a este panel.</p>
            <Link to="/login" className="boton">Iniciar sesión con cuenta autorizada</Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main id="contenido-principal">
      <section className="franja">
        <div className="contenedor">
          <h1>Panel de Gestión ({rol})</h1>
          {error && <p role="alert" style={{ color: '#FF5C7A', fontWeight: 600 }}>⚠ {error}</p>}
          {exito && <p role="status" style={{ color: '#00F5D4', fontWeight: 600 }}>✔ {exito}</p>}

          {cargando ? <p>Cargando panel...</p> : (
            <div style={{ display: 'grid', gap: '2rem', marginTop: '1.5rem' }}>
              {/* 1. Crear Torneo */}
              <form
                className="tarjeta-torneo"
                onSubmit={(e) => {
                  e.preventDefault();
                  const f = Object.fromEntries(new FormData(e.target));
                  ejecutar(api.crearTorneo({ ...f, juegoId: Number(f.juegoId), cupoMaximo: Number(f.cupoMaximo) }), 'Torneo creado.', e.target);
                }}
              >
                <h2>Crear Torneo</h2>
                <div style={{ ...gridStyle, marginTop: '0.8rem' }}>
                  <div><label>Nombre<input name="nombre" required style={inputStyle} /></label></div>
                  <div>
                    <label>Juego
                      <select name="juegoId" required style={inputStyle}>
                        <option value="">-- Elegir --</option>
                        {datos.juegos.map((j) => <option key={j.id} value={j.id}>{j.nombre}</option>)}
                      </select>
                    </label>
                  </div>
                  <div>
                    <label>Modalidad
                      <select name="modalidad" style={inputStyle}>
                        <option value="Equipos">Equipos</option>
                        <option value="Individual">Individual</option>
                      </select>
                    </label>
                  </div>
                  <div><label>Cupo máx.<input name="cupoMaximo" type="number" min={2} defaultValue={16} required style={inputStyle} /></label></div>
                  <div><label>Cierre inscr.<input name="fechaCierreInscripcion" type="date" required style={inputStyle} /></label></div>
                  <div><label>Inicio<input name="fechaInicio" type="date" required style={inputStyle} /></label></div>
                </div>
                <div style={{ marginTop: '0.8rem' }}><label>Descripción<input name="descripcion" style={inputStyle} /></label></div>
                <button type="submit" className="boton" style={{ marginTop: '1rem' }}>Publicar Torneo</button>
              </form>

              {/* 2. Torneos Existentes */}
              <div className="tarjeta-torneo" style={{ overflowX: 'auto' }}>
                <h2>Torneos ({datos.torneos.length})</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.8rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
                      <th>Torneo</th><th>Juego</th><th>Cupos</th><th>Estado</th>{esAdmin && <th>Eliminar</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {datos.torneos.map((t) => (
                      <tr key={t.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                        <td style={{ padding: '0.5rem 0' }}>{t.nombre}</td>
                        <td>{t.juego?.nombre}</td>
                        <td>{t.cupoOcupado}/{t.cupoMaximo}</td>
                        <td>
                          <select value={t.estado} onChange={(e) => ejecutar(api.actualizarTorneo(t.id, { estado: e.target.value }), 'Estado actualizado.')}>
                            <option value="abierto">Abierto</option>
                            <option value="en_curso">En curso</option>
                            <option value="finalizado">Finalizado</option>
                          </select>
                        </td>
                        {esAdmin && (
                          <td>
                            <button type="button" onClick={() => window.confirm(`¿Eliminar ${t.nombre}?`) && ejecutar(api.eliminarTorneo(t.id), 'Torneo eliminado.')}
                              style={{ color: '#FF5C7A', background: 'transparent', border: '1px solid #FF5C7A', borderRadius: '4px', cursor: 'pointer' }}>
                              X
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 3. Agregar Juego (Solo Admin) */}
              {esAdmin && (
                <form
                  className="tarjeta-torneo"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const f = Object.fromEntries(new FormData(e.target));
                    ejecutar(api.crearJuego({ ...f, integrantesPorEquipo: Number(f.integrantesPorEquipo) }), 'Videojuego agregado.', e.target);
                  }}
                >
                  <h2>Agregar Juego (Admin)</h2>
                  <div style={{ ...gridStyle, marginTop: '0.8rem' }}>
                    <div><label>Nombre<input name="nombre" required style={inputStyle} /></label></div>
                    <div><label>Integrantes/equipo<input name="integrantesPorEquipo" type="number" min={1} defaultValue={5} required style={inputStyle} /></label></div>
                    <div>
                      <label>Modalidad
                        <select name="modalidad" style={inputStyle}>
                          <option value="Equipos">Equipos</option>
                          <option value="Individual">Individual</option>
                        </select>
                      </label>
                    </div>
                    <button type="submit" className="boton">Guardar Juego</button>
                  </div>
                </form>
              )}

              {/* 4. Aplicar Sanción */}
              <form
                className="tarjeta-torneo"
                onSubmit={(e) => {
                  e.preventDefault();
                  const f = Object.fromEntries(new FormData(e.target));
                  ejecutar(api.crearSancion({ ...f, usuarioId: Number(f.usuarioId) }), 'Sanción aplicada.', e.target);
                }}
              >
                <h2>Aplicar Sanción</h2>
                <div style={{ ...gridStyle, marginTop: '0.8rem' }}>
                  <div>
                    <label>Jugador
                      <select name="usuarioId" required style={inputStyle}>
                        <option value="">-- Elegir --</option>
                        {datos.jugadores.map((j) => <option key={j.id} value={j.id}>{j.apodo}</option>)}
                      </select>
                    </label>
                  </div>
                  <div><label>Motivo<input name="motivo" required style={inputStyle} /></label></div>
                  <div><label>Duración<input name="duracion" defaultValue="3 fechas" required style={inputStyle} /></label></div>
                  <button type="submit" className="boton boton-secundario">Sancionar</button>
                </div>
              </form>

              {/* 5. Inscripciones */}
              <div className="tarjeta-torneo" style={{ overflowX: 'auto' }}>
                <h2>Inscripciones ({datos.inscripciones.length})</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.8rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
                      <th>ID</th><th>Torneo</th><th>Participante</th><th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {datos.inscripciones.map((ins) => (
                      <tr key={ins.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                        <td style={{ padding: '0.5rem 0' }}>#{ins.id}</td>
                        <td>{ins.torneo?.nombre}</td>
                        <td>{ins.equipo ? `Equipo: ${ins.equipo.nombre}` : `Jugador: ${ins.usuario?.apodo}`}</td>
                        <td>{ins.estado}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}