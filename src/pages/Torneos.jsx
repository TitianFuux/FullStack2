import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { useCarga } from '../hooks/useCarga.js'
import { torneosService } from '../services/torneos.js'
import { juegosService } from '../services/juegos.js'
import Campo from '../components/Campo.jsx'
import TarjetaTorneo from '../components/TarjetaTorneo.jsx'
import { Cargando, ErrorCarga, Vacio } from '../components/Estado.jsx'

export default function Torneos() {
  const [params] = useSearchParams()
  const [filtros, setFiltros] = useState({ busqueda: '', juegoId: params.get('juego') ?? '', estado: '', desde: '', hasta: '' })

  const cambiar = (campo) => (e) => setFiltros((f) => ({ ...f, [campo]: e.target.value }))
  const limpiar = () => setFiltros({ busqueda: '', juegoId: '', estado: '', desde: '', hasta: '' })

  // El rango de fechas no acepta una fecha inicial posterior a la final
  const errorRango = filtros.desde && filtros.hasta && filtros.desde > filtros.hasta ? 'La fecha inicial no puede ser posterior a la final.' : ''

  const juegos = useCarga((signal) => juegosService.listar({ signal }), [])
  // Cada cambio de filtro cancela la búsqueda anterior y pide la nueva
  const torneos = useCarga(
    (signal) => (errorRango ? Promise.resolve([]) : torneosService.listar(filtros, { signal })),
    [filtros],
  )

  return (
    <main id="contenido-principal" className="container seccion">
      <h1 className="titulo-pagina">Todos los torneos</h1>
      <p className="lead-texto">Filtra por juego, estado o rango de fechas, o busca por nombre.</p>

      <form className="panel-filtros" noValidate onSubmit={(e) => e.preventDefault()}>
        <div className="row g-3 align-items-end">
          <div className="col-12 col-md-6 col-xl-3">
            <Campo id="filtro-busqueda" etiqueta="Buscar por nombre" tipo="search" value={filtros.busqueda} onChange={cambiar('busqueda')} placeholder="Ej: Copa, Liga…" />
          </div>
          <div className="col-6 col-md-3 col-xl-2">
            <Campo id="filtro-juego" etiqueta="Juego" as="select" value={filtros.juegoId} onChange={cambiar('juegoId')}>
              <option value="">Todos</option>
              {(juegos.datos ?? []).map((j) => (
                <option key={j.id} value={j.id}>
                  {j.nombre}
                </option>
              ))}
            </Campo>
          </div>
          <div className="col-6 col-md-3 col-xl-2">
            <Campo id="filtro-estado" etiqueta="Estado" as="select" value={filtros.estado} onChange={cambiar('estado')}>
              <option value="">Todos</option>
              <option value="abierto">Abierto</option>
              <option value="en_curso">En curso</option>
              <option value="finalizado">Finalizado</option>
            </Campo>
          </div>
          <div className="col-6 col-md-3 col-xl-2">
            <Campo id="filtro-desde" etiqueta="Inicio desde" tipo="date" value={filtros.desde} onChange={cambiar('desde')} />
          </div>
          <div className="col-6 col-md-3 col-xl-2">
            <Campo id="filtro-hasta" etiqueta="Inicio hasta" tipo="date" value={filtros.hasta} onChange={cambiar('hasta')} error={errorRango} />
          </div>
          <div className="col-12 col-xl-1 d-grid">
            <button type="button" className="btn btn-outline-light mb-3" onClick={limpiar}>
              Limpiar
            </button>
          </div>
        </div>
      </form>

      {torneos.error ? (
        <ErrorCarga error={torneos.error} onReintentar={torneos.recargar} />
      ) : !torneos.datos ? (
        <Cargando lento={torneos.lento} texto="Cargando torneos…" />
      ) : torneos.datos.length ? (
        <div className="row g-4">
          {torneos.datos.map((t) => (
            <div className="col-12 col-md-6 col-xl-4" key={t.id}>
              <TarjetaTorneo torneo={t} />
            </div>
          ))}
        </div>
      ) : (
        <Vacio titulo="Ningún torneo cumple con los filtros seleccionados">Prueba ampliando el rango de fechas o el estado.</Vacio>
      )}
    </main>
  )
}
