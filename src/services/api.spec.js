import { ErrorApi, mensajePorEstado, solicitar } from './api'

// Respuesta falsa con lo mínimo que usa solicitar()
const respuesta = (estado, cuerpo, ok = estado >= 200 && estado < 300) => ({
  ok,
  status: estado,
  json: cuerpo === undefined ? () => Promise.reject(new Error('sin cuerpo')) : () => Promise.resolve(cuerpo),
})

describe('solicitar', () => {
  const sesion = { token: 'abc.def.ghi', usuario: { id: 1 } }

  afterEach(() => localStorage.clear())

  it('agrega el token en la cabecera Authorization', async () => {
    const traer = jasmine.createSpy('traer').and.returnValue(Promise.resolve(respuesta(200, [])))
    await solicitar('/torneos', { sesion }, traer)
    const [url, opciones] = traer.calls.mostRecent().args
    expect(url).toContain('/torneos')
    expect(opciones.headers.Authorization).toBe('Bearer abc.def.ghi')
    expect(opciones.headers['Content-Type']).toBe('application/json')
  })

  it('no envía Authorization si no hay sesión', async () => {
    const traer = jasmine.createSpy('traer').and.returnValue(Promise.resolve(respuesta(200, {})))
    await solicitar('/auth/login', { sesion: null, method: 'POST' }, traer)
    const [, opciones] = traer.calls.mostRecent().args
    expect(opciones.headers.Authorization).toBeUndefined()
    expect(opciones.method).toBe('POST')
  })

  it('devuelve el JSON de la respuesta y null cuando es 204', async () => {
    const traerDatos = () => Promise.resolve(respuesta(200, [{ id: 1 }]))
    const traerVacio = () => Promise.resolve(respuesta(204))
    expect(await solicitar('/torneos', { sesion: null }, traerDatos)).toEqual([{ id: 1 }])
    expect(await solicitar('/torneos/1', { sesion: null, method: 'DELETE' }, traerVacio)).toBeNull()
  })

  it('en un 401 con token borra la sesión y avisa con el evento sesion-expirada', async () => {
    localStorage.setItem('sesion', JSON.stringify(sesion))
    const aviso = jasmine.createSpy('aviso')
    window.addEventListener('sesion-expirada', aviso)
    const traer = () => Promise.resolve(respuesta(401, { mensaje: 'Token vencido' }))

    await expectAsync(solicitar('/inscripciones', { sesion }, traer)).toBeRejectedWithError('Token vencido')

    window.removeEventListener('sesion-expirada', aviso)
    expect(aviso).toHaveBeenCalledTimes(1)
    expect(localStorage.getItem('sesion')).toBeNull()
  })

  it('un 401 sin token (credenciales inválidas) no cierra ninguna sesión', async () => {
    const aviso = jasmine.createSpy('aviso')
    window.addEventListener('sesion-expirada', aviso)
    const traer = () => Promise.resolve(respuesta(401, { mensaje: 'Credenciales inválidas' }))

    await expectAsync(solicitar('/auth/login', { sesion: null }, traer)).toBeRejectedWithError('Credenciales inválidas')

    window.removeEventListener('sesion-expirada', aviso)
    expect(aviso).not.toHaveBeenCalled()
  })

  it('usa el mensaje del backend y, si no lo hay, uno propio según el código', async () => {
    const con = () => Promise.resolve(respuesta(403, { mensaje: 'Solo el administrador puede eliminar' }))
    const sin = () => Promise.resolve(respuesta(404))
    await expectAsync(solicitar('/x', { sesion: null }, con)).toBeRejectedWithError('Solo el administrador puede eliminar')
    await expectAsync(solicitar('/x', { sesion: null }, sin)).toBeRejectedWithError(mensajePorEstado(404))
  })

  it('el error lleva el código HTTP', async () => {
    const traer = () => Promise.resolve(respuesta(403, { mensaje: 'Sin permiso' }))
    try {
      await solicitar('/x', { sesion: null }, traer)
      fail('debía fallar')
    } catch (e) {
      expect(e instanceof ErrorApi).toBeTrue()
      expect(e.estado).toBe(403)
    }
  })

  it('si no hay conexión entrega un mensaje comprensible', async () => {
    const traer = () => Promise.reject(new TypeError('Failed to fetch'))
    try {
      await solicitar('/torneos', { sesion: null }, traer)
      fail('debía fallar')
    } catch (e) {
      expect(e.estado).toBe(0)
      expect(e.message).toContain('No pudimos conectar')
    }
  })

  it('deja pasar el AbortError para que quien cancela lo ignore', async () => {
    const cancelada = Object.assign(new Error('cancelada'), { name: 'AbortError' })
    const traer = () => Promise.reject(cancelada)
    await expectAsync(solicitar('/torneos', { sesion: null }, traer)).toBeRejectedWith(cancelada)
  })
})

describe('mensajePorEstado', () => {
  it('traduce los códigos que la persona puede ver', () => {
    expect(mensajePorEstado(400)).toContain('Revisa')
    expect(mensajePorEstado(403)).toContain('permiso')
    expect(mensajePorEstado(503)).toContain('servidor')
    expect(mensajePorEstado(418)).toContain('inesperado')
  })
})
