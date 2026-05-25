import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getCliente, crearTramite, getServicios, crearFactura } from '../services/api';
import { Topbar, Card, CardHeader, Tabla, Tr, Td, Badge, Btn, Modal, Campo, inputStyle, Spinner, estadoBadge } from '../components/ui';

function Campo2({ label, valor }) {
  return (
    <div style={{marginBottom:12}}>
      <div style={{fontSize:11,color:'var(--text3)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:3}}>{label}</div>
      <div style={{fontSize:13,color:'var(--text)',fontWeight:500}}>{valor||'—'}</div>
    </div>
  );
}

export default function ClienteDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);
  const [servicios, setServicios] = useState([]);
  const [modalTramite, setModalTramite] = useState(false);
  const [modalFactura, setModalFactura] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [formTramite, setFormTramite] = useState({servicio_id:'',fecha_vencimiento:'',precio:'',notas:''});
  const [formFactura, setFormFactura] = useState({concepto:'',monto:''});

  useEffect(() => {
    getCliente(id).then(setCliente);
    getServicios().then(setServicios);
  }, [id]);

  async function guardarTramite() {
    if (!formTramite.servicio_id) { toast.error('Selecciona un servicio'); return; }
    setGuardando(true);
    try {
      await crearTramite({ cliente_id:parseInt(id), ...formTramite });
      toast.success('Trámite creado');
      setModalTramite(false);
      getCliente(id).then(setCliente);
    } catch(err) { toast.error(err.response?.data?.error||'Error'); }
    finally { setGuardando(false); }
  }

  async function guardarFactura() {
    if (!formFactura.concepto||!formFactura.monto) { toast.error('Concepto y monto requeridos'); return; }
    setGuardando(true);
    try {
      await crearFactura({ cliente_id:parseInt(id), ...formFactura });
      toast.success('Factura creada');
      setModalFactura(false);
    } catch(err) { toast.error(err.response?.data?.error||'Error'); }
    finally { setGuardando(false); }
  }

  if (!cliente) return <><Topbar titulo="Expediente"/><Spinner/></>;

  return (
    <>
      <Topbar titulo="Expediente del cliente">
        <Btn variante="outline" small onClick={()=>navigate('/clientes')}>← Volver</Btn>
      </Topbar>
      <div style={{flex:1,overflowY:'auto',padding:24}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:16}}>
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            <Card padding="18px">
              <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:14}}>
                <div>
                  <div style={{fontFamily:"'DM Serif Display',serif",fontSize:22,color:'var(--navy)'}}>{cliente.nombre}</div>
                  <div style={{fontSize:12,color:'var(--text3)',marginTop:3}}>{cliente.tipo} · {cliente.giro}</div>
                </div>
                <Badge tipo={cliente.activo?'success':'gray'}>{cliente.activo?'● Activo':'Inactivo'}</Badge>
              </div>
              <hr style={{border:'none',borderTop:'1px solid var(--border)',margin:'14px 0'}}/>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 24px'}}>
                <Campo2 label="NIT" valor={cliente.nit}/>
                <Campo2 label="NRC" valor={cliente.nrc}/>
                <Campo2 label="Teléfono" valor={cliente.telefono}/>
                <Campo2 label="Correo" valor={cliente.email}/>
                <Campo2 label="Municipio" valor={cliente.municipio}/>
                <Campo2 label="Asesor" valor={cliente.asesor_nombre}/>
              </div>
              {cliente.notas && <><hr style={{border:'none',borderTop:'1px solid var(--border)',margin:'10px 0'}}/><div style={{fontSize:12,color:'var(--text2)'}}>{cliente.notas}</div></>}
            </Card>
            <Card>
              <CardHeader title={`Trámites (${cliente.tramites?.length||0})`}>
                <Btn variante="outline" small onClick={()=>setModalTramite(true)}>+ Agregar</Btn>
                <Btn variante="outline" small onClick={()=>setModalFactura(true)}>+ Factura</Btn>
              </CardHeader>
              {!cliente.tramites?.length
                ? <div style={{padding:'24px',textAlign:'center',color:'var(--text3)',fontSize:13}}>Sin trámites</div>
                : <Tabla headers={['Servicio','Estado','Precio','Vence']}>
                    {cliente.tramites.map(t=>{
                      const b = estadoBadge[t.estado]||{};
                      return (
                        <Tr key={t.id}>
                          <Td bold>{t.servicio_nombre}</Td>
                          <Td><Badge tipo={b.tipo}>{b.label}</Badge></Td>
                          <Td muted>{t.precio?`$${Number(t.precio).toFixed(2)}`:'—'}</Td>
                          <Td muted>{t.fecha_vencimiento?new Date(t.fecha_vencimiento).toLocaleDateString('es-SV'):'—'}</Td>
                        </Tr>
                      );
                    })}
                  </Tabla>
              }
            </Card>
          </div>
          <Card padding="16px">
            <div style={{fontWeight:600,fontSize:14,color:'var(--navy)',marginBottom:14}}>Historial</div>
            {!cliente.tramites?.length
              ? <div style={{color:'var(--text3)',fontSize:13}}>Sin actividad</div>
              : <ul style={{listStyle:'none',padding:0}}>
                  {cliente.tramites.map((t,i)=>(
                    <li key={t.id} style={{display:'flex',gap:10,paddingBottom:14,position:'relative'}}>
                      {i<cliente.tramites.length-1 && <div style={{position:'absolute',left:7,top:18,bottom:0,width:1,background:'var(--border)'}}/>}
                      <div style={{width:16,height:16,borderRadius:'50%',flexShrink:0,marginTop:1,background:'var(--gold)',border:'2px solid var(--white)',boxShadow:'0 0 0 1px var(--border)'}}/>
                      <div>
                        <div style={{fontSize:12,color:'var(--text2)',lineHeight:1.5}}><strong>{t.servicio_nombre}</strong></div>
                        <div style={{fontSize:11,color:'var(--text3)',marginTop:3}}>{new Date(t.created_at).toLocaleDateString('es-SV')}</div>
                      </div>
                    </li>
                  ))}
                </ul>
            }
          </Card>
        </div>
      </div>

      <Modal open={modalTramite} onClose={()=>setModalTramite(false)} title="Agregar trámite"
        footer={<><Btn variante="outline" onClick={()=>setModalTramite(false)}>Cancelar</Btn><Btn variante="gold" onClick={guardarTramite} disabled={guardando}>{guardando?'Guardando...':'Crear trámite'}</Btn></>}>
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <Campo label="Servicio *">
            <select style={inputStyle} value={formTramite.servicio_id} onChange={e=>setFormTramite(f=>({...f,servicio_id:e.target.value}))}>
              <option value="">-- Seleccionar --</option>
              {servicios.map(s=><option key={s.id} value={s.id}>{s.nombre}{s.precio_base?` ($${s.precio_base})`:''}</option>)}
            </select>
          </Campo>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <Campo label="Fecha vencimiento"><input type="date" style={inputStyle} value={formTramite.fecha_vencimiento} onChange={e=>setFormTramite(f=>({...f,fecha_vencimiento:e.target.value}))}/></Campo>
            <Campo label="Precio"><input type="number" style={inputStyle} placeholder="0.00" value={formTramite.precio} onChange={e=>setFormTramite(f=>({...f,precio:e.target.value}))}/></Campo>
          </div>
          <Campo label="Notas"><textarea style={{...inputStyle,minHeight:60,resize:'vertical'}} value={formTramite.notas} onChange={e=>setFormTramite(f=>({...f,notas:e.target.value}))}/></Campo>
        </div>
      </Modal>

      <Modal open={modalFactura} onClose={()=>setModalFactura(false)} title="Crear factura"
        footer={<><Btn variante="outline" onClick={()=>setModalFactura(false)}>Cancelar</Btn><Btn variante="gold" onClick={guardarFactura} disabled={guardando}>{guardando?'Guardando...':'Crear factura'}</Btn></>}>
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <Campo label="Concepto *"><input style={inputStyle} value={formFactura.concepto} onChange={e=>setFormFactura(f=>({...f,concepto:e.target.value}))} placeholder="Ej: Renovación matrícula"/></Campo>
          <Campo label="Monto ($) *"><input type="number" style={inputStyle} value={formFactura.monto} onChange={e=>setFormFactura(f=>({...f,monto:e.target.value}))} placeholder="0.00"/></Campo>
        </div>
      </Modal>
    </>
  );
}
