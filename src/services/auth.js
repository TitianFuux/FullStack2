import { solicitar } from './api.js'

// sesion: null evita enviar un token viejo y que un 401 de credenciales se lea como sesión vencida
export const authService = {
  login: (credenciales) =>
    solicitar('/auth/login', { method: 'POST', body: JSON.stringify(credenciales), sesion: null }),
  registro: (datos) => solicitar('/auth/registro', { method: 'POST', body: JSON.stringify(datos), sesion: null }),
}
