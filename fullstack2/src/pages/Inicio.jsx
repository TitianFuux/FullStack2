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

export default function Inicio() {
  const [torneos, setTorneos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.obtenerTorneos()
      .then((data) => setTorneos(data))
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, []);

  const abiertos = torneos.filter((t) => t.estado === 'abierto');

  const renderTarjeta = (torneo) => (
    <article className="tarjeta-torneo" key={torneo.id}>
      <span className={`pastilla pastilla--${torneo.estado}`}>
        {nombreEstado(torneo.estado)}
      </span>
      <h3>{torneo.nombre}</h3>
      <p className="juego">
        {torneo.juego ? torneo.juego.nombre : 'Juego no disponible'} · {torneo.modalidad}
      </p>
      <div className="fila-meta">
        <span>Cupos</span>
        <span>{torneo.cupoOcupado} / {torneo.cupoMaximo}</span>
      </div>
      <div className="fila-meta">
        <span>Cierra inscripción</span>
        <span>{torneo.fechaCierreInscripcion}</span>
      </div>
      <Link className="boton boton-secundario" to={`/inscripcion?id=${torneo.id}`}>
        Ver detalle
      </Link>
    </article>
  );

  return (
    <main id="contenido-principal">
      <section className="franja">
        <div className="contenedor">
          <h1>Bienvenido a eSports Arena Manager</h1>
          <p>La plataforma líder para competir y gestionar torneos de videojuegos.</p>

          <div style={{ marginTop: '2rem' }}>
            <h2>Gran Final Destacada</h2>
            <div className="marco-video">
              <iframe
                width="100%"
                height="360"
                src="https://www.youtube.com/embed/fmI_Ndrxy14"
                title="LoL Cinemática"
                style={{ border: 0 }}
                allowFullScreen
              ></iframe>
            </div>
          </div>

          {error && (
            <p role="alert" style={{ color: '#FF5C7A', marginTop: '1.5rem', fontWeight: 600 }}>
              ⚠ {error}
            </p>
          )}

          {cargando ? (
            <p style={{ marginTop: '2rem' }}>Cargando torneos desde el servidor...</p>
          ) : (
            <>
              <div style={{ marginTop: '2.5rem' }}>
                <h2>Torneos Destacados</h2>
                <div className="grilla-tarjetas">
                  {torneos.length ? (
                    torneos.slice(0, 3).map(renderTarjeta)
                  ) : (
                    <p className="estado-vacio">No hay torneos registrados aún.</p>
                  )}
                </div>
              </div>

              <div style={{ marginTop: '2.5rem' }}>
                <h2>Próximos Cierres de Inscripción</h2>
                <div className="grilla-tarjetas">
                  {abiertos.length ? (
                    abiertos.map(renderTarjeta)
                  ) : (
                    <p className="estado-vacio">No hay torneos abiertos en este momento.</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}