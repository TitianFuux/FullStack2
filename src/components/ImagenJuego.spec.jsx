import { act } from 'react'
import ImagenJuego from './ImagenJuego'
import { montar } from '../pruebas/montar'

describe('ImagenJuego (componente)', () => {
  let montaje
  afterEach(() => montaje?.desmontar())

  const juego = { id: 4, nombre: 'Valorant' }

  it('busca la imagen por el nombre del juego y la describe con alt', () => {
    montaje = montar(<ImagenJuego juego={juego} />)
    const img = montaje.contenedor.querySelector('img')
    expect(img.getAttribute('src')).toBe('/img/juegos/valorant.jpg')
    expect(img.alt).toBe('Portada de Valorant')
  })

  it('si la imagen no carga, muestra una portada generada', () => {
    montaje = montar(<ImagenJuego juego={juego} />)
    const img = montaje.contenedor.querySelector('img')
    act(() => img.dispatchEvent(new Event('error')))
    expect(montaje.contenedor.querySelector('img').getAttribute('src')).toContain('data:image/svg+xml')
  })
})
