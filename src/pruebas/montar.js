// Ayudas compartidas por las pruebas de componentes (no es una prueba: Karma solo carga los *.spec.js y *.spec.jsx)
import { act } from 'react'
import { createRoot } from 'react-dom/client'

// React necesita saber que está en un entorno de pruebas
globalThis.IS_REACT_ACT_ENVIRONMENT = true

// Monta un elemento en el DOM real. Devuelve el contenedor, renderizar() para cambiar props y desmontar() (llamarla en afterEach).
export function montar(elemento) {
  const contenedor = document.createElement('div')
  document.body.appendChild(contenedor)
  const raiz = createRoot(contenedor)
  act(() => raiz.render(elemento))
  return {
    contenedor,
    // Vuelve a dibujar en la misma raíz (por ejemplo, con otras props)
    renderizar(nuevo) {
      act(() => raiz.render(nuevo))
    },
    desmontar() {
      act(() => raiz.unmount())
      contenedor.remove()
    },
  }
}

export function hacerClic(elemento) {
  act(() => elemento.dispatchEvent(new MouseEvent('click', { bubbles: true })))
}

// Escribe en un <input> controlado por React: hay que usar el setter nativo y disparar el evento input
export function escribir(campo, texto) {
  const asignar = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set
  act(() => {
    asignar.call(campo, texto)
    campo.dispatchEvent(new Event('input', { bubbles: true }))
  })
}

// Cambia el valor de un <select> controlado por React
export function elegir(select, valor) {
  const asignar = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set
  act(() => {
    asignar.call(select, valor)
    select.dispatchEvent(new Event('change', { bubbles: true }))
  })
}

export function enviar(formulario) {
  act(() => formulario.requestSubmit())
}

// Deja que se resuelvan las promesas pendientes (servicios simulados con espías) y React termine de renderizar
export async function esperar(ciclos = 4) {
  for (let i = 0; i < ciclos; i++) {
    await act(async () => {
      await Promise.resolve()
    })
  }
}
