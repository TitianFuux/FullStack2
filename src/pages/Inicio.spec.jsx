import { MemoryRouter } from 'react-router'
import Inicio from './Inicio'
import { torneosService } from '../services/torneos'
import { juegosService } from '../services/juegos'
import { esperar, montar } from '../pruebas/montar'

describe('Inicio (página)', () => {
  let montaje
  afterEach(() => montaje?.desmontar())

  const juego = { id: 1, nombre: 'League of Legends', integrantesPorEquipo: 5, modalidad: 'Equipos' }
  const torneo = (id, nombre, estado) => ({
    id,
    nombre,
    juego,
    estado,
    modalidad: 'Equipos',
    cupoMaximo: 10,
    cupoOcupado: 4,
    fechaInicio: '2099-12-05',
    fechaCierreInscripcion: '2099-11-20',
  })

  const abrir = async () => {
    montaje = montar(
      <MemoryRouter>
        <Inicio />
      </MemoryRouter>,
    )
    await esperar()
    return montaje.contenedor
  }

  it('muestra los torneos y los juegos que entrega la API', async () => {
    // Espías: reemplazan a los servicios y devuelven los datos al instante
    spyOn(torneosService, 'listar').and.returnValue(Promise.resolve([torneo(1, 'Worlds 2026', 'abierto'), torneo(2, 'Copa Vieja', 'finalizado')]))
    spyOn(juegosService, 'listar').and.returnValue(Promise.resolve([juego]))

    const contenedor = await abrir()

    expect(torneosService.listar).toHaveBeenCalledTimes(1)
    expect(contenedor.textContent).toContain('Worlds 2026')
    expect(contenedor.textContent).toContain('League of Legends')
    // El torneo finalizado no se destaca
    expect(contenedor.textContent).not.toContain('Copa Vieja')
  })

  it('muestra el estado de carga mientras espera la respuesta', () => {
    spyOn(torneosService, 'listar').and.returnValue(new Promise(() => {}))
    spyOn(juegosService, 'listar').and.returnValue(new Promise(() => {}))
    montaje = montar(
      <MemoryRouter>
        <Inicio />
      </MemoryRouter>,
    )
    expect(montaje.contenedor.querySelector('[role="status"]').textContent).toContain('Cargando')
  })

  it('muestra el error y permite reintentar cuando el servidor no responde', async () => {
    spyOn(torneosService, 'listar').and.returnValue(Promise.reject(new Error('No pudimos conectar con el servidor.')))
    spyOn(juegosService, 'listar').and.returnValue(Promise.resolve([]))

    const contenedor = await abrir()

    expect(contenedor.querySelector('[role="alert"]').textContent).toContain('No pudimos conectar')
    expect(contenedor.textContent).toContain('Reintentar')
  })

  it('muestra estados vacíos explícitos si no hay torneos ni juegos', async () => {
    spyOn(torneosService, 'listar').and.returnValue(Promise.resolve([]))
    spyOn(juegosService, 'listar').and.returnValue(Promise.resolve([]))

    const contenedor = await abrir()

    expect(contenedor.textContent).toContain('Aún no hay juegos habilitados')
    expect(contenedor.textContent).toContain('No hay torneos abiertos o en curso por ahora')
  })
})
