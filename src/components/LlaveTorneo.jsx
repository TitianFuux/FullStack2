import { useState } from 'react'
import ListaPartidas from './ListaPartidas.jsx'

// La ronda visible es estado local (useState)
export default function LlaveTorneo({ rondas }) {
  const [indice, setIndice] = useState(0)

  if (!rondas.length) {
    return <p className="estado-vacio">Las llaves se publicarán cuando el organizador programe las partidas.</p>
  }
  const ronda = rondas[Math.min(indice, rondas.length - 1)]

  return (
    <div>
      <div className="selector-rondas" role="group" aria-label="Seleccionar ronda">
        {rondas.map((r, i) => (
          <button key={r.numero} type="button" className="btn-ronda" aria-pressed={i === indice} onClick={() => setIndice(i)}>
            Ronda {r.numero}
          </button>
        ))}
      </div>
      <ListaPartidas partidas={ronda.partidas ?? []} />
    </div>
  )
}
