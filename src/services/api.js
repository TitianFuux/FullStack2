import { API_URL } from '../config.js'
import { borrarSesion, leerSesion } from './sesion.js'

// Mensajes que la persona entiende cuando el backend no envía uno propio en { mensaje }
const MENSAJES = {
  400: 'Revisa los datos del formulario.',
  401: 'Tu sesión no es válida. Vuelve a iniciar sesión.',
  403: 'Tu rol no tiene permiso para realizar esta acción.',
  404: 'No encontramos lo que buscas.',
  409: 'La operación no se puede hacer con el estado actual.',
  500: 'El servidor tuvo un problema. Intenta de nuevo en unos minutos.',
}

export class ErrorApi extends Error {
  constructor(estado, mensaje, errores) {
    super(mensaje)
    this.name = 'ErrorApi'
    this.estado = estado
    this.errores = errores ?? {}
  }
}

export function mensajePorEstado(estado) {
  if (MENSAJES[estado]) return MENSAJES[estado]
  return estado >= 500 ? MENSAJES[500] : 'Ocurrió un error inesperado.'
}

// Función base: todas las peticiones de la aplicación pasan por aquí.
// 1. Arma la URL con VITE_API_URL y agrega el token (Authorization: Bearer) una sola vez.
// 2. Si la API responde 401 y había token, la sesión venció: se borra y se avisa con un evento.
// 3. Convierte cualquier error en un Error con el mensaje del backend o uno propio.
// "sesion: null" evita mandar un token viejo (así un 401 de credenciales no se lee como sesión vencida).
// El tercer parámetro permite reemplazar fetch por un espía en las pruebas.
export async function solicitar(ruta, { sesion = leerSesion(), headers: extra, ...opciones } = {}, traer = fetch) {
  const token = sesion?.token
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  let res
  try {
    // Los headers unidos van al final: así Authorization no se pierde
    res = await traer(`${API_URL}${ruta}`, { ...opciones, headers: { ...headers, ...extra } })
  } catch (e) {
    if (e.name === 'AbortError') throw e
    throw new ErrorApi(0, 'No pudimos conectar con el servidor. Revisa tu conexión o que el backend esté encendido.')
  }

  if (res.status === 401 && token) {
    borrarSesion()
    window.dispatchEvent(new Event('sesion-expirada'))
  }
  if (!res.ok) {
    const cuerpo = await res.json().catch(() => ({}))
    throw new ErrorApi(res.status, cuerpo.mensaje || mensajePorEstado(res.status), cuerpo.errores)
  }
  return res.status === 204 ? null : res.json()
}
