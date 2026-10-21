import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Header() {
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
          </ul>
        </nav>
      </div>
    </header>
  );
}