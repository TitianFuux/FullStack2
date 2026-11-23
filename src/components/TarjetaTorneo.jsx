import { Link } from 'react-router'
import ImagenJuego from './ImagenJuego.jsx'
import Pastilla from './Pastilla.jsx'
import { visualJuego } from '../logica/juegos.js'
import { formatearFecha } from '../logica/formato.js'
import { cuposDisponibles } from '../logica/reglas.js'

// Recibe el torneo tal como lo entrega la API (con su juego dentro)
export default function TarjetaTorneo({ torneo }) {
  const juego = torneo.juego
  const libres = cuposDisponibles(torneo.cupoMaximo, torneo.cupoOcupado)
  const porcentaje = Math.min(100, Math.round((torneo.cupoOcupado / torneo.cupoMaximo) * 100)) || 0

  return (
    <article className="tarjeta-torneo h-100" style={{ '--color-juego': visualJuego(juego).color }}>
      <div className="tarjeta-portada">
        <ImagenJuego juego={juego} />
        <Pastilla estado={torneo.estado} />
      </div>
      <div className="tarjeta-cuerpo">
        <p className="juego-etiqueta">
          {juego ? juego.nombre : 'Juego no disponible'} · {torneo.modalidad}
        </p>
        <h3>{torneo.nombre}</h3>

        <div>
          <div className="barra-cupo" role="img" aria-label={`${torneo.cupoOcupado} de ${torneo.cupoMaximo} cupos ocupados`}>
            <span style={{ width: `${porcentaje}%` }} />
          </div>
          <p className="etiqueta-dato mb-0">
            {libres > 0 ? `${libres} cupo(s) disponible(s)` : 'Sin cupos'} · {torneo.cupoOcupado}/{torneo.cupoMaximo}
          </p>
        </div>

        <div className="fila-meta">
          <span>Cierra inscripción</span>
          <span>{formatearFecha(torneo.fechaCierreInscripcion)}</span>
        </div>

        <div className="d-flex flex-wrap gap-2 mt-auto">
          <Link className="btn btn-outline-light" to={`/torneos/${torneo.id}`}>
            Ver detalle
          </Link>
          {torneo.estado === 'abierto' && (
            <Link className="btn btn-primary" to={`/inscripcion?id=${torneo.id}`}>
              Inscribirse
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}
