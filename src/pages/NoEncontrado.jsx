import { Link } from 'react-router'

export default function NoEncontrado() {
  return (
    <main id="contenido-principal" className="container seccion">
      <h1 className="titulo-pagina">Página no encontrada</h1>
      <p>
        <Link to="/">Volver al inicio</Link>
      </p>
    </main>
  )
}
