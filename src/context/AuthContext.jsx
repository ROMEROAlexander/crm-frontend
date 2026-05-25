import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('crm_token');
    const usuarioGuardado = localStorage.getItem('crm_usuario');
    if (token && usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
    setCargando(false);
  }, []);

  async function iniciarSesion(email, password) {
    const data = await apiLogin(email, password);
    localStorage.setItem('crm_token', data.token);
    localStorage.setItem('crm_usuario', JSON.stringify(data.usuario));
    setUsuario(data.usuario);
    return data.usuario;
  }

  function cerrarSesion() {
    localStorage.removeItem('crm_token');
    localStorage.removeItem('crm_usuario');
    setUsuario(null);
  }

  const esSupervisor = usuario?.rol === 'supervisor';

  return (
    <AuthContext.Provider value={{ usuario, cargando, iniciarSesion, cerrarSesion, esSupervisor }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
