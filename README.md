# eSports Arena Manager: frontend

Proyecto semestral de Desarrollo FullStack II (DSY1104). Interfaz de la plataforma de torneos de eSports hecha con
React 19, Bootstrap y React Router, conectada por API REST al backend Spring Boot (`/api/v1`) con autenticación JWT.

## Integrantes

- Nombre Apellido
- Nombre Apellido
- Nombre Apellido

## Requisitos

- Node.js 20.19 o superior (o 22.12 en adelante). Revisa con `node -v`.
- Google Chrome instalado, para ejecutar las pruebas.
- El backend Spring Boot encendido en el puerto 8080 (para `npm run dev`) y con CORS habilitado para `http://localhost:5173`.

## Cómo ejecutarlo

```bash
npm install
npm run dev
```

Abre la dirección que muestra la terminal (normalmente http://localhost:5173).

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Versión de producción en `dist/` |
| `npm run preview` | Sirve `dist/` para probarla |
| `npm run lint` | Revisa el código con oxlint |
| `npm test` | Corre las pruebas unitarias (Karma + Jasmine) |
| `npm run test:watch` | Pruebas en modo continuo |

## Variables de entorno

La URL de la API no se escribe en el código: vive en `VITE_API_URL` y la lee `src/config.js`.

| Archivo | Cuándo se usa | Valor |
|---|---|---|
| `.env.development` | `npm run dev` | `http://localhost:8080/api/v1` |
| `.env.production` | `npm run build` | URL del servicio en Render (termina en `/api/v1`) |
| `.env.example` | Modelo para crear los anteriores | |

Todo lo que empieza con `VITE_` queda visible en el navegador: aquí solo van URLs, nunca claves. Si cambias un
`.env`, reinicia `npm run dev` o vuelve a compilar.

## Estructura

```
src/
  main.jsx             punto de entrada: AuthProvider > BrowserRouter > App
  App.jsx              rutas de la aplicación
  config.js            API_URL (desde VITE_API_URL)
  pages/               una página por ruta: Inicio, Torneos, DetalleTorneo, Inscripcion, GestionEquipo, Perfil,
                       Login, PanelGestion, NoEncontrado
  components/          componentes reutilizables (tarjetas, llaves, ranking, formularios, estados de carga)
    gestion/           formularios y tablas del panel de organizador y administrador
  auth/                sesión: AuthProvider, useAuth y RutaProtegida
  hooks/               useCarga: cargando, error y datos de toda pantalla que pide datos
  services/            capa de acceso a la API: api.js (solicitar), sesion.js, auth.js, torneos.js, juegos.js,
                       equipos.js, inscripciones.js, jugadores.js
  logica/              funciones puras: reglas de negocio, validaciones, rutas por rol, imágenes de juegos
  data/                textos y enlaces fijos
  styles/              tema.css (paleta Arena púrpura sobre Bootstrap) y app.css (componentes)
  pruebas/             ayudas compartidas por las pruebas (montar.js)
public/
  favicon.svg
  img/juegos/          portadas de cada juego (ver LEEME.txt)
```

Cada prueba (`*.spec.js` / `*.spec.jsx`) vive junto al archivo que prueba.

## Rutas

| Ruta | Página | Acceso |
|---|---|---|
| `/` | Inicio: carrusel, juegos, destacados, próximos cierres, video | Público |
| `/torneos` | Listado con filtros y buscador | Público |
| `/torneos/:id` | Detalle: llaves por ronda, tabla de posiciones, premios, video de la final | Público |
| `/inscripcion?id=` | Inscripción con validación de plazo, cupo, duplicidad, sanciones y equipo completo | Público; para enviar se pide sesión |
| `/gestion` | Crear equipos y administrar su plantilla | Público; las acciones piden sesión (capitán o administrador) |
| `/perfil` | Ficha del jugador y edición de datos | Público; editar pide sesión |
| `/login` | Iniciar sesión y registrarse | Público |
| `/panel` | Torneos, juegos, sanciones e inscripciones | Organizador y administrador |

La restricción visual no reemplaza al backend: aunque una acción se oculte, el servidor valida el rol en cada petición.

## Cómo se conecta con el backend

- `services/api.js` exporta `solicitar(ruta, opciones)`. Todas las peticiones pasan por ahí: arma la URL con `API_URL`,
  agrega `Authorization: Bearer <token>` una sola vez y convierte los errores en mensajes que la persona entiende
  (400, 401, 403, 404, 500 y falta de conexión).
- Cada servicio (`torneosService`, `equiposService`…) llama a `solicitar` y acepta `{ signal }` para cancelar la petición.
- `services/sesion.js` guarda `{ token, usuario }` en `localStorage` con la clave `sesion`; al leerla comprueba el `exp`
  del token y la borra si venció, así la sesión sobrevive a una recarga.
- Si la API responde **401** a una petición con token, `solicitar` borra la sesión y emite el evento `sesion-expirada`:
  `AuthProvider` deja la app sin sesión y aparece el aviso «Tu sesión venció. Inicia sesión de nuevo.».
  Un **403** conserva la sesión y muestra el mensaje del backend.
- `auth/RutaProtegida.jsx` lleva a `/login` (recordando la ruta pedida en `state.desde`) y, si el rol no alcanza, avisa.
- `hooks/useCarga.js` entrega `{ datos, cargando, error, lento, recargar }`, cancela la petición anterior cuando cambian
  los filtros y avisa «El servidor se está activando: puede tardar un minuto» si la respuesta tarda más de 4 segundos
  (Render gratuito duerme el servicio).

### Datos que espera de la API

El detalle de torneo muestra `rondas`, `ranking` y `premios` si `GET /torneos/{id}` los incluye; si no, muestra estados vacíos.

```
rondas:  [{ numero, partidas: [{ id, participanteA, participanteB, horario, estado, resultado }] }]
ranking: [{ participante, puntos, diferencia }]
premios: [{ posicion, premio }]
```

## Pruebas

`npm test` levanta Karma, abre Chrome sin interfaz y ejecuta todos los `*.spec.js` y `*.spec.jsx` de `src/`. Si Karma no
encuentra Chrome, define la variable `CHROME_BIN` con su ruta. La configuración está en `karma.conf.cjs`.

## Imágenes por juego

Copia una imagen por juego a `public/img/juegos/` con el nombre del juego en minúsculas y con guiones
(`league-of-legends.jpg`). Un juego nuevo que el administrador agregue funciona igual. Si el archivo no existe, se muestra
una portada generada con un color propio de cada juego.

## Despliegue en Vercel

1. Sube el repositorio a GitHub.
2. En Vercel: **Add New > Project**, elige el repositorio (Vercel detecta Vite: `npm run build`, carpeta `dist`).
3. En **Settings > Environment Variables** crea `VITE_API_URL` con la URL del backend en Render terminada en `/api/v1`
   (por ejemplo `https://mi-api.onrender.com/api/v1`) y haz **Redeploy**: Vite escribe la variable al compilar.
4. En el backend (Render), agrega la URL de Vercel a la variable de CORS (`CORS_ORIGENES`) y vuelve a desplegar.
5. `vercel.json` redirige todas las rutas a `index.html`, para que recargar `/torneos/3` no dé 404.

La primera petición después de un rato sin uso puede tardar hasta un minuto: el plan gratuito de Render duerme el servicio.
