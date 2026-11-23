import { act } from 'react'
import { MemoryRouter } from 'react-router'
import CarruselHeroe from './CarruselHeroe'
import { hacerClic, montar } from '../pruebas/montar'

describe('CarruselHeroe (componente)', () => {
  let montaje

  const juego = { id: 1, nombre: 'Juego Uno' }
  const diapositivas = [
    { id: 'a', juego, estado: 'abierto', titulo: 'Primera', subtitulo: 's', to: '/x', accion: 'Ir' },
    { id: 'b', juego, estado: 'en_curso', titulo: 'Segunda', subtitulo: 's', to: '/y', accion: 'Ver' },
  ]

  beforeEach(() => {
    // Reloj simulado: permite avanzar el temporizador sin esperar tiempo real
    jasmine.clock().install()
    montaje = montar(
      <MemoryRouter>
        <CarruselHeroe diapositivas={diapositivas} intervaloMs={5000} />
      </MemoryRouter>,
    )
  })

  afterEach(() => {
    montaje.desmontar()
    jasmine.clock().uninstall()
  })

  const titulo = () => montaje.contenedor.querySelector('.carrusel-slide h2').textContent
  const boton = (etiqueta) => montaje.contenedor.querySelector(`button[aria-label^="${etiqueta}"]`)

  it('rota automáticamente a la siguiente diapositiva', () => {
    expect(titulo()).toBe('Primera')
    act(() => jasmine.clock().tick(5001))
    expect(titulo()).toBe('Segunda')
  })

  it('deja de rotar cuando se pulsa el botón de pausa', () => {
    hacerClic(boton('Pausar'))
    act(() => jasmine.clock().tick(20000))
    expect(titulo()).toBe('Primera')
  })

  it('se detiene mientras el mouse está encima y sigue al salir', () => {
    const carrusel = montaje.contenedor.querySelector('section')
    act(() => carrusel.dispatchEvent(new MouseEvent('mouseover', { bubbles: true })))
    act(() => jasmine.clock().tick(20000))
    expect(titulo()).toBe('Primera')
    act(() => carrusel.dispatchEvent(new MouseEvent('mouseout', { bubbles: true })))
    act(() => jasmine.clock().tick(5001))
    expect(titulo()).toBe('Segunda')
  })

  it('el botón de pausa sigue funcionando aunque el mouse esté encima', () => {
    const carrusel = montaje.contenedor.querySelector('section')
    act(() => carrusel.dispatchEvent(new MouseEvent('mouseover', { bubbles: true })))
    hacerClic(boton('Pausar'))
    act(() => carrusel.dispatchEvent(new MouseEvent('mouseout', { bubbles: true })))
    act(() => jasmine.clock().tick(20000))
    expect(titulo()).toBe('Primera')
    expect(boton('Reanudar')).not.toBeNull()
  })

  it('cambia de diapositiva con los botones siguiente y anterior', () => {
    hacerClic(boton('Diapositiva siguiente'))
    expect(titulo()).toBe('Segunda')
    hacerClic(boton('Diapositiva anterior'))
    expect(titulo()).toBe('Primera')
  })
})
