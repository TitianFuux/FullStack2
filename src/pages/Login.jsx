import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useAuth } from '../auth/useAuth.js'
import { rutaDespuesDeIngresar } from '../logica/rutas.js'
import { hayErrores, validarLogin, validarRegistro } from '../logica/validaciones.js'
import Campo from '../components/Campo.jsx'

const VACIO = { nombre: '', apodo: '', correo: '', edad: '20', password: '' }

export default function Login() {
  const { login, registrar } = useAuth()
  const navigate = useNavigate()
  const ubicacion = useLocation()

  const [modoRegistro, setModoRegistro] = useState(false)
  const [form, setForm] = useState(VACIO)
  const [errores, setErrores] = useState({})
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  const cambiar = (campo) => (e) => setForm((f) => ({ ...f, [campo]: e.target.value }))

  function cambiarModo() {
    setModoRegistro(!modoRegistro)
    setErrores({})
    setError('')
  }

  async function enviar(e) {
    e.preventDefault()
    setError('')
    const encontrados = modoRegistro ? validarRegistro(form) : validarLogin(form)
    setErrores(encontrados)
    if (hayErrores(encontrados)) return

    setEnviando(true)
    try {
      // Mensajes diferenciados: el backend responde distinto a credenciales inválidas y a cuenta desactivada
      const sesion = modoRegistro
        ? await registrar({ nombre: form.nombre.trim(), apodo: form.apodo.trim(), correo: form.correo.trim(), edad: Number(form.edad), password: form.password })
        : await login({ correo: form.correo.trim(), password: form.password })
      // Vuelve a la ruta protegida que pidió (state.desde) o va al inicio de su rol
      navigate(rutaDespuesDeIngresar(sesion.usuario?.rol, ubicacion.state?.desde), { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <main id="contenido-principal" className="container seccion">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <h1 className="titulo-pagina">{modoRegistro ? 'Crear cuenta' : 'Iniciar sesión'}</h1>
          <p className="lead-texto">
            {modoRegistro ? 'Regístrate como jugador para inscribirte en torneos y crear equipos.' : 'Accede con tu correo y contraseña.'}
          </p>

          <form className="formulario" noValidate onSubmit={enviar}>
            {modoRegistro && (
              <>
                <Campo id="login-nombre" etiqueta="Nombre completo" autoComplete="name" value={form.nombre} onChange={cambiar('nombre')} error={errores.nombre} />
                <Campo id="login-apodo" etiqueta="Apodo" autoComplete="username" value={form.apodo} onChange={cambiar('apodo')} error={errores.apodo} ayuda="Sin espacios, entre 3 y 15 caracteres." />
                <Campo id="login-edad" etiqueta="Edad" tipo="number" value={form.edad} onChange={cambiar('edad')} error={errores.edad} ayuda="Edad mínima: 13 años." />
              </>
            )}
            <Campo id="login-correo" etiqueta="Correo electrónico" tipo="email" autoComplete="email" value={form.correo} onChange={cambiar('correo')} error={errores.correo} />
            <Campo
              id="login-password"
              etiqueta="Contraseña"
              tipo="password"
              autoComplete={modoRegistro ? 'new-password' : 'current-password'}
              value={form.password}
              onChange={cambiar('password')}
              error={errores.password}
              ayuda={modoRegistro ? 'Mínimo 8 caracteres.' : undefined}
            />

            {error && (
              <div className="aviso aviso--error" role="alert">
                <span>
                  <span aria-hidden="true">⚠ </span>
                  {error}
                </span>
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={enviando}>
              {enviando ? 'Enviando…' : modoRegistro ? 'Crear cuenta' : 'Entrar'}
            </button>
            <button type="button" className="btn btn-outline-light" onClick={cambiarModo}>
              {modoRegistro ? 'Ya tengo cuenta: iniciar sesión' : 'No tengo cuenta: registrarme'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
