import { rutaDespuesDeIngresar, ROL } from './rutas'

describe('rutaDespuesDeIngresar', () => {
  it('lleva a cada rol a su inicio si no venía de otra ruta', () => {
    expect(rutaDespuesDeIngresar(ROL.JUGADOR)).toBe('/')
    expect(rutaDespuesDeIngresar(ROL.ORGANIZADOR)).toBe('/panel')
    expect(rutaDespuesDeIngresar(ROL.ADMIN, '/login')).toBe('/panel')
  })

  it('vuelve a la ruta pedida si el rol puede abrirla', () => {
    expect(rutaDespuesDeIngresar(ROL.ORGANIZADOR, '/panel')).toBe('/panel')
    expect(rutaDespuesDeIngresar(ROL.JUGADOR, '/inscripcion?id=3')).toBe('/inscripcion?id=3')
  })

  it('manda al inicio del rol si la ruta pedida no le corresponde', () => {
    expect(rutaDespuesDeIngresar(ROL.JUGADOR, '/panel')).toBe('/')
  })
})
