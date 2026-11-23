// La sesión se guarda en localStorage con la clave "sesion" = { token, usuario }: sobrevive a una recarga.
// Riesgo conocido: un ataque XSS podría leerla. Por eso nunca se inserta HTML ajeno (sin dangerouslySetInnerHTML)
// y el token vence pronto: un token robado deja de servir cuando llega su exp.
const CLAVE = 'sesion'

// El payload es la parte del medio del JWT, en Base64URL. Cualquiera puede leerlo; solo el backend puede firmarlo.
export function leerPayload(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64))
  } catch {
    return null
  }
}

// exp viene en segundos y Date.now() en milisegundos. Si el token no trae exp, se deja pasar:
// el backend responde 401 cuando no lo acepta y solicitar() cierra la sesión.
function vencida(sesion) {
  const exp = leerPayload(sesion.token)?.exp
  return typeof exp === 'number' && exp * 1000 < Date.now()
}

// Devuelve la sesión guardada o null. Si el token ya venció, la borra.
// El parámetro permite usar un almacén falso en las pruebas.
export function leerSesion(almacen = localStorage) {
  try {
    const texto = almacen.getItem(CLAVE)
    const sesion = texto ? JSON.parse(texto) : null
    if (!sesion?.token) return null
    if (vencida(sesion)) {
      almacen.removeItem(CLAVE)
      return null
    }
    return sesion
  } catch {
    return null
  }
}

// localStorage solo guarda texto: el objeto pasa por JSON.stringify
export function guardarSesion({ token, usuario }, almacen = localStorage) {
  almacen.setItem(CLAVE, JSON.stringify({ token, usuario }))
}

export function borrarSesion(almacen = localStorage) {
  almacen.removeItem(CLAVE)
}
