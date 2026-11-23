// Roles que entrega el backend en el token / en la respuesta del login
export const ROL = { JUGADOR: 'JUGADOR', ORGANIZADOR: 'ORGANIZADOR', ADMIN: 'ADMINISTRADOR' }

// Quienes pueden operar torneos (panel de gestión)
export const ROLES_GESTION = [ROL.ORGANIZADOR, ROL.ADMIN]

// A dónde lleva cada rol después de iniciar sesión
export const INICIO_POR_ROL = { JUGADOR: '/', ORGANIZADOR: '/panel', ADMINISTRADOR: '/panel' }

// Rutas que solo puede abrir cierto rol (las mismas reglas que App.jsx; el backend vuelve a validar)
const RUTAS_POR_ROL = [{ prefijo: '/panel', roles: ROLES_GESTION }]

// Si la persona venía de una ruta protegida y su rol puede abrirla, vuelve ahí; si no, va al inicio de su rol
export function rutaDespuesDeIngresar(rol, desde) {
  const inicio = INICIO_POR_ROL[rol] ?? '/'
  if (!desde || desde === '/login') return inicio
  const regla = RUTAS_POR_ROL.find((r) => desde.startsWith(r.prefijo))
  return !regla || regla.roles.includes(rol) ? desde : inicio
}
