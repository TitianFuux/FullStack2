import { borrarSesion, guardarSesion, leerPayload, leerSesion } from './sesion'

// Almacén falso con la misma interfaz que localStorage: las pruebas no tocan el del navegador
function crearAlmacen() {
  const datos = {}
  return {
    getItem: (clave) => (clave in datos ? datos[clave] : null),
    setItem: (clave, valor) => { datos[clave] = String(valor) },
    removeItem: (clave) => { delete datos[clave] },
  }
}

// Un JWT de mentira: lo único que se lee es el payload (la parte del medio)
const tokenCon = (payload) => `cabecera.${btoa(JSON.stringify(payload))}.firma`
const usuario = { id: 1, apodo: 'ana', rol: 'JUGADOR' }

describe('sesion', () => {
  let almacen

  beforeEach(() => {
    almacen = crearAlmacen()
  })

  it('guarda y devuelve la sesión', () => {
    const token = tokenCon({ exp: Math.floor(Date.now() / 1000) + 3600 })
    guardarSesion({ token, usuario }, almacen)
    expect(leerSesion(almacen)).toEqual({ token, usuario })
  })

  it('devuelve null si no hay nada guardado', () => {
    expect(leerSesion(almacen)).toBeNull()
  })

  it('borra y devuelve null cuando el token ya venció', () => {
    const token = tokenCon({ exp: Math.floor(Date.now() / 1000) - 60 })
    guardarSesion({ token, usuario }, almacen)
    expect(leerSesion(almacen)).toBeNull()
    expect(almacen.getItem('sesion')).toBeNull()
  })

  it('deja pasar un token sin exp: el backend decide con un 401', () => {
    const token = tokenCon({ sub: 'ana' })
    guardarSesion({ token, usuario }, almacen)
    expect(leerSesion(almacen)).not.toBeNull()
  })

  it('no falla con un texto guardado que no es JSON', () => {
    almacen.setItem('sesion', '{roto')
    expect(leerSesion(almacen)).toBeNull()
  })

  it('borrarSesion elimina la clave', () => {
    guardarSesion({ token: tokenCon({}), usuario }, almacen)
    borrarSesion(almacen)
    expect(leerSesion(almacen)).toBeNull()
  })
})

describe('leerPayload', () => {
  it('lee la parte del medio del token', () => {
    expect(leerPayload(tokenCon({ rol: 'ADMINISTRADOR' }))).toEqual({ rol: 'ADMINISTRADOR' })
  })

  it('devuelve null si el token no tiene el formato de un JWT', () => {
    expect(leerPayload('no-es-un-jwt')).toBeNull()
  })
})
