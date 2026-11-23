import Pastilla from './Pastilla.jsx'

const POR_DEFINIR = 'Participante por definir'

export default function ListaPartidas({ partidas }) {
  if (!partidas.length) return <p className="estado-vacio">No hay partidas en esta ronda.</p>
  return (
    <ul className="lista-partidas list-unstyled mb-0">
      {partidas.map((p) => (
        <li key={p.id} className="partida">
          <div className="enfrentamiento">
            <span>{p.participanteA || POR_DEFINIR}</span>
            <span className="vs" aria-hidden="true">
              VS
            </span>
            <span className="visually-hidden"> contra </span>
            <span className={p.participanteB ? '' : 'por-definir'}>{p.participanteB || POR_DEFINIR}</span>
          </div>
          <div className="partida-meta">
            <span className="etiqueta-dato">{p.horario}</span>
            <Pastilla estado={p.estado} />
            {p.resultado && <span className="resultado">{p.resultado}</span>}
          </div>
        </li>
      ))}
    </ul>
  )
}
