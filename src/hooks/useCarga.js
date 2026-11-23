import { useCallback, useEffect, useState } from 'react'

// Si la respuesta tarda más que esto, la vista avisa que el servidor se está activando (arranque en frío)
const ESPERA_LENTA_MS = 4000

// Carga datos con un servicio y entrega los tres estados de toda pantalla que pide datos: cargando, error y datos.
//   const { datos, cargando, error, lento, recargar } = useCarga((signal) => servicio.listar({ signal }), [filtro])
// - "cargar" recibe un AbortSignal: la limpieza del efecto cancela la petición anterior cuando cambian las
//   dependencias o el componente se desmonta, así una respuesta lenta nunca pisa a la más reciente.
// - "clave" identifica cada pedido (dependencias + versión que sube con recargar): mientras la respuesta
//   guardada no sea la de la clave actual, la vista está cargando.
export function useCarga(cargar, dependencias = []) {
  const [version, setVersion] = useState(0)
  const clave = JSON.stringify([...dependencias, version])
  const [estado, setEstado] = useState({ clave: null, datos: null, error: null })
  const [lento, setLento] = useState(false)

  useEffect(() => {
    const control = new AbortController()
    const aviso = setTimeout(() => setLento(true), ESPERA_LENTA_MS)

    cargar(control.signal)
      .then((datos) => {
        if (!control.signal.aborted) setEstado({ clave, datos, error: null })
      })
      .catch((error) => {
        if (!control.signal.aborted && error.name !== 'AbortError') setEstado({ clave, datos: null, error })
      })
      .finally(() => {
        clearTimeout(aviso)
        if (!control.signal.aborted) setLento(false)
      })

    return () => {
      control.abort()
      clearTimeout(aviso)
    }
    // cargar cambia en cada render; lo que importa es la clave
  }, [clave])

  const recargar = useCallback(() => setVersion((v) => v + 1), [])
  const cargando = estado.clave !== clave
  // Al recargar se conservan los datos anteriores para que la vista no parpadee
  return { datos: estado.datos, cargando, error: cargando ? null : estado.error, lento, recargar }
}
