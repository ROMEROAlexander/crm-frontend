import { useEffect, useState } from 'react';
import { getUsuarios, crearUsuario } from '../services/api';
import { Topbar, Card, Tabla, Tr, Td, Badge, Btn, Modal, Campo, inputStyle, Spinner } from '../components/ui';
import toast from 'react-hot-toast';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [modal, setModal] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [form, setForm] = useState({nombre:'',email:'',password:'',rol:'asesor'});
  const [cargando, setCargando] = useState(true);

  function cargar() { getUsuarios().then(setUsuarios).finally(()=>setCargando(false)); }
  useEffect(cargar, []);

  async function guardar() {
    if (!form.nombre||!form.email||!form.password) { toast.error('Todos los campos son requeridos'); return; }
    setGuardando(true);
    try {
      await crearUsuario(form);
      toast.success('Usuario creado');
      setModal(false);
      cargar();
    } catch(e) { toast.error(e.response?.data?.error||'Error'); }
    finally { setGuardando(false); }
  }

  if (cargando) return <><Topbar titulo="Usuarios"/><Spinner/></>;

  return (
    <>
      <Topbar titulo="Usuarios del sistema">
        <Btn variante="gold" onClick={()=>{ setForm({nombre:'',email:'',password:'',rol:'asesor'}); setModal(true); }}>+ Nuevo usuario</Btn>
      </Topbar>
      <div style={{flex:1,overflowY:'auto',padding:24}}>
        <Card>
          <Tabla headers={['Nombre','Email','Rol','Estado']}>
            {usuarios.map(u=>(
              <Tr key={u.id}>
                <Td bold>{u.nombre}</Td>
                <Td muted>{u.email}</Td>
                <Td><Badge tipo={u.rol==='supervisor'?'info':'gray'}>{u.rol}</Badge></Td>
                <Td><Badge tipo={u.activo?'success':'gray'}>{u.activo?'Activo':'Inactivo'}</Badge></Td>
              </Tr>
            ))}
          </Tabla>
        </Card>
      </div>
      <Modal open={modal} onClose={()=>setModal(false)} title="Nuevo usuario"
        footer={<><Btn variante="outline" onClick={()=>setModal(false)}>Cancelar</Btn><Btn variante="gold" onClick={guardar} disabled={guardando}>{guardando?'Guardando...':'Crear usuario'}</Btn></>}>
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <Campo label="Nombre completo *"><input style={inputStyle} value={form.nombre} onChange={e=>setForm(f=>({...f,nombre:e.target.value}))}/></Campo>
          <Campo label="Correo electrónico *"><input type="email" style={inputStyle} value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/></Campo>
          <Campo label="Contraseña inicial *"><input type="password" style={inputStyle} value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))}/></Campo>
          <Campo label="Rol"><select style={inputStyle} value={form.rol} onChange={e=>setForm(f=>({...f,rol:e.target.value}))}><option value="asesor">Asesor</option><option value="supervisor">Supervisor</option></select></Campo>
        </div>
      </Modal>
    </>
  );
}
