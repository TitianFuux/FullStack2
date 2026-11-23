import { useState } from 'react'
import { esPorEquipos, evaluarInscripcion } from '../logica/reglas.js'

// Formulario controlado de inscripción.
// Props: torneo, opciones (equipos o jugadores que puede inscribir quien lo usa), jugadores (para revisar sanciones),
// inscritos (inscripciones ya existentes), participanteInicialId, enviando, errorServidor y onEnviar(participante).
// El botón queda deshabilitado mientras exista un motivo de bloqueo: plazo, cupo, duplicidad, sanción,
// equipo inactivo o incompleto. El backend vuelve a validar todo.
export default function FormularioInscripcion({
  torneo,
  opciones = [],
  jugadores = [],
  inscritos = [],
  participanteInicialId = '',
  enviando = false,
  errorServidor = '',
  onEnviar,
}) {
  const porEquipos = esPorEquipos(torneo)
  const [participanteId, setParticipanteId] = useState(String(participanteInicialId))
  const [errorCampo, setErrorCampo] = useState('')

  const participante = opciones.find((o) => String(o.id) === participanteId) || null
  const motivo = evaluarInscripcion({ torneo, participante, inscritos, jugadores })
  const mensaje = motivo || errorCampo || errorServidor

  const manejarEnvio = (evento) => {
    evento.preventDefault()
    if (!participante) {
      setErrorCampo(`Debes seleccionar ${porEquipos ? 'un equipo' : 'un jugador'} para inscribir.`)
      return
    }
    if (motivo) return
    setErrorCampo('')
    onEnviar(participante)
  }

  const etiquetaOpcion = (o) => (porEquipos ? `${o.nombre}${o.activo === false ? ' (inactivo)' : ''}` : `${o.apodo} — ${o.nombre}`)

  return (
    <form className="formulario" noValidate onSubmit={manejarEnvio}>
      <div className={`campo ${mensaje ? 'con-error' : ''}`}>
        <label htmlFor="participante" className="form-label">
          {porEquipos ? 'Selecciona tu equipo' : 'Selecciona al jugador'}
        </label>
        <select
          id="participante"
          className="form-select"
          value={participanteId}
          aria-invalid={Boolean(mensaje)}
          aria-describedby="error-participante"
          onChange={(e) => {
            setParticipanteId(e.target.value)
            setErrorCampo('')
          }}
        >
          <option value="">Selecciona una opción</option>
          {opciones.map((o) => (
            <option key={o.id} value={o.id}>
              {etiquetaOpcion(o)}
            </option>
          ))}
        </select>
        <div id="error-participante" className="mensaje-error" role="alert">
          {mensaje && (
            <>
              <span aria-hidden="true">⚠ </span>
              {mensaje}
            </>
          )}
        </div>
      </div>

      <button type="submit" className="btn btn-primary" disabled={Boolean(motivo) || enviando}>
        {enviando ? 'Registrando inscripción…' : 'Confirmar inscripción'}
      </button>
    </form>
  )
}
