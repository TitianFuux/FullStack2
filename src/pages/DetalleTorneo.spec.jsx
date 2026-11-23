import { MemoryRouter, Route, Routes } from 'react-router'
import DetalleTorneo from './DetalleTorneo'
import { AuthContext } from '../auth/useAuth'
import { torneosService } from '../services/torneos'
import { inscripcionesService } from '../services/inscripciones'
import { esperar, montar } from '../pruebas/montar'

describe('DetalleTorneo (página)', () => {
  let montaje
  afterEach(() => montaje?.desmontar())

  const torneoFinalizado = {
    id: 4,
    nombre: 'Rocket League Cup',
    juego: { id: 2, nombre: 'Rocket League', integrantesPorEquipo: 3, modalidad: 'Equipos' },
    estado: 'finalizado',
    modalidad: 'Equipos',
    cupoMaximo: 8,
    cupoOcupado: 8,
    fechaInicio: '2026-09-05',
    fechaCierreInscripcion: '2026-08-28',
    descripcion: 'Copa de otoño.',
    video: 'https://www.youtube.com/embed/abc',
    rondas: [{ numero: 1, partidas: [{ id: 1, participanteA: 'Falcons', participanteB: null, horario: 'h', estado: 'pendiente', resultado: null }] }],
    ranking: [
      { participante: 'Neon', puntos: 3, diferencia: -6 },
      { participante: 'Falcons', puntos: 9, diferencia: 5 },
    ],
    premios: [{ posicion: '1° lugar', premio: 'Trofeo' }],
  }

  const abrir = async (sesion = { autenticado: false }, id = '4') => {
    montaje = montar(
      <AuthContext value={sesion}>
        <MemoryRouter initialEntries={[`/torneos/${id}`]}>
          <Routes>
            <Route path="/torneos/:id" element={<DetalleTorneo />} />
          </Routes>
        </MemoryRouter>
      </AuthContext>,
    )
    await esperar()
    return montaje.contenedor
  }

  it('muestra llaves, tabla de posiciones ordenada, premios y el video de la final', async () => {
    spyOn(torneosService, 'obtener').and.returnValue(Promise.resolve(torneoFinalizado))
    const contenedor = await abrir()

    expect(torneosService.obtener.calls.mostRecent().args[0]).toBe('4')
    expect(contenedor.querySelector('h1').textContent).toBe('Rocket League Cup')
    // El ranking se ordena por puntos aunque la API lo entregue desordenado
    const nombres = [...contenedor.querySelectorAll('.tabla-ranking tbody tr')].map((fila) => fila.children[1].textContent)
    expect(nombres).toEqual(['Falcons', 'Neon'])
    expect(contenedor.textContent).toContain('Participante por definir')
    expect(contenedor.textContent).toContain('Trofeo')
    expect(contenedor.querySelector('iframe')).not.toBeNull()
  })

  it('oculta premios y video mientras el torneo no esté finalizado', async () => {
    spyOn(torneosService, 'obtener').and.returnValue(Promise.resolve({ ...torneoFinalizado, estado: 'en_curso' }))
    const contenedor = await abrir()
    expect(contenedor.textContent).not.toContain('Premios')
    expect(contenedor.querySelector('iframe')).toBeNull()
  })

  it('muestra estados vacíos si la API no entrega llaves, ranking ni inscripciones', async () => {
    const { rondas, ranking, premios, ...basico } = torneoFinalizado
    spyOn(torneosService, 'obtener').and.returnValue(Promise.resolve({ ...basico, estado: 'abierto' }))
    const contenedor = await abrir()
    expect(contenedor.textContent).toContain('Las llaves se publicarán')
    expect(contenedor.textContent).toContain('La tabla se calculará')
    expect(contenedor.textContent).toContain('Inicia sesión para ver la lista de participantes')
  })

  it('con sesión lista a los participantes inscritos en este torneo', async () => {
    spyOn(torneosService, 'obtener').and.returnValue(Promise.resolve(torneoFinalizado))
    spyOn(inscripcionesService, 'listar').and.returnValue(
      Promise.resolve([
        { torneo: { id: 4 }, equipo: { id: 1, nombre: 'Falcons' } },
        { torneo: { id: 9 }, equipo: { id: 2, nombre: 'De otro torneo' } },
      ]),
    )
    const contenedor = await abrir({ autenticado: true })
    const lista = contenedor.querySelector('#t-participantes').parentElement.textContent
    expect(lista).toContain('Falcons')
    expect(lista).not.toContain('De otro torneo')
  })

  it('muestra un aviso cuando el torneo no existe (404)', async () => {
    const noExiste = Object.assign(new Error('No encontramos lo que buscas.'), { estado: 404 })
    spyOn(torneosService, 'obtener').and.returnValue(Promise.reject(noExiste))
    const contenedor = await abrir({ autenticado: false }, '99')
    expect(contenedor.textContent).toContain('No encontramos ese torneo')
  })
})
