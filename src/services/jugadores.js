import { solicitar } from './api.js'

export const jugadoresService = {
  listar: (opciones) => solicitar('/jugadores', opciones),
  actualizar: (id, datos) => solicitar(`/jugadores/${id}`, { method: 'PUT', body: JSON.stringify(datos) }),
  sancionar: (sancion) => solicitar('/sanciones', { method: 'POST', body: JSON.stringify(sancion) }),
}
