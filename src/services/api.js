import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('crm_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('crm_token');
      localStorage.removeItem('crm_usuario');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const login = (email, password) =>
  api.post('/auth/login', { email, password }).then(r => r.data);
export const getMe = () => api.get('/auth/me').then(r => r.data);
export const getClientes = () => api.get('/clientes').then(r => r.data);
export const getCliente = (id) => api.get(`/clientes/${id}`).then(r => r.data);
export const crearCliente = (data) => api.post('/clientes', data).then(r => r.data);
export const editarCliente = (id, data) => api.put(`/clientes/${id}`, data).then(r => r.data);
export const getKanban = () => api.get('/tramites/kanban').then(r => r.data);
export const getAlertas = () => api.get('/tramites/alertas').then(r => r.data);
export const crearTramite = (data) => api.post('/tramites', data).then(r => r.data);
export const cambiarEstado = (id, estado, notas) =>
  api.put(`/tramites/${id}/estado`, { estado, notas }).then(r => r.data);
export const getFacturas = () => api.get('/facturas').then(r => r.data);
export const crearFactura = (data) => api.post('/facturas', data).then(r => r.data);
export const registrarPago = (id) => api.put(`/facturas/${id}/pagar`).then(r => r.data);
export const getServicios = () => api.get('/servicios').then(r => r.data);
export const getUsuarios = () => api.get('/usuarios').then(r => r.data);
export const crearUsuario = (data) => api.post('/usuarios', data).then(r => r.data);
export const getResumen = () => api.get('/reportes/resumen').then(r => r.data);
export const getServiciosPopulares = () => api.get('/reportes/servicios-populares').then(r => r.data);

export default api;
