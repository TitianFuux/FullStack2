import { Link, useParams } from 'react-router'
import { useAuth } from '../auth/useAuth.js'
import { useCarga } from '../hooks/useCarga.js'
import { torneosService } from '../services/torneos.js'
import { inscripcionesService } from '../services/inscripciones.js'
import { formatearFecha } from '../logica/formato.js'
import { visualJuego } from '../logica/juegos.js'
import { cuposDisponibles, ordenarRanking, participantesDe } from '../logica/reglas.js'
import ImagenJuego from '../components/ImagenJuego.jsx'
import Pastilla from '../components/Pastilla.jsx'
import LlaveTorneo from '../components/LlaveTorneo.jsx'
import TablaRanking from '../components/TablaRanking.jsx'
import VideoEmbebido from '../components/VideoEmbebido.jsx'
import { Cargando, ErrorCarga, Vacio } from '../components/Estado.jsx'

// La lista de inscripciones puede estar reservada a ciertos roles: si el servidor la rechaza, se omite
function sinPermiso(error) {
  if (error.name === 'AbortError') throw error
  return null
}

export default function DetalleTorneo() {
  const { id } = useParams()
  const { autenticado } = useAuth()

  // El torneo se pide por id; si cambia el id, la petición anterior se cancela
  const torneo = useCarga((signal) => torneosService.obtener(id, { signal }), [id])
  const inscripciones = useCarga(
    (signal) => (autenticado ? inscripcionesService.listar({ signal }).catch(sinPermiso) : Promise.resolve(null)),
    [id, autenticado],
  )

  if (torneo.error) {
    return (
      <main id="contenido-principal" className="container seccion">
        {torneo.error.estado === 404 ? (
          <Vacio titulo="No encontramos ese torneo">
            <Link to="/torneos">Volver al listado de torneos</Link>
          </Vacio>
        ) : (
          <ErrorCarga error={torneo.error} onReintentar={torneo.recargar} />
        )}
      </main>
    )
  }
  if (!torneo.datos || String(torneo.datos.id) !== String(id)) {
    return (
      <main id="contenido-principal" className="container seccion">
        <Cargando lento={torneo.lento} texto="Cargando torneo…" />
      </main>
    )
  }

  const t = torneo.datos
  const libres = cuposDisponibles(t.cupoMaximo, t.cupoOcupado)
  const finalizado = t.estado === 'finalizado'
  // Llaves, tabla y premios se muestran si la API los entrega en el torneo
  const rondas = t.rondas ?? []
  const ranking = ordenarRanking(t.ranking ?? [])
  const premios = t.premios ?? []
  const participantes = inscripciones.datos ? participantesDe(t, inscripciones.datos) : null

  return (
    <main id="contenido-principal">
      <header className="detalle-heroe" style={{ '--color-juego': visualJuego(t.juego).color }}>
        <ImagenJuego juego={t.juego} className="detalle-heroe-imagen" />
        <div className="container detalle-heroe-texto">
          <Pastilla estado={t.estado} />
          <h1>{t.nombre}</h1>
          <p>
            {t.juego?.nombre} · {t.modalidad}
          </p>
        </div>
      </header>

      <div className="container seccion">
        <div className="grilla-stats mb-4">
          <div className="tarjeta-stat">
            <div className="valor">{libres}</div>
            <div className="rotulo">Cupos disponibles</div>
          </div>
          <div className="tarjeta-stat">
            <div className="valor">
              {t.cupoOcupado}/{t.cupoMaximo}
            </div>
            <div className="rotulo">Inscritos</div>
          </div>
          <div className="tarjeta-stat">
            <div className="valor">{formatearFecha(t.fechaInicio)}</div>
            <div className="rotulo">Inicio</div>
          </div>
          <div className="tarjeta-stat">
            <div className="valor">{formatearFecha(t.fechaCierreInscripcion)}</div>
            <div className="rotulo">Cierre de inscripción</div>
          </div>
        </div>

        {t.descripcion && <p className="lead-texto">{t.descripcion}</p>}
        {t.estado === 'abierto' && (
          <Link className="btn btn-primary btn-lg mb-4" to={`/inscripcion?id=${t.id}`}>
            Inscribirse a este torneo
          </Link>
        )}

        <div className="row g-4">
          <div className="col-12 col-lg-7">
            {finalizado && t.video && (
              <section className="mb-4" aria-labelledby="t-final">
                <h2 id="t-final" className="titulo-seccion">
                  Video de la final
                </h2>
                <VideoEmbebido url={t.video} titulo={`Final de ${t.nombre}`} />
              </section>
            )}

            <section className="mb-4" aria-labelledby="t-llaves">
              <h2 id="t-llaves" className="titulo-seccion">
                Llaves y calendario
              </h2>
              <LlaveTorneo rondas={rondas} />
            </section>

            <section aria-labelledby="t-participantes">
              <h2 id="t-participantes" className="titulo-seccion">
                Participantes inscritos
              </h2>
              {participantes === null ? (
                <Vacio>Inicia sesión para ver la lista de participantes inscritos.</Vacio>
              ) : participantes.length ? (
                <ul className="lista-integrantes list-unstyled">
                  {participantes.map((nombre, i) => (
                    <li className="integrante" key={`${nombre}-${i}`}>
                      {nombre}
                    </li>
                  ))}
                </ul>
              ) : (
                <Vacio>Aún no hay participantes inscritos.</Vacio>
              )}
            </section>
          </div>

          <div className="col-12 col-lg-5">
            <section className="mb-4" aria-labelledby="t-ranking">
              <h2 id="t-ranking" className="titulo-seccion">
                Tabla de posiciones
              </h2>
              <TablaRanking filas={ranking} />
            </section>

            {finalizado && (
              <section aria-labelledby="t-premios">
                <h2 id="t-premios" className="titulo-seccion">
                  Premios
                </h2>
                {premios.length ? (
                  <ul className="lista-integrantes list-unstyled">
                    {premios.map((p) => (
                      <li className="integrante" key={p.posicion}>
                        <strong>{p.posicion}</strong>
                        <span className="etiqueta-dato text-end">{p.premio}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Vacio>Los premios de este torneo aún no están publicados.</Vacio>
                )}
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
