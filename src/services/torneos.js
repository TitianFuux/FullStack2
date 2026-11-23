import { solicitar } from './api.js'

// ?juegoId=1&estado=abierto... solo con los filtros que traen valor
function consulta(filtros = {}) {
  const parametros = new URLSearchParams()
  for (const [nombre, valor] of Object.entries(filtros)) {
    if (valor) parametros.append(nombre, valor)
  }
  const texto = parametros.toString()
  return texto ? `?${texto}` : ''
}

export const torneosService = {
  listar: (filtros, opciones) => solicitar(`/torneos${consulta(filtros)}`, opciones),
  obtener: (id, opciones) => solicitar(`/torneos/${id}`, opciones),
  crear: (torneo) => solicitar('/torneos', { method: 'POST', body: JSON.stringify(torneo) }),
  actualizar: (id, datos) => solicitar(`/torneos/${id}`, { method: 'PUT', body: JSON.stringify(datos) }),
  eliminar: (id) => solicitar(`/torneos/${id}`, { method: 'DELETE' }),
}
