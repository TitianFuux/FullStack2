import { createContext, useContext } from 'react'

// El contexto se crea una sola vez; vale null si un componente quedó fuera del proveedor
export const AuthContext = createContext(null)

export function useAuth() {
  const contexto = useContext(AuthContext)
  if (!contexto) {
    throw new Error('useAuth necesita <AuthProvider>')
  }
  return contexto
}
