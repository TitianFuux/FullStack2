import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import ImagenJuego from './ImagenJuego.jsx'
import Pastilla from './Pastilla.jsx'
import { visualJuego } from '../logica/juegos.js'

// Carrusel de portada con rotación automática (useEffect + temporizador).
// Se detiene mientras el mouse o el teclado están sobre él, con el botón de pausa o si la persona prefiere menos movimiento.
// diapositivas: [{ id, juego, estado, titulo, subtitulo, to, accion }]
export default function CarruselHeroe({ diapositivas, intervaloMs = 5000 }) {
  const [indice, setIndice] = useState(0)
  const [manual, setManual] = useState(false) // pausa elegida con el botón
  const [encima, setEncima] = useState(false) // mouse o foco sobre el carrusel
  const pausado = manual || encima
  const total = diapositivas.length

  useEffect(() => {
    const reducirMovimiento =
      typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (pausado || reducirMovimiento || total < 2) return undefined
    const id = setTimeout(() => setIndice((i) => (i + 1) % total), intervaloMs)
    return () => clearTimeout(id)
  }, [indice, pausado, total, intervaloMs])

  if (total === 0) return null
  const actual = Math.min(indice, total - 1)
  const d = diapositivas[actual]
  const ir = (i) => setIndice((i + total) % total)

  return (
    <section
      className={`carrusel ${pausado ? 'pausado' : ''}`}
      style={{ '--intervalo': `${intervaloMs}ms`, '--color-juego': visualJuego(d.juego).color }}
      aria-roledescription="carousel"
      aria-label="Torneos destacados"
      onMouseEnter={() => setEncima(true)}
      onMouseLeave={() => setEncima(false)}
      onFocus={() => setEncima(true)}
      onBlur={() => setEncima(false)}
    >
      <div className="carrusel-slide" key={d.id} role="group" aria-roledescription="slide" aria-label={`${actual + 1} de ${total}`}>
        <ImagenJuego juego={d.juego} className="carrusel-imagen" />
        <div className="carrusel-panel container">
          <div className="carrusel-texto">
            <Pastilla estado={d.estado} />
            <h2>{d.titulo}</h2>
            <p>{d.subtitulo}</p>
            <Link className="btn btn-primary btn-lg" to={d.to}>
              {d.accion}
            </Link>
          </div>
        </div>
      </div>

      <div className="carrusel-controles container">
        <div className="carrusel-indicadores">
          {diapositivas.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className="indicador"
              aria-label={`Ir a la diapositiva ${i + 1}: ${s.titulo}`}
              aria-current={i === actual}
              onClick={() => ir(i)}
            />
          ))}
        </div>
        <div className="d-flex gap-2">
          <button type="button" className="control" aria-label="Diapositiva anterior" onClick={() => ir(actual - 1)}>
            ‹
          </button>
          <button
            type="button"
            className="control"
            aria-label={manual ? 'Reanudar rotación automática' : 'Pausar rotación automática'}
            onClick={() => setManual((p) => !p)}
          >
            {manual ? '▶' : '❚❚'}
          </button>
          <button type="button" className="control" aria-label="Diapositiva siguiente" onClick={() => ir(actual + 1)}>
            ›
          </button>
        </div>
      </div>
    </section>
  )
}
