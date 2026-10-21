import React, { useState } from 'react';
import { JUEGOS, JUGADORES, EQUIPOS } from '../data/datos';

export default function GestionEquipo() {
  const [nombre, setNombre] = useState('');
  const [juegoId, setJuegoId] = useState('');
  const [capitanId, setCapitanId] = useState('');
  const [equipoEnEdicion, setEquipoEnEdicion] = useState(null);

  const [idJugadorAgregar, setIdJugadorAgregar] = useState('');
  const [errorNombre, setErrorNombre] = useState('');
  const [errorJuego, setErrorJuego] = useState('');
  const [errorCapitan, setErrorCapitan] = useState('');
  const [errorAgregar, setErrorAgregar] = useState('');

  const juegosEquipos = JUEGOS.filter(j => j.modalidad === 'Equipos');

  const handleCrearEquipo = (e) => {
    e.preventDefault();
    setErrorNombre(''); setErrorJuego(''); setErrorCapitan('');

    if (nombre.trim().length < 3) {
      setErrorNombre("El nombre debe tener al menos 3 caracteres.");
      return;
    }

    if (EQUIPOS.some(eq => eq.nombre.toLowerCase() === nombre.trim().toLowerCase())) {
      setErrorNombre("Ya existe un equipo con ese nombre.");
      return;
    }

    const juego = JUEGOS.find(j => j.id === juegoId);
    if (!juego || juego.modalidad !== "Equipos") {
      setErrorJuego("Debes seleccionar un juego con modalidad por equipos.");
      return;
    }

    if (!capitanId) {
      setErrorCapitan("Debes seleccionar un capitán.");
      return;
    }

    const capitan = JUGADORES.find(j => j.id === capitanId);
    if (capitan && capitan.sanciones.some(s => s.vigente)) {
      setErrorCapitan("El capitán tiene una sanción vigente y no puede crear el equipo.");
      return;
    }

    const nuevoEquipo = {
      id: "e" + (EQUIPOS.length + 1),
      nombre: nombre.trim(),
      juegoId,
      capitanId,
      activo: true,
      integrantes: [{ jugadorId: capitanId, rol: "Capitán" }]
    };

    EQUIPOS.push(nuevoEquipo);
    setEquipoEnEdicion(nuevoEquipo);
  };

  const handleAgregarJugador = () => {
    setErrorAgregar('');
    if (!equipoEnEdicion) return;

    if (!idJugadorAgregar) {
      setErrorAgregar("Selecciona un jugador para agregar.");
      return;
    }

    const jugador = JUGADORES.find(j => j.id === idJugadorAgregar);
    if (jugador && jugador.sanciones.some(s => s.vigente)) {
      setErrorAgregar("El jugador seleccionado posee una sanción vigente y no puede ser agregado.");
      return;
    }

    const juego = JUEGOS.find(j => j.id === equipoEnEdicion.juegoId);
    if (juego && equipoEnEdicion.integrantes.length >= juego.integrantesPorEquipo) {
      setErrorAgregar(`La nómina máxima para ${juego.nombre} es de ${juego.integrantesPorEquipo} jugadores.`);
      return;
    }

    setEquipoEnEdicion({
      ...equipoEnEdicion,
      integrantes: [...equipoEnEdicion.integrantes, { jugadorId: idJugadorAgregar, rol: "Titular" }]
    });
    setIdJugadorAgregar('');
  };

  const handleQuitarJugador = (id) => {
    if (id === equipoEnEdicion.capitanId) return;
    setEquipoEnEdicion({
      ...equipoEnEdicion,
      integrantes: equipoEnEdicion.integrantes.filter(i => i.jugadorId !== id)
    });
  };

  const jugadoresDisponibles = JUGADORES.filter(
    j => !equipoEnEdicion?.integrantes.some(i => i.jugadorId === j.id)
  );

  return (
    <main id="contenido-principal">
      <section className="franja">
        <div className="contenedor">
          <h1>Gestión de Mi Equipo</h1>
          <div className="dos-columnas">
            <div>
              <h2>Crear un Nuevo Equipo</h2>
              <form className="formulario" onSubmit={handleCrearEquipo} noValidate>
                <div className="campo">
                  <label htmlFor="nombre-equipo">Nombre del equipo</label>
                  <input type="text" id="nombre-equipo" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Halcones de Neón" />
                  {errorNombre && <span className="mensaje-error">{errorNombre}</span>}
                </div>

                <div className="campo">
                  <label htmlFor="juego-principal">Juego principal</label>
                  <select id="juego-principal" value={juegoId} onChange={(e) => setJuegoId(e.target.value)} disabled={!!equipoEnEdicion}>
                    <option value="">Selecciona un juego</option>
                    {juegosEquipos.map(j => <option key={j.id} value={j.id}>{j.nombre}</option>)}
                  </select>
                  {errorJuego && <span className="mensaje-error">{errorJuego}</span>}
                </div>

                <div className="campo">
                  <label htmlFor="capitan">Capitán</label>
                  <select id="capitan" value={capitanId} onChange={(e) => setCapitanId(e.target.value)} disabled={!!equipoEnEdicion}>
                    <option value="">Selecciona un capitán</option>
                    {JUGADORES.map(j => <option key={j.id} value={j.id}>{j.apodo} ({j.nombre})</option>)}
                  </select>
                  {errorCapitan && <span className="mensaje-error">{errorCapitan}</span>}
                </div>

                <button type="submit" className="boton boton-primario" disabled={!!equipoEnEdicion}>Crear Equipo</button>
              </form>
            </div>

            {equipoEnEdicion && (
              <div>
                <h2>Plantilla de Integrantes ({equipoEnEdicion.nombre})</h2>
                <ul className="lista-integrantes">
                  {equipoEnEdicion.integrantes.map(item => {
                    const jugador = JUGADORES.find(j => j.id === item.jugadorId);
                    const esCapitan = item.jugadorId === equipoEnEdicion.capitanId;
                    return (
                      <li key={item.jugadorId} className="integrante">
                        <span><strong>{jugador?.apodo}</strong> — {jugador?.nombre} {esCapitan ? ' (Capitán)' : ' (Titular)'}</span>
                        {!esCapitan && (
                          <button type="button" onClick={() => handleQuitarJugador(item.jugadorId)} className="boton boton-secundario" style={{ padding: '0.2rem 0.6rem', fontSize: '0.85rem' }}>
                            Quitar
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>

                <div className="formulario" style={{ marginTop: '1.5rem' }}>
                  <div className="campo">
                    <label htmlFor="agregar-jugador">Agregar Jugador</label>
                    <select id="agregar-jugador" value={idJugadorAgregar} onChange={(e) => setIdJugadorAgregar(e.target.value)}>
                      <option value="">Selecciona un jugador</option>
                      {jugadoresDisponibles.map(j => <option key={j.id} value={j.id}>{j.apodo}</option>)}
                    </select>
                    {errorAgregar && <span className="mensaje-error">{errorAgregar}</span>}
                  </div>
                  <button type="button" onClick={handleAgregarJugador} className="boton boton-secundario">Agregar Jugador</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}