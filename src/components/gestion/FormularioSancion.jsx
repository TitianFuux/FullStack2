import { useState } from 'react'
import Campo from '../Campo.jsx'
import { hayErrores, validarSancion } from '../../logica/validaciones.js'

const INICIAL = { usuarioId: '', motivo: '', duracion: '3 fechas' }

// Aplicar una sanción con motivo y duración
export default function FormularioSancion({ jugadores, onSancionar }) {
  const [form, setForm] = useState(INICIAL)
  const [errores, setErrores] = useState({})
  const [errorServidor, setErrorServidor] = useState('')
  const [enviando, setEnviando] = useState(false)

  const cambiar = (campo) => (e) => setForm((f) => ({ ...f, [campo]: e.target.value }))

  async function enviar(e) {
    e.preventDefault()
    setErrorServidor('')
    const encontrados = validarSancion(form)
    setErrores(encontrados)
    if (hayErrores(encontrados)) return

    setEnviando(true)
    try {
      await onSancionar({ usuarioId: Number(form.usuarioId), motivo: form.motivo.trim(), duracion: form.duracion.trim() })
      setForm(INICIAL)
    } catch (err) {
      setErrorServidor(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form className="formulario" noValidate onSubmit={enviar}>
      <h2 className="titulo-seccion">Aplicar sanción</h2>
      <div className="row g-3">
        <div className="col-12 col-md-4">
          <Campo id="sancion-jugador" etiqueta="Jugador" as="select" value={form.usuarioId} onChange={cambiar('usuarioId')} error={errores.usuarioId}>
            <option value="">Elige un jugador</option>
            {jugadores.map((j) => (
              <option key={j.id} value={j.id}>
                {j.apodo}
              </option>
            ))}
          </Campo>
        </div>
        <div className="col-12 col-md-5">
          <Campo id="sancion-motivo" etiqueta="Motivo" value={form.motivo} onChange={cambiar('motivo')} error={errores.motivo} />
        </div>
        <div className="col-12 col-md-3">
          <Campo id="sancion-duracion" etiqueta="Duración" value={form.duracion} onChange={cambiar('duracion')} error={errores.duracion} />
        </div>
      </div>
      {errorServidor && (
        <p className="mensaje-error mb-0" role="alert">
          <span aria-hidden="true">⚠ </span>
          {errorServidor}
        </p>
      )}
      <button type="submit" className="btn btn-primary align-self-start" disabled={enviando}>
        {enviando ? 'Aplicando…' : 'Sancionar'}
      </button>
    </form>
  )
}
