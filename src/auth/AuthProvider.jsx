import { useEffect, useState } from 'react'
import { AuthContext } from './useAuth.js'
import { authService } from '../services/auth.js'
import { borrarSesion, guardarSesion, leerSesion } from '../services/sesion.js'
import { ROL, ROLES_GESTION } from '../logica/rutas.js'

export default function AuthProvider({ children }) {
  // leerSesion se pasa sin paréntesis: React la llama una sola vez, en el primer render
  const [sesion, setSesion] = useState(leerSesion) // { token, usuario } o null
  const [expirada, setExpirada] = useState(false)

  // login() y registrar() no atrapan el error a propósito: así la página de login se entera y lo muestra
  async function login(credenciales) {
    return abrirSesion(await authService.login(credenciales))
  }

  async function registrar(datos) {
    return abrirSesion(await authService.registro(datos))
  }

  function abrirSesion(datos) {
    guardarSesion(datos)
    setSesion(datos)
    setExpirada(false)
    return datos
  }

  function logout() {
    borrarSesion()
    setSesion(null)
  }

  // Después de editar el perfil propio, el nombre de la cabecera se actualiza (se conserva el rol del token)
  function actualizarUsuario(cambios) {
    const nueva = { token: sesion.token, usuario: { ...sesion.usuario, ...cambios } }
    guardarSesion(nueva)
    setSesion(nueva)
  }

  // solicitar() no es un componente: no puede usar useAuth(). Cuando la API responde 401 a una petición
  // con token, avisa con este evento y el proveedor deja el estado sin sesión.
  useEffect(() => {
    const alExpirar = () => {
      setSesion(null)
      setExpirada(true)
    }
    window.addEventListener('sesion-expirada', alExpirar)
    return () => window.removeEventListener('sesion-expirada', alExpirar)
  }, [])

  const rol = sesion?.usuario?.rol ?? null
  const valor = {
    usuario: sesion?.usuario ?? null, // los datos para mostrar, o null si no hay sesión
    rol,
    autenticado: sesion !== null,
    esAdmin: rol === ROL.ADMIN,
    esGestion: ROLES_GESTION.includes(rol),
    expirada,
    cerrarAviso: () => setExpirada(false),
    login,
    registrar,
    logout,
    actualizarUsuario,
  }

  // React 19: el contexto se usa directamente como proveedor
  return <AuthContext value={valor}>{children}</AuthContext>
}
