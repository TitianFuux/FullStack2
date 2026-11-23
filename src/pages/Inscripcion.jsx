import { useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router'
import { useAuth } from '../auth/useAuth.js'
import { useCarga } from '../hooks/useCarga.js'
import { torneosService } from '../services/torneos.js'
import { equiposService } from '../services/equipos.js'
import { jugadoresService } from '../services/jugadores.js'
import { inscripcionesService } from '../services/inscripciones.js'
import { formatearFecha } from '../logica/formato.js'
import { cuposDisponibles, esPorEquipos } from '../logica/reglas.js'
import Campo from '../components/Campo.jsx'
import FormularioInscripcion from '../components/FormularioInscripcion.jsx'
import ImagenJuego from '../components/ImagenJuego.jsx'
import VideoEmbebido from '../components/VideoEmbebido.jsx'
import { Cargando, ErrorCarga, Vacio } from '../components/Estado.jsx'

// La lista de inscripciones puede estar reservada a ciertos roles: si el servidor la rechaza, el backend valida la duplicidad
function sinPermiso(error) {
  if (error.name === 'AbortError') throw error
  return null
}

export default function Inscripcion() {
  const [params, setParams] = useSearchParams()
  const ubicacion = useLocation()
  const { usuario, autenticado, esAdmin } = useAuth()
  const [confirmado, setConfirmado] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [errorServidor, setErrorServidor] = useState('')

  const { datos, error, lento, recargar } = useCarga(
    (signal) =>
      Promise.all([
        torneosService.listar({}, { signal }),
        equiposService.listar({ signal }),
        jugadoresService.listar({ signal }),
        autenticado ? inscripcionesService.listar({ signal }).catch(sinPermiso) : Promise.resolve(null),
      ]),
    [autenticado],
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
        <Cargando lento={lento} texto="Cargando inscripción…" />
      </main>
    )
  }

  const [torneos, equipos, jugadores, inscripciones] = datos
  const idPedido = params.get('id')
  const torneo = torneos.find((t) => String(t.id) === idPedido) ?? torneos.find((t) => t.estado === 'abierto') ?? torneos[0] ?? null

  if (!torneo) {
    return (
      <main id="contenido-principal" className="container seccion">
        <h1 className="titulo-pagina">Inscripción a torneo</h1>
        <Vacio titulo="Todavía no hay torneos">Cuando el organizador publique uno podrás inscribirte aquí.</Vacio>
      </main>
    )
  }

  const porEquipos = esPorEquipos(torneo)
  // Un jugador inscribe a sus equipos; el administrador, a cualquiera del mismo juego
  const equiposPosibles = equipos.filter((eq) => {
    if (eq.juego?.id !== torneo.juego?.id) return false
    if (esAdmin) return true
    return eq.capitan?.id === usuario?.id || eq.integrantes?.some((i) => i.usuario?.id === usuario?.id)
  })
  const jugadoresPosibles = esAdmin ? jugadores : jugadores.filter((j) => j.id === usuario?.id)
  const opciones = porEquipos ? equiposPosibles : jugadoresPosibles
  const inscritos = inscripciones ?? []

  async function inscribir(participante) {
    setEnviando(true)
    setErrorServidor('')
    setConfirmado(null)
    try {
      const datosInscripcion = porEquipos
        ? { torneoId: torneo.id, equipoId: participante.id }
        : { torneoId: torneo.id, usuarioId: participante.id }
      await inscripcionesService.crear(datosInscripcion)
      setConfirmado({ nombre: porEquipos ? participante.nombre : participante.apodo, torneo: torneo.nombre })
      recargar()
    } catch (err) {
      setErrorServidor(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <main id="contenido-principal" className="container seccion">
      <h1 className="titulo-pagina">Inscripción a torneo</h1>

      <div className="mb-4" style={{ maxWidth: 420 }}>
        <Campo
          id="selector-torneo"
          etiqueta="Torneo"
          as="select"
          value={torneo.id}
          onChange={(e) => {
            setConfirmado(null)
            setErrorServidor('')
            setParams({ id: e.target.value })
          }}
        >
          {torneos.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nombre}
            </option>
          ))}
        </Campo>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <article className="panel">
            <ImagenJuego juego={torneo.juego} className="banner-inscripcion" />
            <h2 className="mt-3">{torneo.nombre}</h2>
            <dl className="ficha">
              <div>
                <dt>Juego</dt>
                <dd>{torneo.juego?.nombre}</dd>
              </div>
              <div>
                <dt>Modalidad</dt>
                <dd>{torneo.modalidad}</dd>
              </div>
              <div>
                <dt>Cierre de inscripción</dt>
                <dd>{formatearFecha(torneo.fechaCierreInscripcion)}</dd>
              </div>
              <div>
                <dt>Cupos disponibles</dt>
                <dd>{cuposDisponibles(torneo.cupoMaximo, torneo.cupoOcupado)}</dd>
              </div>
            </dl>

            <h3>Requisitos del torneo</h3>
            <ul className="lista-integrantes list-unstyled">
              <li className="integrante">Edad mínima de 13 años.</li>
              <li className="integrante">Sin sanciones disciplinarias vigentes.</li>
              {porEquipos && <li className="integrante">Nómina completa: {torneo.juego?.integrantesPorEquipo} integrantes por equipo.</li>}
            </ul>
          </article>

          {torneo.video && (
            <section className="mt-4" aria-labelledby="t-trailer">
              <h2 id="t-trailer" className="titulo-seccion">
                Tráiler del torneo
              </h2>
              <VideoEmbebido url={torneo.video} titulo={`Tráiler de ${torneo.nombre}`} />
            </section>
          )}
        </div>

        <div className="col-12 col-lg-5">
          <h2 className="titulo-seccion">Formulario de registro</h2>
          {!autenticado ? (
            <div className="aviso aviso--info" role="status">
              <span>Para inscribirte necesitas una cuenta de jugador.</span>
              <Link className="btn btn-primary align-self-start" to="/login" state={{ desde: ubicacion.pathname + ubicacion.search }}>
                Iniciar sesión
              </Link>
            </div>
          ) : opciones.length === 0 ? (
            <Vacio titulo={porEquipos ? 'No tienes equipos para este juego' : 'No encontramos tu ficha de jugador'}>
              {porEquipos ? (
                <>
                  Crea o únete a un equipo de {torneo.juego?.nombre} en <Link to="/gestion">Mi equipo</Link>.
                </>
              ) : (
                'Intenta cerrar sesión y volver a entrar.'
              )}
            </Vacio>
          ) : (
            <FormularioInscripcion
              key={`${torneo.id}-${inscritos.length}`}
              torneo={torneo}
              opciones={opciones}
              jugadores={jugadores}
              inscritos={inscritos}
              participanteInicialId={!porEquipos && opciones.length === 1 ? opciones[0].id : ''}
              enviando={enviando}
              errorServidor={errorServidor}
              onEnviar={inscribir}
            />
          )}

          {confirmado && (
            <div className="aviso aviso--exito mt-3" role="status">
              <strong>
                <span aria-hidden="true">✔ </span>¡Inscripción confirmada!
              </strong>
              <span>
                {confirmado.nombre} quedó registrado en {confirmado.torneo}.
              </span>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
