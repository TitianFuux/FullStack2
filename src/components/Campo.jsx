// Campo de formulario con su etiqueta enlazada (label for) y el mensaje de error junto al campo.
// as="select" dibuja un <select> y recibe las <option> como children.
export default function Campo({ id, etiqueta, error, ayuda, tipo = 'text', as: Control = 'input', children, ...resto }) {
  const propios = Control === 'input' ? { type: tipo } : {}
  const clase = Control === 'select' ? 'form-select' : 'form-control'
  return (
    <div className={`campo ${error ? 'con-error' : ''}`}>
      <label htmlFor={id} className="form-label">
        {etiqueta}
      </label>
      <Control id={id} className={clase} aria-invalid={Boolean(error)} aria-describedby={`${id}-mensaje`} {...propios} {...resto}>
        {children}
      </Control>
      {ayuda && <small className="ayuda">{ayuda}</small>}
      <span id={`${id}-mensaje`} className="mensaje-error" role="alert">
        {error && (
          <>
            <span aria-hidden="true">⚠ </span>
            {error}
          </>
        )}
      </span>
    </div>
  )
}
