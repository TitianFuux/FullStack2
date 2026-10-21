import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="pie">
      <div className="contenedor">
        <p>© 2026 eSports Arena Manager</p>
        <nav aria-label="Enlaces del pie de página">
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/torneos">Torneos</Link></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}