import TablaRanking from './TablaRanking'
import { montar } from '../pruebas/montar'

describe('TablaRanking (componente)', () => {
  let montaje
  afterEach(() => montaje?.desmontar())

  it('muestra una fila por participante y respeta el orden recibido', () => {
    montaje = montar(
      <TablaRanking
        filas={[
          { participante: 'Zeta', puntos: 3, diferencia: 0 },
          { participante: 'Alfa', puntos: 9, diferencia: 5 },
          { participante: 'Beta', puntos: 6, diferencia: 2 },
        ]}
      />,
    )
    const filas = montaje.contenedor.querySelectorAll('tbody tr')
    const nombres = [...filas].map((fila) => fila.children[1].textContent)
    expect(filas.length).toBe(3)
    expect(nombres).toEqual(['Zeta', 'Alfa', 'Beta'])
  })

  it('muestra un aviso cuando no hay resultados', () => {
    montaje = montar(<TablaRanking filas={[]} />)
    expect(montaje.contenedor.textContent).toContain('La tabla se calculará')
  })
})
