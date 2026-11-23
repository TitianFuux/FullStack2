import { Link } from 'react-router'
import { useAuth } from '../auth/useAuth.js'

// Aparece cuando la API respondió 401 a una petición con token: la sesión ya se cerró en todas las vistas
export default function AvisoSesion() {
  const { expirada, cerrarAviso } = useAuth()
  if (!expirada) return null
  return (
    <div className="container pt-3">
      <div className="aviso aviso--alerta" role="alert">
        <strong>
          <span aria-hidden="true">◷ </span>Tu sesión venció. Inicia sesión de nuevo.
        </strong>
        <div className="d-flex flex-wrap gap-2">
          <Link to="/login" className="btn btn-outline-light" onClick={cerrarAviso}>
            Iniciar sesión
          </Link>
          <button type="button" className="btn btn-outline-light" onClick={cerrarAviso}>
            Cerrar aviso
          </button>
        </div>
      </div>
    </div>
  )
}
