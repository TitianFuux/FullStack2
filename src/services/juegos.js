import { solicitar } from './api.js'

// Cada función recibe "opciones" opcionales ({ signal }) para poder cancelar la petición
export const juegosService = {
  listar: (opciones) => solicitar('/juegos', opciones),
  crear: (juego) => solicitar('/juegos', { method: 'POST', body: JSON.stringify(juego) }),
}
