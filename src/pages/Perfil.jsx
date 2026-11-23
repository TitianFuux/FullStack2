import { useState } from 'react'
import { useAuth } from '../auth/useAuth.js'
import { useCarga } from '../hooks/useCarga.js'
import { equiposService } from '../services/equipos.js'
import { jugadoresService } from '../services/jugadores.js'
import { iniciales } from '../logica/formato.js'
import Campo from '../components/Campo.jsx'
import FormularioPerfil from '../components/FormularioPerfil.jsx'
import Pastilla from '../components/Pastilla.jsx'
import { Cargando, ErrorCarga, Vacio } from '../components/Estado.jsx'

export default function Perfil() {
  const { usuario, autenticado, esAdmin, actualizarUsuario } = useAuth()
  const [seleccionadoId, setSeleccionadoId] = useState(usuario?.id ?? null)

  const { datos, error, lento, recargar } = useCarga(
    (signal) => Promise.all([jugadoresService.listar({ signal }), equiposService.listar({ signal })]),
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
        <Cargando lento={lento} texto="Cargando perfiles…" />
      </main>
    )
  }

  const [jugadores, equipos] = datos
  const perfil = jugadores.find((j) => j.id === seleccionadoId) ?? jugadores[0] ?? null

  if (!perfil) {
    return (
      <main id="contenido-principal" className="container seccion">
        <h1 className="titulo-pagina">Perfil de jugador</h1>
        <Vacio titulo="Todavía no hay jugadores registrados" />
      </main>
    )
  }

  const victorias = perfil.victorias ?? 0
  const derrotas = perfil.derrotas ?? 0
  const efectividad = Math.round((victorias / Math.max(1, victorias + derrotas)) * 100)
  const sanciones = perfil.sanciones ?? []
  const historial = perfil.historial ?? []
  const equiposDelJugador = equipos.filter(
    (eq) => eq.capitan?.id === perfil.id || eq.integrantes?.some((i) => i.usuario?.id === perfil.id),
  )
  // Cada quien edita su propio perfil; el administrador edita cualquiera (el backend vuelve a validarlo)
  const puedeEditar = autenticado && (esAdmin || usuario?.id === perfil.id)

  async function guardar(cambios) {
    const actualizado = await jugadoresService.actualizar(perfil.id, cambios)
    if (usuario?.id === perfil.id) actualizarUsuario(actualizado)
    recargar()
  }

  return (
    <main id="contenido-principal" className="container seccion">
      <h1 className="titulo-pagina">Perfil de jugador</h1>

      <div className="mb-4" style={{ maxWidth: 340 }}>
        <Campo id="selector-jugador" etiqueta="Ver ficha de" as="select" value={perfil.id} onChange={(e) => setSeleccionadoId(Number(e.target.value))}>
          {jugadores.map((j) => (
            <option key={j.id} value={j.id}>
              {j.nombre} ({j.apodo})
            </option>
          ))}
        </Campo>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <div className="ficha-jugador">
            <div className="avatar" role="img" aria-label={`Avatar de ${perfil.nombre}`}>
              {iniciales(perfil.nombre)}
            </div>
            <div>
              <h2 className="mb-1">{perfil.nombre}</h2>
              <p className="etiqueta-dato mb-0">
                @{perfil.apodo} · {perfil.correo}
                {perfil.edad ? ` · ${perfil.edad} años` : ''}
              </p>
            </div>
          </div>

          <div className="grilla-stats my-4">
            <div className="tarjeta-stat">
              <div className="valor">{victorias}</div>
              <div className="rotulo">Victorias</div>
            </div>
            <div className="tarjeta-stat">
              <div className="valor">{derrotas}</div>
              <div className="rotulo">Derrotas</div>
            </div>
            <div className="tarjeta-stat">
              <div className="valor">{efectividad}%</div>
              <div className="rotulo">Efectividad</div>
            </div>
          </div>

          <h2 className="titulo-seccion">Equipos</h2>
          {equiposDelJugador.length ? (
            <ul className="lista-integrantes list-unstyled">
              {equiposDelJugador.map((eq) => (
                <li key={eq.id} className="integrante">
                  <strong>{eq.nombre}</strong>
                  <span className="etiqueta-dato">
                    {eq.juego?.nombre}
                    {eq.activo === false ? ' · inactivo' : ''}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <Vacio>Este jugador no pertenece a ningún equipo.</Vacio>
          )}

          {historial.length > 0 && (
            <>
              <h2 className="titulo-seccion mt-4">Historial de torneos</h2>
              <div className="tabla-envoltorio table-responsive">
                <table className="table mb-0">
                  <thead>
                    <tr>
                      <th scope="col">Torneo</th>
                      <th scope="col">Resultado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historial.map((h) => (
                      <tr key={h.torneo}>
                        <td>{h.torneo}</td>
                        <td>{h.resultado}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          <h2 className="titulo-seccion mt-4">Sanciones</h2>
          {sanciones.length ? (
            <ul className="lista-integrantes list-unstyled">
              {sanciones.map((s, i) => (
                <li className="integrante" key={s.id ?? i}>
                  <span>
                    {s.motivo}
                    <br />
                    <small className="etiqueta-dato">{s.duracion}</small>
                  </span>
                  <Pastilla estado={s.vigente ? 'vigente' : 'cumplida'} />
                </li>
              ))}
            </ul>
          ) : (
            <Vacio>Jugador sin sanciones disciplinarias.</Vacio>
          )}
        </div>

        <div className="col-12 col-lg-5">
          <h2 className="titulo-seccion">Editar datos de contacto</h2>
          {puedeEditar ? (
            <FormularioPerfil key={perfil.id} perfil={perfil} onGuardar={guardar} />
          ) : (
            <Vacio>{autenticado ? 'Solo puedes editar tu propio perfil.' : 'Inicia sesión para editar tu perfil.'}</Vacio>
          )}
        </div>
      </div>
    </main>
  )
}
