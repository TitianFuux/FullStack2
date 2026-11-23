import { useState } from 'react'
import Campo from './Campo.jsx'
import { hayErrores, validarApodo, validarClaves, validarCorreo, validarEdad } from '../logica/validaciones.js'

// Edición de los datos de un jugador. Empieza con los datos actuales: quien lo usa le pone key={perfil.id}
// para que, al cambiar de jugador, el formulario se arme de nuevo. onGuardar(payload) devuelve una promesa.
export default function FormularioPerfil({ perfil, onGuardar }) {
  const [form, setForm] = useState({
    apodo: perfil.apodo ?? '',
    correo: perfil.correo ?? '',
    edad: String(perfil.edad ?? ''),
    clave: '',
    confirmar: '',
  })
  const [errores, setErrores] = useState({})
  const [errorServidor, setErrorServidor] = useState('')
  const [exito, setExito] = useState('')
  const [guardando, setGuardando] = useState(false)

  const cambiar = (campo) => (e) => setForm((f) => ({ ...f, [campo]: e.target.value }))

  async function guardar(e) {
    e.preventDefault()
    setErrorServidor('')
    setExito('')
    const claves = validarClaves(form.clave, form.confirmar)
    const encontrados = {
      apodo: validarApodo(form.apodo),
      correo: validarCorreo(form.correo),
      edad: validarEdad(form.edad),
      clave: claves.clave,
      confirmar: claves.confirmar,
    }
    setErrores(encontrados)
    if (hayErrores(encontrados)) return

    setGuardando(true)
    try {
      await onGuardar({
        apodo: form.apodo.trim(),
        correo: form.correo.trim(),
        edad: Number(form.edad),
        ...(form.clave ? { password: form.clave } : {}),
      })
      setForm((f) => ({ ...f, clave: '', confirmar: '' }))
      setExito('Datos del perfil actualizados correctamente.')
    } catch (err) {
      setErrorServidor(err.message)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <form className="formulario" noValidate onSubmit={guardar}>
      <Campo id="perfil-apodo" etiqueta="Apodo" autoComplete="username" value={form.apodo} onChange={cambiar('apodo')} error={errores.apodo} ayuda="Sin espacios, entre 3 y 15 caracteres." />
      <Campo id="perfil-correo" etiqueta="Correo electrónico" tipo="email" autoComplete="email" value={form.correo} onChange={cambiar('correo')} error={errores.correo} />
      <Campo id="perfil-edad" etiqueta="Edad" tipo="number" autoComplete="off" value={form.edad} onChange={cambiar('edad')} error={errores.edad} ayuda="Edad mínima de la plataforma: 13 años." />
      <Campo id="perfil-clave" etiqueta="Nueva contraseña (opcional)" tipo="password" autoComplete="new-password" value={form.clave} onChange={cambiar('clave')} error={errores.clave} placeholder="Mínimo 8 caracteres" />
      <Campo id="perfil-confirmar" etiqueta="Confirmar contraseña" tipo="password" autoComplete="new-password" value={form.confirmar} onChange={cambiar('confirmar')} error={errores.confirmar} />
      {errorServidor && (
        <p className="mensaje-error mb-0" role="alert">
          <span aria-hidden="true">⚠ </span>
          {errorServidor}
        </p>
      )}
      {exito && (
        <div className="aviso aviso--exito" role="status">
          <span>
            <span aria-hidden="true">✔ </span>
            {exito}
          </span>
        </div>
      )}
      <button type="submit" className="btn btn-primary" disabled={guardando}>
        {guardando ? 'Guardando…' : 'Guardar cambios'}
      </button>
    </form>
  )
}
