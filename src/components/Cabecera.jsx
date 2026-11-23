import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router'
import { useAuth } from '../auth/useAuth.js'
import { NOMBRE_ROL } from '../logica/estados.js'

const ENLACES = [
  { to: '/', texto: 'Inicio', end: true },
  { to: '/torneos', texto: 'Torneos' },
  { to: '/inscripcion', texto: 'Inscripción' },
  { to: '/gestion', texto: 'Mi equipo' },
  { to: '/perfil', texto: 'Perfil' },
]

export default function Cabecera() {
  const [abierto, setAbierto] = useState(false)
  const { usuario, rol, autenticado, esGestion, logout } = useAuth()
  const navigate = useNavigate()

  const salir = () => {
    logout()
    setAbierto(false)
    navigate('/login')
  }
  const claseEnlace = ({ isActive }) => `nav-link ${isActive ? 'active' : ''}`

  return (
    <header className="cabecera sticky-top">
      <nav className="navbar navbar-expand-lg" data-bs-theme="dark" aria-label="Navegación principal">
        <div className="container">
          <Link className="marca navbar-brand" to="/">
            ARENA<span className="marca-sep">//</span>MANAGER
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            aria-expanded={abierto}
            aria-controls="menu-principal"
            aria-label="Abrir o cerrar el menú"
            onClick={() => setAbierto(!abierto)}
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div id="menu-principal" className={`collapse navbar-collapse ${abierto ? 'show' : ''}`}>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {ENLACES.map((e) => (
                <li className="nav-item" key={e.to}>
                  <NavLink to={e.to} end={e.end} className={claseEnlace} onClick={() => setAbierto(false)}>
                    {e.texto}
                  </NavLink>
                </li>
              ))}
              {esGestion && (
                <li className="nav-item">
                  <NavLink to="/panel" className={claseEnlace} onClick={() => setAbierto(false)}>
                    Panel de gestión
                  </NavLink>
                </li>
              )}
            </ul>

            {autenticado ? (
              <div className="sesion-usuario">
                <span>
                  Hola, <strong>{usuario.apodo ?? usuario.nombre}</strong> · {NOMBRE_ROL[rol] ?? rol}
                </span>
                <button type="button" className="btn btn-outline-light" onClick={salir}>
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <Link className="btn btn-primary" to="/login" onClick={() => setAbierto(false)}>
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
