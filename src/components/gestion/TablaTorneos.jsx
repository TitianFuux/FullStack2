import { Link } from 'react-router'
import Pastilla from '../Pastilla.jsx'

// Lista de torneos con el cambio de estado (organizador y administrador) y la eliminación (solo administrador)
export default function TablaTorneos({ torneos, esAdmin, onCambiarEstado, onEliminar }) {
  if (!torneos.length) return <p className="estado-vacio">Todavía no hay torneos creados.</p>
  return (
    <div className="tabla-envoltorio table-responsive">
      <table className="table align-middle mb-0">
        <caption className="visually-hidden">Torneos de la plataforma</caption>
        <thead>
          <tr>
            <th scope="col">Torneo</th>
            <th scope="col">Juego</th>
            <th scope="col">Cupos</th>
            <th scope="col">Estado</th>
            {esAdmin && <th scope="col">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {torneos.map((t) => (
            <tr key={t.id}>
              <td>
                <Link to={`/torneos/${t.id}`}>{t.nombre}</Link>
              </td>
              <td>{t.juego?.nombre}</td>
              <td>
                {t.cupoOcupado}/{t.cupoMaximo}
              </td>
              <td>
                <div className="d-flex flex-wrap align-items-center gap-2">
                  <Pastilla estado={t.estado} />
                  <select
                    className="form-select form-select-sm selector-estado"
                    aria-label={`Cambiar el estado de ${t.nombre}`}
                    value={t.estado}
                    onChange={(e) => onCambiarEstado(t.id, e.target.value)}
                  >
                    <option value="abierto">Abierto</option>
                    <option value="en_curso">En curso</option>
                    <option value="finalizado">Finalizado</option>
                  </select>
                </div>
              </td>
              {esAdmin && (
                <td>
                  <button type="button" className="btn btn-outline-danger" onClick={() => onEliminar(t)}>
                    Eliminar
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
