import {
  validarApodo,
  validarCorreo,
  validarEdad,
  validarClaves,
  validarLogin,
  validarRegistro,
  validarNombreEquipo,
  validarTorneo,
  validarJuego,
  validarSancion,
  hayErrores,
} from './validaciones'

describe('validarApodo', () => {
  it('exige un valor', () => {
    expect(validarApodo('')).toContain('obligatorio')
  })

  it('no admite espacios', () => {
    expect(validarApodo('con espacio')).toContain('espacios')
  })

  it('respeta el largo entre 3 y 15 caracteres', () => {
    expect(validarApodo('ab')).toContain('entre 3 y 15')
    expect(validarApodo('DeusCabrex')).toBe('')
  })
})

describe('validarCorreo y validarEdad', () => {
  it('rechaza un correo inválido y acepta uno válido', () => {
    expect(validarCorreo('sin-arroba')).toContain('válido')
    expect(validarCorreo('a@b.cl')).toBe('')
  })

  it('acepta solo edades entre 13 y 99', () => {
    expect(validarEdad(12)).toContain('entre 13 y 99')
    expect(validarEdad('20')).toBe('')
    expect(validarEdad('')).toContain('obligatoria')
  })
})

describe('validarClaves', () => {
  it('exige 8 caracteres como mínimo', () => {
    expect(validarClaves('corta', 'corta').clave).toContain('8 caracteres')
  })

  it('exige que la confirmación coincida', () => {
    expect(validarClaves('claveLarga1', 'otraCosa1').confirmar).toContain('no coinciden')
  })

  it('no valida nada si ambos campos están vacíos', () => {
    expect(validarClaves('', '')).toEqual({ clave: '', confirmar: '' })
  })
})

describe('validarLogin y validarRegistro', () => {
  it('el acceso exige correo válido y contraseña', () => {
    const errores = validarLogin({ correo: 'x', password: '' })
    expect(errores.correo).toContain('válido')
    expect(errores.password).toContain('obligatoria')
    expect(hayErrores(validarLogin({ correo: 'a@b.cl', password: '1234' }))).toBeFalse()
  })

  it('el registro valida todos sus campos', () => {
    const errores = validarRegistro({ nombre: 'A', apodo: 'a b', correo: 'x', edad: '5', password: '123' })
    expect(hayErrores(errores)).toBeTrue()
    expect(Object.values(errores).every(Boolean)).toBeTrue()
    const ok = validarRegistro({ nombre: 'Ana Pérez', apodo: 'anita', correo: 'ana@correo.cl', edad: '20', password: 'claveSegura1' })
    expect(hayErrores(ok)).toBeFalse()
  })
})

describe('validarNombreEquipo', () => {
  it('rechaza nombres cortos', () => {
    expect(validarNombreEquipo('ab')).toContain('3 caracteres')
  })

  it('rechaza nombres repetidos sin distinguir mayúsculas', () => {
    expect(validarNombreEquipo('neon reapers', ['Neon Reapers'])).toContain('Ya existe')
  })

  it('acepta un nombre nuevo', () => {
    expect(validarNombreEquipo('Titanes', ['Neon Reapers'])).toBe('')
  })
})

describe('validarTorneo', () => {
  const valido = { nombre: 'Copa', juegoId: '1', cupoMaximo: '16', fechaCierreInscripcion: '2026-11-20', fechaInicio: '2026-12-05' }

  it('acepta un torneo bien armado', () => {
    expect(hayErrores(validarTorneo(valido))).toBeFalse()
  })

  it('exige que el cupo sea positivo', () => {
    expect(validarTorneo({ ...valido, cupoMaximo: '0' }).cupoMaximo).toContain('positivo')
  })

  it('exige que el inicio sea posterior al cierre de inscripción', () => {
    expect(validarTorneo({ ...valido, fechaInicio: '2026-11-20' }).fechaInicio).toContain('posterior')
  })
})

describe('validarJuego y validarSancion', () => {
  it('el juego pide nombre e integrantes desde 1', () => {
    expect(validarJuego({ nombre: '', integrantesPorEquipo: '0' }).nombre).toContain('obligatorio')
    expect(validarJuego({ nombre: '', integrantesPorEquipo: '0' }).integrantesPorEquipo).toContain('desde 1')
    expect(hayErrores(validarJuego({ nombre: 'Valorant', integrantesPorEquipo: '5' }))).toBeFalse()
  })

  it('la sanción pide jugador, motivo y duración', () => {
    const errores = validarSancion({ usuarioId: '', motivo: 'x', duracion: ' ' })
    expect(Object.values(errores).every(Boolean)).toBeTrue()
    expect(hayErrores(validarSancion({ usuarioId: '3', motivo: 'Conducta antideportiva', duracion: '3 fechas' }))).toBeFalse()
  })
})
