import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import { useAuth } from '../auth/useAuth.js'
import { useCarga } from '../hooks/useCarga.js'
import { equiposService } from '../services/equipos.js'
import { juegosService } from '../services/juegos.js'
import { jugadoresService } from '../services/jugadores.js'
import { hayErrores, validarNombreEquipo } from '../logica/validaciones.js'
import Campo from '../components/Campo.jsx'
import ImagenJuego from '../components/ImagenJuego.jsx'
import TarjetaEquipo from '../components/TarjetaEquipo.jsx'
import { Cargando, ErrorCarga, Vacio } from '../components/Estado.jsx'

export default function GestionEquipo() {
  const ubicacion = useLocation()
  const { usuario, autenticado, esAdmin } = useAuth()
  const [form, setForm] = useState({ nombre: '', juegoId: '', capitanId: '' })
  const [errores, setErrores] = useState({})
  const [errorServidor, setErrorServidor] = useState('')
  const [exito, setExito] = useState('')
  const [procesando, setProcesando] = useState(false)

  const { datos, error, lento, recargar } = useCarga(
    (signal) => Promise.all([equiposService.listar({ signal }), juegosService.listar({ signal }), jugadoresService.listar({ signal })]),
    [],
  )

  if (error) {
    return (
      <main id="contenido-principal" className="container seccion">
        <ErrorCarga error={error} onReintentar={recargar} />
      </main>
    )
  }
  if (!datos) {
    return (
      <main id="contenido-principal" className="container seccion">
        <Cargando lento={lento} texto="Cargando equipos…" />
      </main>
    )
  }

  const [equipos, juegos, jugadores] = datos
  const juegosPorEquipo = juegos.filter((j) => String(j.modalidad).toLowerCase() === 'equipos')
  const juegoElegido = juegos.find((j) => String(j.id) === form.juegoId) ?? null
  const cambiar = (campo) => (e) => setForm((f) => ({ ...f, [campo]: e.target.value }))

  async function crearEquipo(e) {
    e.preventDefault()
    setErrorServidor('')
    setExito('')
    const encontrados = {
      nombre: validarNombreEquipo(form.nombre, equipos.map((eq) => eq.nombre)),
      juegoId: form.juegoId ? '' : 'Debes seleccionar un juego con modalidad por equipos.',
    }
    setErrores(encontrados)
    if (hayErrores(encontrados)) return

    setProcesando(true)
    try {
      await equiposService.crear({
        nombre: form.nombre.trim(),
        juegoId: Number(form.juegoId),
        capitanId: Number(esAdmin && form.capitanId ? form.capitanId : usuario.id),
      })
      setForm({ nombre: '', juegoId: '', capitanId: '' })
      setExito('¡Equipo creado exitosamente!')
      recargar()
    } catch (err) {
      setErrorServidor(err.message)
    } finally {
      setProcesando(false)
    }
  }

  // Agregar y quitar integrantes: si el servidor rechaza, la tarjeta muestra el mensaje
  async function agregarIntegrante(equipo, datosIntegrante) {
    await equiposService.agregarIntegrante(equipo.id, datosIntegrante)
    recargar()
  }
  async function quitarIntegrante(equipo, usuarioId) {
    await equiposService.quitarIntegrante(equipo.id, usuarioId)
    recargar()
  }

  const puedeGestionar = (equipo) => autenticado && (esAdmin || equipo.capitan?.id === usuario?.id)

  return (
    <main id="contenido-principal" className="container seccion">
      <h1 className="titulo-pagina">Gestión de mi equipo</h1>

      <div className="row g-4">
        <div className="col-12 col-lg-4">
          <h2 className="titulo-seccion">Crear un nuevo equipo</h2>
          {!autenticado ? (
            <div className="aviso aviso--info" role="status">
              <span>Inicia sesión para crear un equipo.</span>
              <Link className="btn btn-primary align-self-start" to="/login" state={{ desde: ubicacion.pathname }}>
                Iniciar sesión
              </Link>
            </div>
          ) : (
            <form className="formulario" noValidate onSubmit={crearEquipo}>
              <Campo id="equipo-nombre" etiqueta="Nombre del equipo" autoComplete="off" value={form.nombre} onChange={cambiar('nombre')} placeholder="Ej: Titanes del Norte" error={errores.nombre} ayuda="Mínimo 3 caracteres y único entre los equipos existentes." />
              <Campo id="equipo-juego" etiqueta="Juego principal" as="select" value={form.juegoId} onChange={cambiar('juegoId')} error={errores.juegoId}>
                <option value="">Selecciona un juego</option>
                {juegosPorEquipo.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.nombre}
                  </option>
                ))}
              </Campo>
              {juegoElegido && (
                <figure className="vista-previa-juego mb-0">
                  <ImagenJuego juego={juegoElegido} />
                  <figcaption>Se requieren {juegoElegido.integrantesPorEquipo} integrantes para inscribirse.</figcaption>
                </figure>
              )}
              {esAdmin && (
                <Campo id="equipo-capitan" etiqueta="Capitán asignado" as="select" value={form.capitanId} onChange={cambiar('capitanId')} ayuda="Si no eliges a nadie, serás el capitán.">
                  <option value="">Yo mismo</option>
                  {jugadores.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.apodo} ({j.nombre})
                    </option>
                  ))}
                </Campo>
              )}
              {errorServidor && (
                <p className="mensaje-error mb-0" role="alert">
                  <span aria-hidden="true">⚠ </span>
                  {errorServidor}
                </p>
              )}
              {exito && (
                <div className="aviso aviso--exito" role="status">
                  <span>
                    <span aria-hidden="true">✔ </span>
                    {exito}
                  </span>
                </div>
              )}
              <button type="submit" className="btn btn-primary" disabled={procesando}>
                {procesando ? 'Creando…' : 'Crear equipo'}
              </button>
            </form>
          )}
        </div>

        <div className="col-12 col-lg-8">
          <h2 className="titulo-seccion">Equipos registrados ({equipos.length})</h2>
          {equipos.length ? (
            <div className="row g-4">
              {equipos.map((eq) => (
                <div className="col-12 col-xl-6" key={eq.id}>
                  <TarjetaEquipo
                    equipo={eq}
                    jugadores={jugadores}
                    puedeGestionar={puedeGestionar(eq)}
                    onAgregar={agregarIntegrante}
                    onQuitar={quitarIntegrante}
                  />
                </div>
              ))}
            </div>
          ) : (
            <Vacio titulo="Todavía no hay equipos">Crea el primero con el formulario.</Vacio>
          )}
        </div>
      </div>
    </main>
  )
}
