import { useState } from 'react'
import Campo from '../Campo.jsx'
import { hayErrores, validarTorneo } from '../../logica/validaciones.js'

const INICIAL = { nombre: '', juegoId: '', modalidad: 'Equipos', cupoMaximo: '16', fechaCierreInscripcion: '', fechaInicio: '', descripcion: '' }

// Crear un torneo. onCrear(datos) devuelve una promesa: si falla, el mensaje del servidor se muestra aquí.
export default function FormularioTorneo({ juegos, onCrear }) {
  const [form, setForm] = useState(INICIAL)
  const [errores, setErrores] = useState({})
  const [errorServidor, setErrorServidor] = useState('')
  const [enviando, setEnviando] = useState(false)

  const cambiar = (campo) => (e) => {
    const valor = e.target.value
    setForm((f) => {
      const nuevo = { ...f, [campo]: valor }
      // Al elegir el juego se propone su modalidad
      if (campo === 'juegoId') {
        const juego = juegos.find((j) => String(j.id) === valor)
        if (juego?.modalidad) nuevo.modalidad = juego.modalidad
      }
      return nuevo
    })
  }

  async function enviar(e) {
    e.preventDefault()
    setErrorServidor('')
    const encontrados = validarTorneo(form)
    setErrores(encontrados)
    if (hayErrores(encontrados)) return

    setEnviando(true)
    try {
      await onCrear({
        nombre: form.nombre.trim(),
        juegoId: Number(form.juegoId),
        modalidad: form.modalidad,
        cupoMaximo: Number(form.cupoMaximo),
        fechaCierreInscripcion: form.fechaCierreInscripcion,
        fechaInicio: form.fechaInicio,
        descripcion: form.descripcion.trim(),
      })
      setForm(INICIAL)
    } catch (err) {
      setErrorServidor(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form className="formulario" noValidate onSubmit={enviar}>
      <h2 className="titulo-seccion">Crear torneo</h2>
      <div className="row g-3">
        <div className="col-12 col-md-6">
          <Campo id="torneo-nombre" etiqueta="Nombre" value={form.nombre} onChange={cambiar('nombre')} error={errores.nombre} />
        </div>
        <div className="col-12 col-md-6">
          <Campo id="torneo-juego" etiqueta="Videojuego" as="select" value={form.juegoId} onChange={cambiar('juegoId')} error={errores.juegoId}>
            <option value="">Elige un juego</option>
            {juegos.map((j) => (
              <option key={j.id} value={j.id}>
                {j.nombre}
              </option>
            ))}
          </Campo>
        </div>
        <div className="col-6 col-md-3">
          <Campo id="torneo-modalidad" etiqueta="Modalidad" as="select" value={form.modalidad} onChange={cambiar('modalidad')}>
            <option value="Equipos">Equipos</option>
            <option value="Individual">Individual</option>
          </Campo>
        </div>
        <div className="col-6 col-md-3">
          <Campo id="torneo-cupo" etiqueta="Cupo máximo" tipo="number" min="1" value={form.cupoMaximo} onChange={cambiar('cupoMaximo')} error={errores.cupoMaximo} />
        </div>
        <div className="col-6 col-md-3">
          <Campo id="torneo-cierre" etiqueta="Cierre de inscripción" tipo="date" value={form.fechaCierreInscripcion} onChange={cambiar('fechaCierreInscripcion')} error={errores.fechaCierreInscripcion} />
        </div>
        <div className="col-6 col-md-3">
          <Campo id="torneo-inicio" etiqueta="Inicio" tipo="date" value={form.fechaInicio} onChange={cambiar('fechaInicio')} error={errores.fechaInicio} />
        </div>
      </div>
      <Campo id="torneo-descripcion" etiqueta="Descripción (opcional)" value={form.descripcion} onChange={cambiar('descripcion')} />
      {errorServidor && (
        <p className="mensaje-error mb-0" role="alert">
          <span aria-hidden="true">⚠ </span>
          {errorServidor}
        </p>
      )}
      <button type="submit" className="btn btn-primary align-self-start" disabled={enviando}>
        {enviando ? 'Publicando…' : 'Publicar torneo'}
      </button>
    </form>
  )
}
