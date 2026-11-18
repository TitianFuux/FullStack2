import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

function nombreEstado(estado) {
  const mapa = {
    abierto: 'Abierto',
    en_curso: 'En curso',
    finalizado: 'Finalizado',
  };
  return mapa[estado] || estado;
}

export default function Torneos() {
  const [torneos, setTorneos] = useState([]);
  const [juegos, setJuegos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [juegoId, setJuegoId] = useState('');
  const [estado, setEstado] = useState('');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.obtenerJuegos()
      .then((data) => setJuegos(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (desde && hasta && desde > hasta) {
      setError('La fecha "Desde" no puede ser posterior a la fecha "Hasta".');
      setTorneos([]);
      return;
    }

    setError('');
    setCargando(true);

    api.obtenerTorneos({ busqueda, juegoId, estado, desde, hasta })
      .then((data) => setTorneos(data))
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, [busqueda, juegoId, estado, desde, hasta]);

  const limpiarFiltros = () => {
    setBusqueda('');
    setJuegoId('');
    setEstado('');
    setDesde('');
    setHasta('');
    setError('');
  };

  return (
    <main id="contenido-principal">
      <section className="franja">
        <div className="contenedor">
          <h1>Explorar Torneos</h1>
          <p>Filtra competencias por videojuego, estado de inscripción o fechas de inicio.</p>

          <div
            className="tarjeta-torneo"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
              margin: '1.5rem 0 2rem',
              alignItems: 'end',
            }}
          >
            <div>
              <label htmlFor="filtro-busqueda">Buscar por nombre</label>
              <input
                id="filtro-busqueda"
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Ej: Copa Arena..."
                style={{ width: '100%', padding: '0.6rem', marginTop: '0.35rem' }}
              />
            </div>

            <div>
              <label htmlFor="filtro-juego">Videojuego</label>
              <select
                id="filtro-juego"
                value={juegoId}
                onChange={(e) => setJuegoId(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', marginTop: '0.35rem' }}
              >
                <option value="">Todos los juegos</option>
                {juegos.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="filtro-estado">Estado</label>
              <select
                id="filtro-estado"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', marginTop: '0.35rem' }}
              >
                <option value="">Todos</option>
                <option value="abierto">Abierto</option>
                <option value="en_curso">En curso</option>
                <option value="finalizado">Finalizado</option>
              </select>
            </div>

            <div>
              <label htmlFor="filtro-desde">Inicio desde</label>
              <input
                id="filtro-desde"
                type="date"
                value={desde}
                onChange={(e) => setDesde(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', marginTop: '0.35rem' }}
              />
            </div>

            <div>
              <label htmlFor="filtro-hasta">Inicio hasta</label>
              <input
                id="filtro-hasta"
                type="date"
                value={hasta}
                onChange={(e) => setHasta(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', marginTop: '0.35rem' }}
              />
            </div>

            <div>
              <button
                type="button"
                onClick={limpiarFiltros}
                className="boton boton-secundario"
                style={{ width: '100%' }}
              >
                Limpiar filtros
              </button>
            </div>
          </div>

          {error && (
            <p role="alert" style={{ color: '#FF5C7A', fontWeight: 600, marginBottom: '1.5rem' }}>
              ⚠ {error}
            </p>
          )}

          {cargando ? (
            <p>Buscando torneos...</p>
          ) : torneos.length === 0 ? (
            <div className="estado-vacio">
              <p>No se encontraron torneos con los filtros seleccionados.</p>
            </div>
          ) : (
            <div className="grilla-tarjetas">
              {torneos.map((t) => (
                <article className="tarjeta-torneo" key={t.id}>
                  <span className={`pastilla pastilla--${t.estado}`}>
                    {nombreEstado(t.estado)}
                  </span>
                  <h3>{t.nombre}</h3>
                  <p className="juego">
                    {t.juego ? t.juego.nombre : 'Juego no disponible'} · {t.modalidad}
                  </p>
                  {t.descripcion && (
                    <p style={{ fontSize: '0.9rem', opacity: 0.85, margin: '0.5rem 0' }}>
                      {t.descripcion}
                    </p>
                  )}
                  <div className="fila-meta">
                    <span>Cupos ocupados</span>
                    <span>{t.cupoOcupado} / {t.cupoMaximo}</span>
                  </div>
                  <div className="fila-meta">
                    <span>Inicio</span>
                    <span>{t.fechaInicio}</span>
                  </div>
                  <div className="fila-meta">
                    <span>Cierre inscripción</span>
                    <span>{t.fechaCierreInscripcion}</span>
                  </div>
                  <Link className="boton" to={`/inscripcion?id=${t.id}`}>
                    {t.estado === 'abierto' ? 'Ver detalle e inscribir' : 'Ver detalle'}
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}