import { MemoryRouter } from 'react-router'
import TarjetaTorneo from './TarjetaTorneo'
import { montar } from '../pruebas/montar'

describe('TarjetaTorneo (componente)', () => {
  let montaje

  const torneo = {
    id: 1,
    nombre: 'Worlds 2026',
    juego: { id: 1, nombre: 'League of Legends', integrantesPorEquipo: 5 },
    estado: 'abierto',
    modalidad: 'Equipos',
    cupoMaximo: 10,
    cupoOcupado: 9,
    fechaCierreInscripcion: '2026-11-20',
  }

  afterEach(() => montaje?.desmontar())

  const dibujar = (t = torneo) => {
    montaje = montar(
      <MemoryRouter>
        <TarjetaTorneo torneo={t} />
      </MemoryRouter>,
    )
    return montaje.contenedor
  }

  it('muestra el nombre, el juego y el estado del torneo', () => {
    const texto = dibujar().textContent
    expect(texto).toContain('Worlds 2026')
    expect(texto).toContain('League of Legends')
    expect(texto).toContain('Abierto')
  })

  it('incluye una imagen con texto alternativo', () => {
    expect(dibujar().querySelector('img').alt).toContain('League of Legends')
  })

  it('enlaza al detalle y ofrece inscribirse solo si el torneo está abierto', () => {
    const abierto = dibujar()
    expect(abierto.querySelector('a[href="/torneos/1"]')).not.toBeNull()
    expect(abierto.textContent).toContain('Inscribirse')
    montaje.desmontar()

    const finalizado = dibujar({ ...torneo, estado: 'finalizado' })
    expect(finalizado.textContent).not.toContain('Inscribirse')
  })

  it('informa los cupos disponibles', () => {
    expect(dibujar().textContent).toContain('1 cupo(s) disponible(s)')
  })
})
