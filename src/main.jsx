// Punto de entrada de la aplicación.
// 1. index.html carga este archivo con <script type="module">.
// 2. createRoot toma el <div id="root"> de index.html y lo convierte en la raíz de React.
// 3. render dibuja dentro de esa raíz el árbol de componentes que empieza en <App />.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/tema.css'
import './styles/app.css'
import App from './App.jsx'
import AuthProvider from './auth/AuthProvider.jsx'

const contenedor = document.getElementById('root')
const raiz = createRoot(contenedor)

raiz.render(
  // StrictMode solo actúa en desarrollo: ejecuta dos veces renders y efectos
  // para detectar código impuro. No aparece en el HTML final.
  <StrictMode>
    {/* El router va dentro del proveedor de sesión */}
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
