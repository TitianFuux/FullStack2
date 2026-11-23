// Una fila por participante, en el orden recibido (quien la usa decide el orden: ver ordenarRanking)
export default function TablaRanking({ filas, titulo = 'Tabla de posiciones' }) {
  if (!filas.length) {
    return <p className="estado-vacio">La tabla se calculará cuando existan resultados validados.</p>
  }
  return (
    <div className="tabla-envoltorio table-responsive">
      <table className="table tabla-ranking align-middle mb-0">
        <caption className="visually-hidden">{titulo}</caption>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Participante</th>
            <th scope="col">Pts</th>
            <th scope="col">Dif.</th>
          </tr>
        </thead>
        <tbody>
          {filas.map((fila, i) => (
            <tr key={fila.participante} className={i < 3 ? `podio podio-${i + 1}` : ''}>
              <td>
                <span className="posicion">{i + 1}</span>
              </td>
              <td>{fila.participante}</td>
              <td>{fila.puntos}</td>
              <td>
                {fila.diferencia > 0 ? '+' : ''}
                {fila.diferencia}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
