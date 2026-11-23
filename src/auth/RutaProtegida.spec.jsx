import { MemoryRouter, Route, Routes } from 'react-router'
import RutaProtegida from './RutaProtegida'
import { AuthContext } from './useAuth'
import { montar } from '../pruebas/montar'

describe('RutaProtegida', () => {
  let montaje
  afterEach(() => montaje?.desmontar())

  // Monta /panel protegida con una sesión simulada; /login es una pantalla de mentira
  const abrir = (sesion, rol) => {
    montaje = montar(
      <AuthContext value={sesion}>
        <MemoryRouter initialEntries={['/panel']}>
          <Routes>
            <Route path="/login" element={<p>pantalla de login</p>} />
            <Route path="/panel" element={<RutaProtegida rol={rol}><p>contenido del panel</p></RutaProtegida>} />
          </Routes>
        </MemoryRouter>
      </AuthContext>,
    )
    return montaje.contenedor.textContent
  }

  it('sin sesión lleva a /login', () => {
    expect(abrir({ autenticado: false, usuario: null }, ['ORGANIZADOR'])).toContain('pantalla de login')
  })

  it('con sesión y el rol exigido muestra el contenido', () => {
    const texto = abrir({ autenticado: true, usuario: { rol: 'ORGANIZADOR' } }, ['ORGANIZADOR', 'ADMINISTRADOR'])
    expect(texto).toContain('contenido del panel')
  })

  it('con sesión pero sin el rol exigido avisa que no tiene permiso', () => {
    const texto = abrir({ autenticado: true, usuario: { rol: 'JUGADOR' } }, ['ORGANIZADOR', 'ADMINISTRADOR'])
    expect(texto).toContain('No tienes permiso')
    expect(texto).not.toContain('contenido del panel')
  })

  it('sin rol exigido basta con haber iniciado sesión', () => {
    expect(abrir({ autenticado: true, usuario: { rol: 'JUGADOR' } })).toContain('contenido del panel')
  })
})
