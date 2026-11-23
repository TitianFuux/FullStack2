// Validaciones de formularios en el cliente. Cada una devuelve el mensaje de error o '' si el dato es válido.
// El backend vuelve a validar: estos mensajes solo evitan viajes inútiles y orientan a la persona.

export function validarApodo(apodo) {
  const valor = (apodo || '').trim()
  if (!valor) return 'El apodo es obligatorio.'
  if (/\s/.test(valor)) return 'El apodo no puede contener espacios.'
  if (valor.length < 3 || valor.length > 15) return 'El apodo debe tener entre 3 y 15 caracteres.'
  return ''
}

export function validarCorreo(correo) {
  const valor = (correo || '').trim()
  if (!valor) return 'El correo es obligatorio.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) return 'Ingresa un correo válido, por ejemplo nombre@dominio.cl'
  return ''
}

export function validarEdad(edad) {
  if (edad === '' || edad === null || edad === undefined) return 'La edad es obligatoria.'
  const n = Number(edad)
  if (!Number.isInteger(n) || n < 13 || n > 99) return 'La edad debe ser un número entre 13 y 99.'
  return ''
}

// La contraseña nueva es opcional: si se escribe, exige 8 caracteres y coincidir con la confirmación
export function validarClaves(clave, confirmar) {
  const errores = { clave: '', confirmar: '' }
  if (!clave && !confirmar) return errores
  if (clave.length < 8) errores.clave = 'La contraseña debe tener al menos 8 caracteres.'
  if (clave !== confirmar) errores.confirmar = 'Las contraseñas no coinciden.'
  return errores
}

export function validarLogin({ correo, password }) {
  return {
    correo: validarCorreo(correo),
    password: password ? '' : 'La contraseña es obligatoria.',
  }
}

export function validarRegistro({ nombre, apodo, correo, edad, password }) {
  return {
    nombre: (nombre || '').trim().length < 3 ? 'Escribe tu nombre completo (mínimo 3 caracteres).' : '',
    apodo: validarApodo(apodo),
    correo: validarCorreo(correo),
    edad: validarEdad(edad),
    password: (password || '').length < 8 ? 'La contraseña debe tener al menos 8 caracteres.' : '',
  }
}

export function validarNombreEquipo(nombre, existentes = []) {
  const valor = (nombre || '').trim()
  if (valor.length < 3) return 'El nombre debe tener al menos 3 caracteres.'
  if (valor.length > 80) return 'El nombre no puede superar los 80 caracteres.'
  if (existentes.some((n) => n.toLowerCase() === valor.toLowerCase())) return 'Ya existe un equipo con ese nombre.'
  return ''
}

// Reglas de un torneo nuevo: cupo positivo y el inicio después del cierre de inscripción
export function validarTorneo({ nombre, juegoId, cupoMaximo, fechaCierreInscripcion, fechaInicio }) {
  const errores = {
    nombre: (nombre || '').trim().length < 3 ? 'El nombre debe tener al menos 3 caracteres.' : '',
    juegoId: juegoId ? '' : 'Elige el videojuego del torneo.',
    cupoMaximo: Number.isInteger(Number(cupoMaximo)) && Number(cupoMaximo) > 0 ? '' : 'El cupo máximo debe ser un número positivo.',
    fechaCierreInscripcion: fechaCierreInscripcion ? '' : 'Indica la fecha de cierre de inscripción.',
    fechaInicio: fechaInicio ? '' : 'Indica la fecha de inicio.',
  }
  if (!errores.fechaCierreInscripcion && !errores.fechaInicio && fechaInicio <= fechaCierreInscripcion) {
    errores.fechaInicio = 'La fecha de inicio debe ser posterior al cierre de inscripción.'
  }
  return errores
}

export function validarJuego({ nombre, integrantesPorEquipo }) {
  return {
    nombre: (nombre || '').trim().length < 2 ? 'El nombre del juego es obligatorio.' : '',
    integrantesPorEquipo:
      Number.isInteger(Number(integrantesPorEquipo)) && Number(integrantesPorEquipo) >= 1
        ? ''
        : 'Los integrantes por equipo deben ser un número desde 1.',
  }
}

export function validarSancion({ usuarioId, motivo, duracion }) {
  return {
    usuarioId: usuarioId ? '' : 'Elige al jugador sancionado.',
    motivo: (motivo || '').trim().length < 5 ? 'Explica el motivo (mínimo 5 caracteres).' : '',
    duracion: (duracion || '').trim() ? '' : 'Indica la duración de la sanción.',
  }
}

// Verdadero si algún campo del objeto de errores tiene mensaje
export const hayErrores = (errores) => Object.values(errores).some(Boolean)
