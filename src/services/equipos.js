import { solicitar } from './api.js'

export const equiposService = {
  listar: (opciones) => solicitar('/equipos', opciones),
  crear: (equipo) => solicitar('/equipos', { method: 'POST', body: JSON.stringify(equipo) }),
  agregarIntegrante: (equipoId, datos) =>
    solicitar(`/equipos/${equipoId}/integrantes`, { method: 'POST', body: JSON.stringify(datos) }),
  quitarIntegrante: (equipoId, usuarioId) =>
    solicitar(`/equipos/${equipoId}/integrantes/${usuarioId}`, { method: 'DELETE' }),
}
