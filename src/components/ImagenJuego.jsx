import { useEffect, useState } from 'react'
import { visualJuego } from '../logica/juegos.js'
import { portadaGenerada } from '../logica/portada.js'

// Portada de un juego. Busca public/img/juegos/<nombre-del-juego>.jpg y, si no existe, genera una con el color del juego.
export default function ImagenJuego({ juego, className = '', alt }) {
  const [fallo, setFallo] = useState(false)
  const { imagen, color } = visualJuego(juego)
  useEffect(() => setFallo(false), [imagen])

  const src = fallo || !imagen ? portadaGenerada(juego?.nombre, color) : imagen
  return (
    <img
      className={`imagen-juego ${className}`.trim()}
      src={src}
      alt={alt ?? `Portada de ${juego?.nombre ?? 'juego'}`}
      loading="lazy"
      onError={() => setFallo(true)}
    />
  )
}
