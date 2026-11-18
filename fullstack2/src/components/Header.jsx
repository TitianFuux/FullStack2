import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { usuario, rol, estaAutenticado, esGestion, cerrarSesion } = useAuth();
  const navigate = useNavigate();

  const manejarSalir = () => {
    cerrarSesion();
    navigate('/login');
  };

  return (
    <header className="cabecera">
      <div className="contenedor">
        <NavLink className="marca" to="/">
          eSports Arena<span>Manager</span>
        </NavLink>
        <nav className="nav-principal" aria-label="Navegación principal">
          <ul>
            <li><NavLink to="/" end className={({ isActive }) => (isActive ? 'activo' : '')}>Inicio</NavLink></li>
            <li><NavLink to="/torneos" className={({ isActive }) => (isActive ? 'activo' : '')}>Torneos</NavLink></li>
            <li><NavLink to="/inscripcion" className={({ isActive }) => (isActive ? 'activo' : '')}>Inscripción</NavLink></li>
            <li><NavLink to="/gestion" className={({ isActive }) => (isActive ? 'activo' : '')}>Mi equipo</NavLink></li>
            <li><NavLink to="/perfil" className={({ isActive }) => (isActive ? 'activo' : '')}>Perfil</NavLink></li>

            {esGestion && (
              <li><NavLink to="/panel" className={({ isActive }) => (isActive ? 'activo' : '')}>Panel Gestión</NavLink></li>
            )}

            {estaAutenticado ? (
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#00F5D4', fontWeight: 600 }}>
                  {usuario.apodo} ({rol})
                </span>
                <button
                  type="button"
                  onClick={manejarSalir}
                  className="boton boton-secundario"
                  style={{ padding: '0.3rem 0.7rem', fontSize: '0.8rem' }}
                >
                  Salir
                </button>
              </li>
            ) : (
              <li><NavLink to="/login" className={({ isActive }) => (isActive ? 'activo' : '')}>Iniciar sesión</NavLink></li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}