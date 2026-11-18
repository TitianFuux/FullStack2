import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [modoRegistro, setModoRegistro] = useState(false);
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [apodo, setApodo] = useState('');
  const [edad, setEdad] = useState(20);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      const respuesta = modoRegistro
        ? await api.registro({ nombre, apodo, correo, edad: Number(edad), password })
        : await api.login({ correo, password });

      iniciarSesion(respuesta);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <main id="contenido-principal">
      <section className="franja">
        <div className="contenedor" style={{ maxWidth: '480px' }}>
          <h1>{modoRegistro ? 'Crear cuenta de Jugador' : 'Iniciar sesión'}</h1>
          <p>Accede con tu cuenta registrada en eSports Arena Manager.</p>

          <div style={{ display: 'flex', gap: '0.75rem', margin: '1.5rem 0' }}>
            <button
              type="button"
              className={`boton ${!modoRegistro ? '' : 'boton-secundario'}`}
              onClick={() => { setModoRegistro(false); setError(''); }}
            >
              Ingresar
            </button>
            <button
              type="button"
              className={`boton ${modoRegistro ? '' : 'boton-secundario'}`}
              onClick={() => { setModoRegistro(true); setError(''); }}
            >
              Registrarse
            </button>
          </div>

          <form onSubmit={manejarSubmit} className="tarjeta-torneo" style={{ display: 'grid', gap: '1rem' }}>
            {modoRegistro && (
              <>
                <div>
                  <label htmlFor="nombre">Nombre completo</label>
                  <input
                    id="nombre"
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: Carlos Ruiz"
                    style={{ width: '100%', padding: '0.65rem', marginTop: '0.35rem' }}
                  />
                </div>
                <div>
                  <label htmlFor="apodo">Apodo (Nickname)</label>
                  <input
                    id="apodo"
                    type="text"
                    required
                    minLength={3}
                    maxLength={30}
                    value={apodo}
                    onChange={(e) => setApodo(e.target.value)}
                    placeholder="Ej: cruiz"
                    style={{ width: '100%', padding: '0.65rem', marginTop: '0.35rem' }}
                  />
                </div>
                <div>
                  <label htmlFor="edad">Edad</label>
                  <input
                    id="edad"
                    type="number"
                    required
                    min={13}
                    max={99}
                    value={edad}
                    onChange={(e) => setEdad(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', marginTop: '0.35rem' }}
                  />
                </div>
              </>
            )}

            <div>
              <label htmlFor="correo">Correo electrónico</label>
              <input
                id="correo"
                type="email"
                required
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="usuario@correo.cl"
                style={{ width: '100%', padding: '0.65rem', marginTop: '0.35rem' }}
              />
            </div>

            <div>
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                required
                minLength={modoRegistro ? 8 : 4}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '0.65rem', marginTop: '0.35rem' }}
              />
            </div>

            {error && (
              <p role="alert" style={{ color: '#FF5C7A', fontWeight: 600, margin: 0 }}>
                ⚠ {error}
              </p>
            )}

            <button type="submit" className="boton" disabled={cargando}>
              {cargando ? 'Procesando...' : modoRegistro ? 'Registrarme' : 'Entrar'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}