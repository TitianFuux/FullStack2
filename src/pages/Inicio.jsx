import { Link } from 'react-router'
import { useCarga } from '../hooks/useCarga.js'
import { torneosService } from '../services/torneos.js'
import { juegosService } from '../services/juegos.js'
import { PORTADA, VIDEO_PRESENTACION } from '../data/contenido.js'
import { visualJuego } from '../logica/juegos.js'
import { formatearFecha } from '../logica/formato.js'
import { diasRestantes } from '../logica/reglas.js'
import CarruselHeroe from '../components/CarruselHeroe.jsx'
import TarjetaTorneo from '../components/TarjetaTorneo.jsx'
import ImagenJuego from '../components/ImagenJuego.jsx'
import VideoEmbebido from '../components/VideoEmbebido.jsx'
import { Cargando, ErrorCarga, Vacio } from '../components/Estado.jsx'

export default function Inicio() {
  // Torneos y juegos se piden juntos; no requiere sesión
  const { datos, error, lento, recargar } = useCarga(
    (signal) => Promise.all([torneosService.listar({}, { signal }), juegosService.listar({ signal })]),
    [],
  )

  if (error) {
    return (
      <main id="contenido-principal" className="container seccion">
        <ErrorCarga error={error} onReintentar={recargar} />
      </main>
    )
  }
  if (!datos) {
    return (
      <main id="contenido-principal" className="container seccion">
        <Cargando lento={lento} texto="Cargando la arena…" />
      </main>
    )
  }

  const [torneos, juegos] = datos
  const destacados = torneos.filter((t) => t.estado !== 'finalizado')
  const abiertos = torneos
    .filter((t) => t.estado === 'abierto')
    .sort((a, b) => a.fechaCierreInscripcion.localeCompare(b.fechaCierreInscripcion))

  const diapositivas = destacados.slice(0, 4).map((t) => ({
    id: t.id,
    juego: t.juego,
    estado: t.estado,
    titulo: t.nombre,
    subtitulo:
      t.estado === 'abierto'
        ? `${t.juego?.nombre ?? ''} · Inscripciones hasta el ${formatearFecha(t.fechaCierreInscripcion)}`
        : `${t.juego?.nombre ?? ''} · Torneo en curso: sigue las llaves y la tabla`,
    to: t.estado === 'abierto' ? `/inscripcion?id=${t.id}` : `/torneos/${t.id}`,
    accion: t.estado === 'abierto' ? 'Inscribirse ahora' : 'Ver llaves',
  }))

  return (
    <main id="contenido-principal">
      <CarruselHeroe diapositivas={diapositivas} />

      <section className="container seccion" aria-labelledby="t-bienvenida">
        <h1 id="t-bienvenida" className="titulo-pagina">
          {PORTADA.titulo}
        </h1>
        <p className="lead-texto">{PORTADA.texto}</p>
      </section>

      <section className="container seccion" aria-labelledby="t-juegos">
        <h2 id="t-juegos" className="titulo-seccion">
          Juegos habilitados
        </h2>
        {juegos.length ? (
          <div className="row g-3">
            {juegos.map((j) => (
              <div className="col-6 col-lg-3" key={j.id}>
                <Link to={`/torneos?juego=${j.id}`} className="tile-juego" style={{ '--color-juego': visualJuego(j).color }}>
                  <ImagenJuego juego={j} />
                  <span className="tile-juego-texto">
                    <strong>{j.nombre}</strong>
                    <small>{j.modalidad}</small>
                  </span>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <Vacio titulo="Aún no hay juegos habilitados">El administrador debe agregarlos desde el panel de gestión.</Vacio>
        )}
      </section>

      <section className="container seccion" aria-labelledby="t-destacados">
        <h2 id="t-destacados" className="titulo-seccion">
          Torneos destacados
        </h2>
        {destacados.length ? (
          <div className="row g-4">
            {destacados.map((t) => (
              <div className="col-12 col-md-6 col-xl-4" key={t.id}>
                <TarjetaTorneo torneo={t} />
              </div>
            ))}
          </div>
        ) : (
          <Vacio titulo="No hay torneos abiertos o en curso por ahora" />
        )}
      </section>

      <section className="container seccion" aria-labelledby="t-cierres">
        <h2 id="t-cierres" className="titulo-seccion">
          Próximos cierres de inscripción
        </h2>
        {abiertos.length ? (
          <ul className="lista-cierres list-unstyled">
            {abiertos.map((t) => {
              const dias = diasRestantes(t.fechaCierreInscripcion)
              return (
                <li key={t.id} className="cierre">
                  <div className="cierre-dias" aria-label={`${Math.max(dias, 0)} días restantes`}>
                    <strong>{Math.max(dias, 0)}</strong>
                    <small>días</small>
                  </div>
                  <div className="flex-grow-1">
                    <h3 className="h6 mb-1">{t.nombre}</h3>
                    <p className="etiqueta-dato mb-0">
                      {t.juego?.nombre} · cierra el {formatearFecha(t.fechaCierreInscripcion)}
                    </p>
                  </div>
                  <Link className="btn btn-primary" to={`/inscripcion?id=${t.id}`}>
                    Inscribirse
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : (
          <Vacio titulo="No hay inscripciones abiertas por ahora" />
        )}
      </section>

      <section className="container seccion" aria-labelledby="t-video">
        <h2 id="t-video" className="titulo-seccion">
          Gran final destacada
        </h2>
        <div className="row justify-content-center">
          <div className="col-12 col-lg-9">
            <VideoEmbebido url={VIDEO_PRESENTACION} titulo="Video de presentación de la gran final" />
          </div>
        </div>
      </section>
    </main>
  )
}
