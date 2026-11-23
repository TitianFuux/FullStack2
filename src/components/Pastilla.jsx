// El estado nunca se comunica solo con color: cada pastilla lleva icono y texto
const ESTADOS = {
  abierto: { icono: '●', texto: 'Abierto' },
  en_curso: { icono: '▶', texto: 'En curso' },
  finalizado: { icono: '✔', texto: 'Finalizado' },
  validada: { icono: '✔', texto: 'Validada' },
  programada: { icono: '◷', texto: 'Programada' },
  pendiente: { icono: '…', texto: 'Pendiente' },
  en_juego: { icono: '▶', texto: 'En juego' },
  activo: { icono: '●', texto: 'Activo' },
  inactivo: { icono: '○', texto: 'Inactivo' },
  vigente: { icono: '⛔', texto: 'Vigente' },
  cumplida: { icono: '✔', texto: 'Cumplida' },
}

export default function Pastilla({ estado, texto }) {
  const e = ESTADOS[estado] ?? { icono: '•', texto: estado }
  return (
    <span className={`pastilla pastilla--${estado}`}>
      <span aria-hidden="true">{e.icono}</span> {texto ?? e.texto}
    </span>
  )
}
