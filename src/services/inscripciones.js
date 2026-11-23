import { solicitar } from './api.js'

export const inscripcionesService = {
  listar: (opciones) => solicitar('/inscripciones', opciones),
  crear: (datos) => solicitar('/inscripciones', { method: 'POST', body: JSON.stringify(datos) }),
}
