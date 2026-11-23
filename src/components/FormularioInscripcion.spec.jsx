import FormularioInscripcion from './FormularioInscripcion'
import { elegir, enviar, montar } from '../pruebas/montar'

describe('FormularioInscripcion (componente)', () => {
  let montaje
  let onEnviar

  const torneo = {
    id: 1,
    estado: 'abierto',
    modalidad: 'Equipos',
    cupoMaximo: 10,
    cupoOcupado: 3,
    fechaCierreInscripcion: '2099-12-31',
    juego: { id: 1, nombre: 'League of Legends', integrantesPorEquipo: 5 },
  }
  const equipoIncompleto = {
    id: 1,
    nombre: 'Halcones',
    activo: true,
    capitan: { id: 1 },
    integrantes: [{ usuario: { id: 1 } }, { usuario: { id: 2 } }],
  }
  const equipoCompleto = {
    id: 2,
    nombre: 'Completo',
    activo: true,
    capitan: { id: 1 },
    integrantes: Array.from({ length: 5 }, (_, i) => ({ usuario: { id: i + 1 } })),
  }
  const jugadores = [{ id: 1, apodo: 'cap', sanciones: [] }]

  beforeEach(() => {
    // Espía: reemplaza al manejador real para ver si se llamó
    onEnviar = jasmine.createSpy('onEnviar')
  })
  afterEach(() => montaje?.desmontar())

  const dibujar = (propiedades = {}) => {
    montaje = montar(
      <FormularioInscripcion torneo={torneo} opciones={[equipoIncompleto, equipoCompleto]} jugadores={jugadores} onEnviar={onEnviar} {...propiedades} />,
    )
    return montaje.contenedor
  }
  const boton = () => montaje.contenedor.querySelector('button[type="submit"]')
  const aviso = () => montaje.contenedor.querySelector('[role="alert"]').textContent

  it('mantiene deshabilitado el envío cuando el equipo está incompleto', () => {
    const contenedor = dibujar()
    elegir(contenedor.querySelector('select'), '1')

    expect(boton().disabled).toBeTrue()
    expect(aviso()).toContain('2 de 5 integrantes')
    enviar(contenedor.querySelector('form'))
    expect(onEnviar).not.toHaveBeenCalled()
  })

  it('habilita el envío y llama al manejador con el equipo completo', () => {
    const contenedor = dibujar()
    elegir(contenedor.querySelector('select'), '2')

    expect(boton().disabled).toBeFalse()
    enviar(contenedor.querySelector('form'))
    expect(onEnviar).toHaveBeenCalledOnceWith(equipoCompleto)
  })

  it('pide seleccionar un equipo si se envía sin elegir', () => {
    const contenedor = dibujar()
    enviar(contenedor.querySelector('form'))
    expect(aviso()).toContain('Debes seleccionar un equipo')
    expect(onEnviar).not.toHaveBeenCalled()
  })

  it('bloquea el envío si el equipo ya está inscrito', () => {
    const contenedor = dibujar({ inscritos: [{ torneo: { id: 1 }, equipo: { id: 2 } }] })
    elegir(contenedor.querySelector('select'), '2')
    expect(boton().disabled).toBeTrue()
    expect(aviso()).toContain('ya está inscrito')
  })

  it('bloquea el envío si el plazo ya venció', () => {
    dibujar({ torneo: { ...torneo, fechaCierreInscripcion: '2020-01-01' } })
    expect(boton().disabled).toBeTrue()
    expect(aviso()).toContain('plazo')
  })

  it('muestra el error que devuelve el servidor', () => {
    dibujar({ errorServidor: 'El equipo ya fue inscrito por otra persona' })
    expect(aviso()).toContain('ya fue inscrito')
  })
})
