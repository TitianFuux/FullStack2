import { act } from 'react'
import { useCarga } from './useCarga'
import { esperar, hacerClic, montar } from '../pruebas/montar'

// Componente de prueba: muestra los estados que entrega el hook
function Prueba({ cargar, filtro = 1 }) {
  const { datos, cargando, error, lento, recargar } = useCarga(cargar, [filtro])
  return (
    <div>
      <p id="estado">{cargando ? 'cargando' : error ? `error: ${error.message}` : `datos: ${datos}`}</p>
      {lento && <p id="lento">lento</p>}
      <button type="button" onClick={recargar}>
        recargar
      </button>
    </div>
  )
}

describe('useCarga', () => {
  let montaje
  afterEach(() => montaje?.desmontar())

  const estado = () => montaje.contenedor.querySelector('#estado').textContent

  it('parte cargando y entrega los datos cuando llegan', async () => {
    const cargar = jasmine.createSpy('cargar').and.returnValue(Promise.resolve('listo'))
    montaje = montar(<Prueba cargar={cargar} />)
    expect(estado()).toBe('cargando')
    await esperar()
    expect(estado()).toBe('datos: listo')
    expect(cargar).toHaveBeenCalledTimes(1)
  })

  it('entrega el error cuando la carga falla', async () => {
    const cargar = () => Promise.reject(new Error('Servidor caído'))
    montaje = montar(<Prueba cargar={cargar} />)
    await esperar()
    expect(estado()).toBe('error: Servidor caído')
  })

  it('cancela la petición anterior cuando cambian las dependencias', async () => {
    const senales = []
    const cargar = (signal) => {
      senales.push(signal)
      return new Promise(() => {}) // nunca responde
    }
    montaje = montar(<Prueba cargar={cargar} filtro={1} />)
    expect(senales.length).toBe(1)
    expect(senales[0].aborted).toBeFalse()

    // Se vuelve a dibujar con otro filtro: la petición del filtro 1 se cancela y nace la del filtro 2
    montaje.renderizar(<Prueba cargar={cargar} filtro={2} />)
    expect(senales[0].aborted).toBeTrue()
    expect(senales.length).toBe(2)
    expect(senales[1].aborted).toBeFalse()
  })

  it('vuelve a pedir los datos con recargar', async () => {
    let n = 0
    const cargar = () => Promise.resolve(`pedido ${++n}`)
    montaje = montar(<Prueba cargar={cargar} />)
    await esperar()
    expect(estado()).toBe('datos: pedido 1')
    hacerClic(montaje.contenedor.querySelector('button'))
    await esperar()
    expect(estado()).toBe('datos: pedido 2')
  })

  describe('con el reloj simulado', () => {
    beforeEach(() => jasmine.clock().install())
    afterEach(() => jasmine.clock().uninstall())

    it('avisa que el servidor es lento si la respuesta tarda más de 4 segundos', () => {
      montaje = montar(<Prueba cargar={() => new Promise(() => {})} />)
      expect(montaje.contenedor.querySelector('#lento')).toBeNull()
      act(() => jasmine.clock().tick(4001))
      expect(montaje.contenedor.querySelector('#lento')).not.toBeNull()
    })
  })
})
