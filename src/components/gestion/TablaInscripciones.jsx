export default function TablaInscripciones({ inscripciones }) {
  if (!inscripciones.length) return <p className="estado-vacio">Todavía no hay inscripciones.</p>
  return (
    <div className="tabla-envoltorio table-responsive">
      <table className="table align-middle mb-0">
        <caption className="visually-hidden">Inscripciones recibidas</caption>
        <thead>
          <tr>
            <th scope="col">N°</th>
            <th scope="col">Torneo</th>
            <th scope="col">Participante</th>
            <th scope="col">Estado</th>
          </tr>
        </thead>
        <tbody>
          {inscripciones.map((ins) => (
            <tr key={ins.id}>
              <td>#{ins.id}</td>
              <td>{ins.torneo?.nombre}</td>
              <td>{ins.equipo ? `Equipo: ${ins.equipo.nombre}` : `Jugador: ${ins.usuario?.apodo}`}</td>
              <td>{ins.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
