import { Navigate, useLocation } from 'react-router'
import { useAuth } from './useAuth.js'
import { Vacio } from '../components/Estado.jsx'
import { NOMBRE_ROL } from '../logica/estados.js'

// Sin sesión lleva a /login y recuerda la ruta pedida. Con sesión pero sin el rol exigido muestra un aviso.
// Ordena la interfaz, no protege los datos: el backend vuelve a validar el rol en cada petición (401 y 403).
export default function RutaProtegida({ children, rol }) {
  const { autenticado, usuario } = useAuth()
  const ubicacion = useLocation()

  if (!autenticado) {
    const desde = ubicacion.pathname
    return <Navigate to="/login" replace state={{ desde }} />
  }

  const permitidos = rol ? [].concat(rol) : null
  if (permitidos && !permitidos.includes(usuario.rol)) {
    return (
      <main id="contenido-principal" className="container seccion">
        <Vacio titulo="No tienes permiso para ver esta página">
          Tu rol ({NOMBRE_ROL[usuario.rol] ?? usuario.rol}) no puede entrar aquí. Si intentas la acción igual, el servidor responde 403.
        </Vacio>
      </main>
    )
  }

  return children
}
