const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export function obtenerToken() {
  return localStorage.getItem('arena_token');
}

async function request(endpoint, options = {}) {
  const token = obtenerToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté encendido en el puerto 8080.');
  }

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.mensaje || `Error HTTP ${response.status}`);
  }

  return data;
}

export const api = {
  login: (credenciales) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(credenciales) }),
  registro: (datos) =>
    request('/auth/registro', { method: 'POST', body: JSON.stringify(datos) }),

  obtenerJuegos: () => request('/juegos'),
  crearJuego: (juego) =>
    request('/juegos', { method: 'POST', body: JSON.stringify(juego) }),

  obtenerTorneos: (params = {}) => {
    const query = new URLSearchParams();
    if (params.juegoId) query.append('juegoId', params.juegoId);
    if (params.estado) query.append('estado', params.estado);
    if (params.busqueda) query.append('busqueda', params.busqueda);
    if (params.desde) query.append('desde', params.desde);
    if (params.hasta) query.append('hasta', params.hasta);
    const qs = query.toString();
    return request(`/torneos${qs ? `?${qs}` : ''}`);
  },
  obtenerTorneoPorId: (id) => request(`/torneos/${id}`),
  crearTorneo: (torneo) =>
    request('/torneos', { method: 'POST', body: JSON.stringify(torneo) }),
  actualizarTorneo: (id, datos) =>
    request(`/torneos/${id}`, { method: 'PUT', body: JSON.stringify(datos) }),
  eliminarTorneo: (id) =>
    request(`/torneos/${id}`, { method: 'DELETE' }),

  obtenerEquipos: () => request('/equipos'),
  crearEquipo: (equipo) =>
    request('/equipos', { method: 'POST', body: JSON.stringify(equipo) }),
  agregarIntegrante: (equipoId, datos) =>
    request(`/equipos/${equipoId}/integrantes`, { method: 'POST', body: JSON.stringify(datos) }),
  quitarIntegrante: (equipoId, usuarioId) =>
    request(`/equipos/${equipoId}/integrantes/${usuarioId}`, { method: 'DELETE' }),

  obtenerInscripciones: () => request('/inscripciones'),
  crearInscripcion: (datos) =>
    request('/inscripciones', { method: 'POST', body: JSON.stringify(datos) }),

  obtenerJugadores: () => request('/jugadores'),
  actualizarJugador: (id, datos) =>
    request(`/jugadores/${id}`, { method: 'PUT', body: JSON.stringify(datos) }),
  crearSancion: (datos) =>
    request('/sanciones', { method: 'POST', body: JSON.stringify(datos) }),
};