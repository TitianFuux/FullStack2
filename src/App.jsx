import { Route, Routes } from 'react-router'
import RutaProtegida from './auth/RutaProtegida.jsx'
import AvisoSesion from './components/AvisoSesion.jsx'
import Cabecera from './components/Cabecera.jsx'
import PieDePagina from './components/PieDePagina.jsx'
import { ROLES_GESTION } from './logica/rutas.js'
import DetalleTorneo from './pages/DetalleTorneo.jsx'
import GestionEquipo from './pages/GestionEquipo.jsx'
import Inicio from './pages/Inicio.jsx'
import Inscripcion from './pages/Inscripcion.jsx'
import Login from './pages/Login.jsx'
import NoEncontrado from './pages/NoEncontrado.jsx'
import PanelGestion from './pages/PanelGestion.jsx'
import Perfil from './pages/Perfil.jsx'
import Torneos from './pages/Torneos.jsx'

// Rutas públicas: inicio, torneos, detalle, inscripción, equipos, perfiles y login (los formularios piden sesión al enviar).
// Ruta con rol: el panel de gestión solo lo abren organizadores y administradores.
export default function App() {
  return (
    <>
      <a className="salto-contenido" href="#contenido-principal">
        Saltar al contenido
      </a>
      <Cabecera />
      <AvisoSesion />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/torneos" element={<Torneos />} />
        <Route path="/torneos/:id" element={<DetalleTorneo />} />
        <Route path="/inscripcion" element={<Inscripcion />} />
        <Route path="/gestion" element={<GestionEquipo />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/panel"
          element={
            <RutaProtegida rol={ROLES_GESTION}>
              <PanelGestion />
            </RutaProtegida>
          }
        />
        <Route path="*" element={<NoEncontrado />} />
      </Routes>
      <PieDePagina />
    </>
  )
}
