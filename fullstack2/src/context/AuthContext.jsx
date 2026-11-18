import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem('arena_usuario');
    return guardado ? JSON.parse(guardado) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('arena_token'));

  const iniciarSesion = (authResponse) => {
    localStorage.setItem('arena_token', authResponse.token);
    localStorage.setItem('arena_usuario', JSON.stringify(authResponse.usuario));
    setToken(authResponse.token);
    setUsuario(authResponse.usuario);
  };

  const cerrarSesion = () => {
    localStorage.removeItem('arena_token');
    localStorage.removeItem('arena_usuario');
    setToken(null);
    setUsuario(null);
  };

  const actualizarUsuarioLocal = (usuarioActualizado) => {
    localStorage.setItem('arena_usuario', JSON.stringify(usuarioActualizado));
    setUsuario(usuarioActualizado);
  };

  const rol = usuario?.rol || 'VISITANTE';
  const esAdmin = rol === 'ADMINISTRADOR';
  const esOrganizador = rol === 'ORGANIZADOR';
  const esGestion = esAdmin || esOrganizador;

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        rol,
        esAdmin,
        esOrganizador,
        esGestion,
        estaAutenticado: Boolean(token && usuario),
        iniciarSesion,
        cerrarSesion,
        actualizarUsuarioLocal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}