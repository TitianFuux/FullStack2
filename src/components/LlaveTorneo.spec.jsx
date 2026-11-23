import LlaveTorneo from './LlaveTorneo'
import { hacerClic, montar } from '../pruebas/montar'

describe('LlaveTorneo (componente)', () => {
  let montaje
  afterEach(() => montaje?.desmontar())

  it('muestra "Participante por definir" cuando la partida aún no tiene rival', () => {
    montaje = montar(
      <LlaveTorneo
        rondas={[
          {
            numero: 1,
            partidas: [{ id: 1, participanteA: 'Halcones', participanteB: null, horario: 'Por confirmar', estado: 'pendiente', resultado: null }],
          },
        ]}
      />,
    )
    expect(montaje.contenedor.textContent).toContain('Participante por definir')
  })

  it('cambia la ronda visible al pulsar su botón', () => {
    montaje = montar(
      <LlaveTorneo
        rondas={[
          { numero: 1, partidas: [{ id: 1, participanteA: 'Uno', participanteB: 'Dos', horario: 'h', estado: 'validada', resultado: '1 - 0' }] },
          { numero: 2, partidas: [{ id: 2, participanteA: 'Tres', participanteB: 'Cuatro', horario: 'h', estado: 'programada', resultado: null }] },
        ]}
      />,
    )
    expect(montaje.contenedor.textContent).toContain('Uno')
    hacerClic(montaje.contenedor.querySelectorAll('.btn-ronda')[1])
    expect(montaje.contenedor.textContent).toContain('Tres')
    expect(montaje.contenedor.textContent).not.toContain('Uno')
  })

  it('muestra un aviso si el torneo no tiene rondas', () => {
    montaje = montar(<LlaveTorneo rondas={[]} />)
    expect(montaje.contenedor.textContent).toContain('Las llaves se publicarán')
  })
})
