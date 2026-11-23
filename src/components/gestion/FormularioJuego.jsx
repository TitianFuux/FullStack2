import { useState } from 'react'
import Campo from '../Campo.jsx'
import { hayErrores, validarJuego } from '../../logica/validaciones.js'

const INICIAL = { nombre: '', integrantesPorEquipo: '5', modalidad: 'Equipos' }

// Agregar un videojuego habilitado (solo administrador)
export default function FormularioJuego({ onCrear }) {
  const [form, setForm] = useState(INICIAL)
  const [errores, setErrores] = useState({})
  const [errorServidor, setErrorServidor] = useState('')
  const [enviando, setEnviando] = useState(false)

  const cambiar = (campo) => (e) => setForm((f) => ({ ...f, [campo]: e.target.value }))

  async function enviar(e) {
    e.preventDefault()
    setErrorServidor('')
    const encontrados = validarJuego(form)
    setErrores(encontrados)
    if (hayErrores(encontrados)) return

    setEnviando(true)
    try {
      await onCrear({ nombre: form.nombre.trim(), integrantesPorEquipo: Number(form.integrantesPorEquipo), modalidad: form.modalidad })
      setForm(INICIAL)
    } catch (err) {
      setErrorServidor(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form className="formulario" noValidate onSubmit={enviar}>
      <h2 className="titulo-seccion">Agregar videojuego</h2>
      <div className="row g-3">
        <div className="col-12 col-md-5">
          <Campo id="juego-nombre" etiqueta="Nombre" value={form.nombre} onChange={cambiar('nombre')} error={errores.nombre} />
        </div>
        <div className="col-6 col-md-4">
          <Campo id="juego-integrantes" etiqueta="Integrantes por equipo" tipo="number" min="1" value={form.integrantesPorEquipo} onChange={cambiar('integrantesPorEquipo')} error={errores.integrantesPorEquipo} />
        </div>
        <div className="col-6 col-md-3">
          <Campo id="juego-modalidad" etiqueta="Modalidad" as="select" value={form.modalidad} onChange={cambiar('modalidad')}>
            <option value="Equipos">Equipos</option>
            <option value="Individual">Individual</option>
          </Campo>
        </div>
      </div>
      {errorServidor && (
        <p className="mensaje-error mb-0" role="alert">
          <span aria-hidden="true">⚠ </span>
          {errorServidor}
        </p>
      )}
      <button type="submit" className="btn btn-primary align-self-start" disabled={enviando}>
        {enviando ? 'Guardando…' : 'Guardar juego'}
      </button>
    </form>
  )
}
