import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useEffect, useState } from 'react';
import { getAlertas } from './services/api';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import ClienteDetalle from './pages/ClienteDetalle';
import Seguimiento from './pages/Seguimiento';
import Alertas from './pages/Alertas';
import Facturacion from './pages/Facturacion';
import Reportes from './pages/Reportes';
import Usuarios from './pages/Usuarios';

function RutaProtegida({ children, soloSupervisor }) {
  const { usuario, cargando } = useAuth();
  if (cargando) return null;
  if (!usuario) return <Navigate to="/login" replace />;
  if (soloSupervisor && usuario.rol !== 'supervisor') return <Navigate to="/" replace />;
  return children;
}

function AppConAuth() {
  const { usuario } = useAuth();
  const [alertasCount, setAlertasCount] = useState(0);

  useEffect(() => {
    if (usuario) getAlertas().then(a => setAlertasCount(a.length)).catch(() => {});
  }, [usuario]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<RutaProtegida><Layout alertasCount={alertasCount} /></RutaProtegida>}>
          <Route index element={<Dashboard />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="clientes/:id" element={<ClienteDetalle />} />
          <Route path="seguimiento" element={<Seguimiento />} />
          <Route path="alertas" element={<Alertas />} />
          <Route path="facturacion" element={<Facturacion />} />
          <Route path="reportes" element={<RutaProtegida soloSupervisor><Reportes /></RutaProtegida>} />
          <Route path="usuarios" element={<RutaProtegida soloSupervisor><Usuarios /></RutaProtegida>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{ style: { fontFamily: "'DM Sans',sans-serif", fontSize: 13 } }} />
      <AppConAuth />
    </AuthProvider>
  );
}
