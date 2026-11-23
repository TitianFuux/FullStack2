import Campo from './Campo'
import { montar } from '../pruebas/montar'

describe('Campo (componente)', () => {
  let montaje
  afterEach(() => montaje?.desmontar())

  it('enlaza la etiqueta con el campo (label for)', () => {
    montaje = montar(<Campo id="correo" etiqueta="Correo electrónico" tipo="email" value="" onChange={() => {}} />)
    const etiqueta = montaje.contenedor.querySelector('label')
    expect(etiqueta.htmlFor).toBe('correo')
    expect(montaje.contenedor.querySelector('#correo').type).toBe('email')
  })

  it('muestra el error junto al campo y lo marca como inválido', () => {
    montaje = montar(<Campo id="apodo" etiqueta="Apodo" value="" onChange={() => {}} error="El apodo es obligatorio." />)
    expect(montaje.contenedor.querySelector('[role="alert"]').textContent).toContain('El apodo es obligatorio.')
    expect(montaje.contenedor.querySelector('#apodo').getAttribute('aria-invalid')).toBe('true')
  })

  it('dibuja un select con sus opciones', () => {
    montaje = montar(
      <Campo id="juego" etiqueta="Juego" as="select" value="" onChange={() => {}}>
        <option value="">Elige</option>
        <option value="1">Valorant</option>
      </Campo>,
    )
    expect(montaje.contenedor.querySelectorAll('select option').length).toBe(2)
  })
})
