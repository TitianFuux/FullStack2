import { useState } from 'react'
import ImagenJuego from './ImagenJuego.jsx'
import Pastilla from './Pastilla.jsx'
import Campo from './Campo.jsx'
import { visualJuego } from '../logica/juegos.js'
import { equipoCompleto, tieneSancionActiva } from '../logica/reglas.js'

// Un equipo con su plantilla. Si quien mira puede gestionarlo (capitán o administrador), ve las acciones de agregar y quitar.
// onAgregar(equipo, { usuarioId, rolEquipo }) y onQuitar(equipo, usuarioId) devuelven promesas.
export default function TarjetaEquipo({ equipo, jugadores, puedeGestionar, onAgregar, onQuitar }) {
  const [usuarioId, setUsuarioId] = useState('')
  const [rolEquipo, setRolEquipo] = useState('Titular')
  const [error, setError] = useState('')

  const integrantes = equipo.integrantes ?? []
  const exigidos = equipo.juego?.integrantesPorEquipo ?? 1
  const completo = equipoCompleto(equipo, equipo.juego)

  async function agregar() {
    setError('')
    const jugador = jugadores.find((j) => String(j.id) === usuarioId)
    if (!jugador) return setError('Selecciona un jugador para agregar.')
    if (integrantes.some((i) => i.usuario?.id === jugador.id)) return setError('Ese jugador ya pertenece al equipo.')
    if (tieneSancionActiva(jugador)) return setError('El jugador tiene una sanción vigente y no puede ser agregado.')
    try {
      await onAgregar(equipo, { usuarioId: jugador.id, rolEquipo })
      setUsuarioId('')
    } catch (err) {
      setError(err.message)
    }
  }

  async function quitar(integrante) {
    setError('')
    try {
      await onQuitar(equipo, integrante.usuario.id)
    } catch (err) {
      setError(err.message)
    }
  }

  const disponibles = jugadores.filter((j) => !integrantes.some((i) => i.usuario?.id === j.id))

  return (
    <article className="tarjeta-torneo" style={{ '--color-juego': visualJuego(equipo.juego).color }}>
      <div className="tarjeta-portada tarjeta-portada--baja">
        <ImagenJuego juego={equipo.juego} />
        <Pastilla estado={equipo.activo === false ? 'inactivo' : 'activo'} />
      </div>
      <div className="tarjeta-cuerpo">
        <p className="juego-etiqueta">{equipo.juego?.nombre}</p>
        <h3>{equipo.nombre}</h3>
        <p className="etiqueta-dato mb-0">
          Capitán: {equipo.capitan?.apodo ?? '—'} · {integrantes.length} de {exigidos} integrantes
          {completo ? ' · listo para inscribirse' : ' · incompleto'}
        </p>

        <ul className="lista-integrantes list-unstyled mb-0">
          {integrantes.map((i) => {
            const esCapitan = i.usuario?.id === equipo.capitan?.id
            return (
              <li className="integrante" key={i.usuario?.id}>
                <span>
                  <strong>{i.usuario?.apodo}</strong> <span className="etiqueta-dato">({i.rolEquipo})</span>
                </span>
                {puedeGestionar && !esCapitan && (
                  <button type="button" className="btn btn-outline-danger" onClick={() => quitar(i)}>
                    Quitar
                  </button>
                )}
              </li>
            )
          })}
        </ul>

        {puedeGestionar && (
          <div className="agregar-integrante">
            <div className="row g-2">
              <div className="col-7">
                <Campo id={`agregar-${equipo.id}`} etiqueta="Agregar jugador" as="select" value={usuarioId} onChange={(e) => setUsuarioId(e.target.value)}>
                  <option value="">Selecciona un jugador</option>
                  {disponibles.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.apodo}
                    </option>
                  ))}
                </Campo>
              </div>
              <div className="col-5">
                <Campo id={`rol-${equipo.id}`} etiqueta="Rol" as="select" value={rolEquipo} onChange={(e) => setRolEquipo(e.target.value)}>
                  <option value="Titular">Titular</option>
                  <option value="Suplente">Suplente</option>
                </Campo>
              </div>
            </div>
            {error && (
              <p className="mensaje-error" role="alert">
                <span aria-hidden="true">⚠ </span>
                {error}
              </p>
            )}
            <button type="button" className="btn btn-primary" onClick={agregar}>
              Agregar al equipo
            </button>
          </div>
        )}
        {!puedeGestionar && error && <p className="mensaje-error">{error}</p>}
      </div>
    </article>
  )
}
