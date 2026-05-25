import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getClientes, crearCliente, getUsuarios } from '../services/api';
import { Topbar, Card, CardHeader, Tabla, Tr, Td, Badge, Btn, Modal, Campo, inputStyle, Spinner, Vacio } from '../components/ui';
import { useAuth } from '../context/AuthContext';

const MUNICIPIOS = ['La Unión','Santa Rosa de Lima','El Carmen','Conchagua','Intipucá','Meanguera del Golfo','Pasaquina','Bolívar','El Sauce','Lislique','Nueva Esparta','Poloros','San Alejo','San José'];

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const { esSupervisor } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({nombre:'',tipo:'Persona Natural',nit:'',nrc:'',giro:'',telefono:'',email:'',municipio:'La Unión',notas:'',asesor_id:''});

  useEffect(() => {
    getClientes().then(setClientes);
    if (esSupervisor) getUsuarios().then(setUsuarios);
  }, []);

  const filtrados = clientes.filter(c =>
    c.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    c.nit.includes(filtro) ||
    (c.giro||'').toLowerCase().includes(filtro.toLowerCase())
  );

  async function handleGuardar() {
    if (!form.nombre || !form.nit || !form.giro) { toast.error('Nombre, NIT y giro son requeridos'); return; }
    setGuardando(true);
    try {
      await crearCliente(form);
      toast.success('Cliente registrado');
      setModalOpen(false);
      getClientes().then(setClientes);
    } catch(err) { toast.error(err.response?.data?.error||'Error al guardar'); }
    finally { setGuardando(false); }
  }

  function upd(campo, val) { setForm(f=>({...f,[campo]:val})); }

  return (
    <>
      <Topbar titulo="Clientes">
        <Btn variante="gold" onClick={() => { setForm({nombre:'',tipo:'Persona Natural',nit:'',nrc:'',giro:'',telefono:'',email:'',municipio:'La Unión',notas:'',asesor_id:''}); setModalOpen(true); }}>+ Nuevo cliente</Btn>
      </Topbar>
      <div style={{flex:1,overflowY:'auto',padding:24}}>
        <Card>
          <CardHeader title={`Clientes (${filtrados.length})`}>
            <input value={filtro} onChange={e=>setFiltro(e.target.value)} placeholder="🔍 Buscar..." style={{...inputStyle,width:250}}/>
          </CardHeader>
          {filtrados.length===0
            ? <Vacio mensaje={filtro?'Sin resultados':'Aún no hay clientes registrados'}/>
            : <Tabla headers={['Nombre','NIT','NRC','Tipo','Teléfono','Municipio','Estado']}>
                {filtrados.map(c=>(
                  <Tr key={c.id} onClick={()=>navigate(`/clientes/${c.id}`)}>
                    <Td bold style={{color:'var(--navy)'}}>{c.nombre}</Td>
                    <Td>{c.nit}</Td>
                    <Td muted>{c.nrc||'—'}</Td>
                    <Td muted>{c.tipo}</Td>
                    <Td muted>{c.telefono||'—'}</Td>
                    <Td muted>{c.municipio||'—'}</Td>
                    <Td><Badge tipo={c.activo?'success':'gray'}>{c.activo?'● Activo':'○ Inactivo'}</Badge></Td>
                  </Tr>
                ))}
              </Tabla>
          }
        </Card>
      </div>
      <Modal open={modalOpen} onClose={()=>setModalOpen(false)} title="Nuevo cliente"
        footer={<><Btn variante="outline" onClick={()=>setModalOpen(false)}>Cancelar</Btn><Btn variante="gold" onClick={handleGuardar} disabled={guardando}>{guardando?'Guardando...':'Guardar cliente'}</Btn></>}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          <Campo label="Nombre / Razón social *" full><input style={inputStyle} value={form.nombre} onChange={e=>upd('nombre',e.target.value)} placeholder="Ej: Ferretería López"/></Campo>
          <Campo label="Tipo de cliente *"><select style={inputStyle} value={form.tipo} onChange={e=>upd('tipo',e.target.value)}><option>Persona Natural</option><option>Sociedad</option></select></Campo>
          <Campo label="Giro comercial *"><input style={inputStyle} value={form.giro} onChange={e=>upd('giro',e.target.value)} placeholder="Ej: Venta al por menor"/></Campo>
          <Campo label="NIT *"><input style={inputStyle} value={form.nit} onChange={e=>upd('nit',e.target.value)} placeholder="0000-000000-000-0"/></Campo>
          <Campo label="NRC"><input style={inputStyle} value={form.nrc} onChange={e=>upd('nrc',e.target.value)} placeholder="000000-0"/></Campo>
          <Campo label="Teléfono"><input style={inputStyle} value={form.telefono} onChange={e=>upd('telefono',e.target.value)} placeholder="7000-0000"/></Campo>
          <Campo label="Correo electrónico"><input style={inputStyle} type="email" value={form.email} onChange={e=>upd('email',e.target.value)} placeholder="correo@empresa.com"/></Campo>
          <Campo label="Municipio"><select style={inputStyle} value={form.municipio} onChange={e=>upd('municipio',e.target.value)}>{MUNICIPIOS.map(m=><option key={m}>{m}</option>)}</select></Campo>
          {esSupervisor && usuarios.length>0 && (
            <Campo label="Asesor asignado"><select style={inputStyle} value={form.asesor_id} onChange={e=>upd('asesor_id',e.target.value)}><option value="">-- Seleccionar --</option>{usuarios.filter(u=>u.activo).map(u=><option key={u.id} value={u.id}>{u.nombre}</option>)}</select></Campo>
          )}
          <Campo label="Notas" full><textarea style={{...inputStyle,minHeight:70,resize:'vertical'}} value={form.notas} onChange={e=>upd('notas',e.target.value)} placeholder="Observaciones..."/></Campo>
        </div>
      </Modal>
    </>
  );
}
