import { act } from 'react'
import AuthProvider from './AuthProvider'
import { useAuth } from './useAuth'
import { authService } from '../services/auth'
import { esperar, hacerClic, montar } from '../pruebas/montar'

// Componente de prueba: muestra lo que entrega useAuth y ofrece botones para actuar
function Panel() {
  const { usuario, autenticado, esGestion, expirada, login, logout } = useAuth()
  return (
    <div>
      <p id="quien">{autenticado ? `${usuario.apodo} (${usuario.rol})` : 'sin sesión'}</p>
      <p id="gestion">{esGestion ? 'gestión' : 'sin gestión'}</p>
      {expirada && <p id="expirada">expirada</p>}
      <button id="entrar" type="button" onClick={() => login({ correo: 'ana@correo.cl', password: '12345678' }).catch(() => {})}>
        entrar
      </button>
      <button id="salir" type="button" onClick={logout}>
        salir
      </button>
    </div>
  )
}

const respuestaLogin = (rol) => ({ token: 'a.b.c', usuario: { id: 1, apodo: 'ana', rol } })

describe('AuthProvider', () => {
  let montaje

  beforeEach(() => localStorage.clear())
  afterEach(() => {
    montaje?.desmontar()
    localStorage.clear()
  })

  const texto = (id) => montaje.contenedor.querySelector(id)?.textContent

  it('parte sin sesión', () => {
    montaje = montar(<AuthProvider><Panel /></AuthProvider>)
    expect(texto('#quien')).toBe('sin sesión')
  })

  it('login guarda la sesión en localStorage y actualiza el estado', async () => {
    spyOn(authService, 'login').and.returnValue(Promise.resolve(respuestaLogin('ORGANIZADOR')))
    montaje = montar(<AuthProvider><Panel /></AuthProvider>)

    hacerClic(montaje.contenedor.querySelector('#entrar'))
    await esperar()

    expect(authService.login).toHaveBeenCalledWith({ correo: 'ana@correo.cl', password: '12345678' })
    expect(texto('#quien')).toBe('ana (ORGANIZADOR)')
    expect(texto('#gestion')).toBe('gestión')
    expect(JSON.parse(localStorage.getItem('sesion')).token).toBe('a.b.c')
  })

  it('recupera la sesión guardada al recargar la página', () => {
    localStorage.setItem('sesion', JSON.stringify(respuestaLogin('JUGADOR')))
    montaje = montar(<AuthProvider><Panel /></AuthProvider>)
    expect(texto('#quien')).toBe('ana (JUGADOR)')
    expect(texto('#gestion')).toBe('sin gestión')
  })

  it('logout limpia el estado y el almacenamiento', () => {
    localStorage.setItem('sesion', JSON.stringify(respuestaLogin('JUGADOR')))
    montaje = montar(<AuthProvider><Panel /></AuthProvider>)
    hacerClic(montaje.contenedor.querySelector('#salir'))
    expect(texto('#quien')).toBe('sin sesión')
    expect(localStorage.getItem('sesion')).toBeNull()
  })

  it('el evento sesion-expirada deja la app sin sesión y activa el aviso', () => {
    localStorage.setItem('sesion', JSON.stringify(respuestaLogin('JUGADOR')))
    montaje = montar(<AuthProvider><Panel /></AuthProvider>)
    act(() => window.dispatchEvent(new Event('sesion-expirada')))
    expect(texto('#quien')).toBe('sin sesión')
    expect(texto('#expirada')).toBe('expirada')
  })

  it('un login fallido no deja sesión', async () => {
    spyOn(authService, 'login').and.returnValue(Promise.reject(new Error('Credenciales inválidas')))
    montaje = montar(<AuthProvider><Panel /></AuthProvider>)
    hacerClic(montaje.contenedor.querySelector('#entrar'))
    await esperar()
    expect(texto('#quien')).toBe('sin sesión')
    expect(localStorage.getItem('sesion')).toBeNull()
  })
})
