// URL base de la API (Spring Boot). Se define con VITE_API_URL: en .env.development (npm run dev),
// en .env.production (npm run build) o en las variables de Vercel. Vite la escribe en el código al compilar.
// Fuera de Vite (en las pruebas con Karma) import.meta.env no existe: por eso el respaldo a {}.
const entorno = import.meta.env ?? {}

export const API_URL = String(entorno.VITE_API_URL ?? (entorno.DEV ? 'http://localhost:8080/api/v1' : '')).replace(/\/$/, '')
