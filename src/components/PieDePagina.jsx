import { Link } from 'react-router'

export default function PieDePagina() {
  return (
    <footer className="pie">
      <div className="container d-flex flex-column flex-md-row justify-content-between gap-3">
        <div>
          <p className="marca mb-1">
            ARENA<span className="marca-sep">//</span>MANAGER
          </p>
          <p className="mb-0">© 2026 eSports Arena Manager · Proyecto académico Desarrollo FullStack II (DSY1104)</p>
        </div>
        <nav aria-label="Enlaces del pie de página">
          <ul className="list-unstyled d-flex flex-wrap gap-3 mb-0">
            <li>
              <Link to="/torneos">Torneos</Link>
            </li>
            <li>
              <Link to="/perfil">Perfil</Link>
            </li>
            <li>
              <a href="mailto:contacto@arenamanager.cl">Contacto</a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}
