import { MemoryRouter, Route, Routes } from 'react-router'
import Login from './Login'
import { AuthContext } from '../auth/useAuth'
import { enviar, escribir, esperar, hacerClic, montar } from '../pruebas/montar'

describe('Login (página)', () => {
  let montaje
  let login

  beforeEach(() => {
    // Espía: reemplaza a login() del contexto
    login = jasmine.createSpy('login')
  })
  afterEach(() => montaje?.desmontar())

  const abrir = (desde) => {
    const entrada = desde ? { pathname: '/login', state: { desde } } : '/login'
    montaje = montar(
      <AuthContext value={{ login, registrar: jasmine.createSpy('registrar') }}>
        <MemoryRouter initialEntries={[entrada]}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<p>pantalla de inicio</p>} />
            <Route path="/panel" element={<p>pantalla del panel</p>} />
            <Route path="/inscripcion" element={<p>pantalla de inscripción</p>} />
          </Routes>
        </MemoryRouter>
      </AuthContext>,
    )
    return montaje.contenedor
  }
  const formulario = () => montaje.contenedor.querySelector('form')

  it('muestra mensajes propios junto a cada campo y no llama al servicio si hay errores', () => {
    abrir()
    escribir(montaje.contenedor.querySelector('#login-correo'), 'sin-arroba')
    enviar(formulario())

    const mensajes = montaje.contenedor.textContent
    expect(mensajes).toContain('Ingresa un correo válido')
    expect(mensajes).toContain('La contraseña es obligatoria.')
    expect(login).not.toHaveBeenCalled()
  })

  it('con datos válidos inicia sesión y va al inicio de su rol', async () => {
    login.and.returnValue(Promise.resolve({ token: 't', usuario: { rol: 'ORGANIZADOR' } }))
    abrir()
    escribir(montaje.contenedor.querySelector('#login-correo'), 'org@correo.cl')
    escribir(montaje.contenedor.querySelector('#login-password'), 'clave1234')
    enviar(formulario())
    await esperar()

    expect(login).toHaveBeenCalledOnceWith({ correo: 'org@correo.cl', password: 'clave1234' })
    expect(montaje.contenedor.textContent).toContain('pantalla del panel')
  })

  it('vuelve a la ruta que la persona había pedido (state.desde)', async () => {
    login.and.returnValue(Promise.resolve({ token: 't', usuario: { rol: 'JUGADOR' } }))
    abrir('/inscripcion')
    escribir(montaje.contenedor.querySelector('#login-correo'), 'ana@correo.cl')
    escribir(montaje.contenedor.querySelector('#login-password'), 'clave1234')
    enviar(formulario())
    await esperar()

    expect(montaje.contenedor.textContent).toContain('pantalla de inscripción')
  })

  it('muestra el mensaje del servidor cuando las credenciales son inválidas', async () => {
    login.and.returnValue(Promise.reject(new Error('Credenciales inválidas')))
    abrir()
    escribir(montaje.contenedor.querySelector('#login-correo'), 'ana@correo.cl')
    escribir(montaje.contenedor.querySelector('#login-password'), 'incorrecta')
    enviar(formulario())
    await esperar()

    expect(montaje.contenedor.querySelector('[role="alert"].aviso').textContent).toContain('Credenciales inválidas')
    expect(montaje.contenedor.textContent).not.toContain('pantalla de inicio')
  })

  it('cambia al formulario de registro con sus campos adicionales', () => {
    abrir()
    expect(montaje.contenedor.querySelector('#login-apodo')).toBeNull()
    hacerClic(montaje.contenedor.querySelector('button[type="button"]'))
    expect(montaje.contenedor.querySelector('#login-apodo')).not.toBeNull()
    expect(montaje.contenedor.querySelector('h1').textContent).toContain('Crear cuenta')
  })
})
