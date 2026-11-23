import { useState } from 'react'
import { useAuth } from '../auth/useAuth.js'
import { useCarga } from '../hooks/useCarga.js'
import { torneosService } from '../services/torneos.js'
import { juegosService } from '../services/juegos.js'
import { jugadoresService } from '../services/jugadores.js'
import { inscripcionesService } from '../services/inscripciones.js'
import { NOMBRE_ROL } from '../logica/estados.js'
import FormularioTorneo from '../components/gestion/FormularioTorneo.jsx'
import FormularioJuego from '../components/gestion/FormularioJuego.jsx'
import FormularioSancion from '../components/gestion/FormularioSancion.jsx'
import TablaTorneos from '../components/gestion/TablaTorneos.jsx'
import TablaInscripciones from '../components/gestion/TablaInscripciones.jsx'
import { Cargando, ErrorCarga } from '../components/Estado.jsx'

// Ruta exclusiva de organizadores y administradores (RutaProtegida en App.jsx).
// Las acciones exclusivas del administrador se ocultan para el organizador y el backend vuelve a validar el permiso.
export default function PanelGestion() {
  const { rol, esAdmin } = useAuth()
  const [exito, setExito] = useState('')
  const [errorAccion, setErrorAccion] = useState('')

  const { datos, error, lento, recargar } = useCarga(
    (signal) =>
      Promise.all([
        torneosService.listar({}, { signal }),
        juegosService.listar({ signal }),
        jugadoresService.listar({ signal }),
        inscripcionesService.listar({ signal }),
      ]),
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
        <Cargando lento={lento} texto="Cargando el panel…" />
      </main>
    )
  }

  const [torneos, juegos, jugadores, inscripciones] = datos

  // Las acciones de la tabla muestran su resultado arriba; los formularios muestran su propio error
  async function ejecutar(accion, mensaje) {
    setErrorAccion('')
    setExito('')
    try {
      await accion()
      setExito(mensaje)
      recargar()
    } catch (err) {
      setErrorAccion(err.message)
    }
  }

  // Los formularios reciben una función que lanza el error para mostrarlo junto al formulario
  const desdeFormulario = (accion, mensaje) => async (datosFormulario) => {
    setErrorAccion('')
    setExito('')
    await accion(datosFormulario)
    setExito(mensaje)
    recargar()
  }

  return (
    <main id="contenido-principal" className="container seccion">
      <h1 className="titulo-pagina">Panel de gestión</h1>
      <p className="lead-texto">Sesión como {NOMBRE_ROL[rol] ?? rol}.</p>

      {errorAccion && (
        <div className="aviso aviso--error mb-3" role="alert">
          <span>
            <span aria-hidden="true">⚠ </span>
            {errorAccion}
          </span>
        </div>
      )}
      {exito && (
        <div className="aviso aviso--exito mb-3" role="status">
          <span>
            <span aria-hidden="true">✔ </span>
            {exito}
          </span>
        </div>
      )}

      <div className="d-grid gap-4">
        <FormularioTorneo juegos={juegos} onCrear={desdeFormulario((t) => torneosService.crear(t), 'Torneo creado.')} />

        <section aria-labelledby="t-torneos">
          <h2 id="t-torneos" className="titulo-seccion">
            Torneos ({torneos.length})
          </h2>
          <TablaTorneos
            torneos={torneos}
            esAdmin={esAdmin}
            onCambiarEstado={(id, estado) => ejecutar(() => torneosService.actualizar(id, { estado }), 'Estado actualizado.')}
            onEliminar={(t) => window.confirm(`¿Eliminar "${t.nombre}"?`) && ejecutar(() => torneosService.eliminar(t.id), 'Torneo eliminado.')}
          />
        </section>

        {esAdmin && <FormularioJuego onCrear={desdeFormulario((j) => juegosService.crear(j), 'Videojuego agregado.')} />}

        <FormularioSancion jugadores={jugadores} onSancionar={desdeFormulario((s) => jugadoresService.sancionar(s), 'Sanción aplicada.')} />

        <section aria-labelledby="t-inscripciones">
          <h2 id="t-inscripciones" className="titulo-seccion">
            Inscripciones ({inscripciones.length})
          </h2>
          <TablaInscripciones inscripciones={inscripciones} />
        </section>
      </div>
    </main>
  )
}
