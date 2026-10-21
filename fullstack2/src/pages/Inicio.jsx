import React from 'react';
import { Link } from 'react-router-dom';
import { TORNEOS, Datos } from '../data/datos';

export default function Inicio() {
  const abiertos = TORNEOS.filter((t) => t.estado === 'abierto');

  const renderTarjeta = (torneo) => {
    const juego = Datos.obtenerJuegoPorId(torneo.juegoId);
    return (
      <article className="tarjeta-torneo" key={torneo.id}>
        <span className={`pastilla pastilla--${torneo.estado}`}>
          {Datos.nombreEstado(torneo.estado)}
        </span>
        <h3>{torneo.nombre}</h3>
        <p className="juego">{juego ? juego.nombre : "Juego no disponible"} · {torneo.modalidad}</p>
        <div className="fila-meta">
          <span>Cierra inscripción</span>
          <span>{torneo.fechaCierreInscripcion}</span>
        </div>
        <Link className="boton boton-secundario" to={`/inscripcion?id=${torneo.id}`}>Ver detalle</Link>
      </article>
    );
  };

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
                width="100%" height="360" 
                src="https://www.youtube.com/embed/fmI_Ndrxy14" 
                title="LoL Cinemática" style={{ border: 0 }} allowFullScreen>
              </iframe>
            </div>
          </div>

          <div style={{ marginTop: '2.5rem' }}>
            <h2>Torneos Destacados</h2>
            <div className="grilla-tarjetas">
              {TORNEOS.slice(0, 3).map(renderTarjeta)}
            </div>
          </div>

          <div style={{ marginTop: '2.5rem' }}>
            <h2>Próximos Cierres de Inscripción</h2>
            <div className="grilla-tarjetas">
              {abiertos.length ? abiertos.map(renderTarjeta) : <p className="estado-vacio">No hay torneos disponibles.</p>}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}