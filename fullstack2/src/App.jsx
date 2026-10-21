import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Inicio from './pages/Inicio';
import Torneos from './pages/Torneo';
import Inscripcion from './pages/Inscripcion';
import GestionEquipo from './pages/GestionEquipo';
import Perfil from './pages/Perfil';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/torneos" element={<Torneos />} />
        <Route path="/inscripcion" element={<Inscripcion />} />
        <Route path="/gestion" element={<GestionEquipo />} />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;