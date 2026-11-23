import { slugJuego, colorJuego, visualJuego } from './juegos'
import { portadaGenerada } from './portada'

describe('slugJuego', () => {
  it('convierte el nombre en un nombre de archivo', () => {
    expect(slugJuego('League of Legends')).toBe('league-of-legends')
    expect(slugJuego('Mario Kart 8 Deluxe')).toBe('mario-kart-8-deluxe')
    expect(slugJuego('Pokémon: Edición Única!')).toBe('pokemon-edicion-unica')
  })
})

describe('visualJuego', () => {
  it('busca la imagen por el nombre del juego', () => {
    expect(visualJuego({ id: 1, nombre: 'Valorant' }).imagen).toBe('/img/juegos/valorant.jpg')
  })

  it('entrega siempre el mismo color para el mismo juego', () => {
    const juego = { id: 4, nombre: 'Valorant' }
    expect(colorJuego(juego)).toBe(colorJuego({ ...juego }))
    expect(colorJuego(juego)).toMatch(/^#[0-9A-F]{6}$/i)
  })

  it('devuelve valores por defecto si no hay juego', () => {
    expect(visualJuego(null)).toEqual({ imagen: null, color: '#9146FF' })
  })
})

describe('portadaGenerada', () => {
  it('arma un SVG con las iniciales del juego', () => {
    const src = decodeURIComponent(portadaGenerada('Rocket League', '#FFB020'))
    expect(src.startsWith('data:image/svg+xml')).toBeTrue()
    expect(src).toContain('>RL</text>')
    expect(src).toContain('#FFB020')
  })
})
