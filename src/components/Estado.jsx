// Los tres estados de toda pantalla que pide datos: cargando, error y vacío

// "lento" avisa que el servidor gratuito se está activando (arranque en frío: puede tardar un minuto)
export function Cargando({ texto = 'Cargando…', lento = false }) {
  return (
    <div className="cargando" role="status">
      <span className="spinner-border spinner-border-sm" aria-hidden="true" /> {texto}
      {lento && <span className="aviso-lento"> El servidor se está activando: puede tardar un minuto.</span>}
    </div>
  )
}

export function ErrorCarga({ error, onReintentar }) {
  return (
    <div className="aviso aviso--error" role="alert">
      <strong>
        <span aria-hidden="true">⚠ </span>No pudimos cargar los datos
      </strong>
      <span>{error?.message}</span>
      {onReintentar && (
        <button type="button" className="btn btn-outline-light align-self-start" onClick={onReintentar}>
          Reintentar
        </button>
      )}
    </div>
  )
}

export function Vacio({ titulo, children }) {
  return (
    <div className="estado-vacio">
      {titulo && <p className="fw-semibold mb-1">{titulo}</p>}
      {children && <p className="mb-0">{children}</p>}
    </div>
  )
}
