import { useEffect, useState } from 'react';
import { getFacturas, registrarPago } from '../services/api';
import { Topbar, Card, Tabla, Tr, Td, Badge, Btn, Spinner } from '../components/ui';
import toast from 'react-hot-toast';

export default function Facturacion() {
  const [facturas, setFacturas] = useState([]);
  const [cargando, setCargando] = useState(true);

  function cargar() { getFacturas().then(setFacturas).finally(()=>setCargando(false)); }
  useEffect(cargar, []);

  async function pagar(id) {
    try { await registrarPago(id); toast.success('Pago registrado'); cargar(); }
    catch { toast.error('Error'); }
  }

  const pendiente = facturas.filter(f=>f.estado==='pendiente').reduce((s,f)=>s+f.monto,0);
  const cobrado = facturas.filter(f=>f.estado==='pagado').reduce((s,f)=>s+f.monto,0);

  if (cargando) return <><Topbar titulo="Facturación"/><Spinner/></>;

  return (
    <>
      <Topbar titulo="Facturación"/>
      <div style={{flex:1,overflowY:'auto',padding:24}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:20}}>
          {[
            {label:'Total cobrado',valor:`$${cobrado.toFixed(2)}`,color:'var(--success)'},
            {label:'Pendiente de cobro',valor:`$${pendiente.toFixed(2)}`,color:'var(--danger)'},
            {label:'Total facturas',valor:facturas.length,color:'var(--navy)'},
          ].map(s=>(
            <div key={s.label} style={{background:'var(--white)',borderRadius:'var(--radius)',padding:'16px 18px',border:'1px solid var(--border)',boxShadow:'var(--shadow)'}}>
              <div style={{fontSize:11,color:'var(--text3)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:6}}>{s.label}</div>
              <div style={{fontSize:24,fontWeight:600,color:s.color}}>{s.valor}</div>
            </div>
          ))}
        </div>
        <Card>
          <Tabla headers={['#','Cliente','Concepto','Monto','Fecha','Estado','Acción']}>
            {facturas.map(f=>(
              <Tr key={f.id}>
                <Td muted>#{f.id}</Td>
                <Td bold>{f.cliente_nombre}</Td>
                <Td>{f.concepto}</Td>
                <Td bold>${Number(f.monto).toFixed(2)}</Td>
                <Td muted>{new Date(f.fecha_emision).toLocaleDateString('es-SV')}</Td>
                <Td><Badge tipo={f.estado==='pagado'?'success':f.estado==='cancelado'?'gray':'warn'}>{f.estado==='pagado'?'✓ Pagado':f.estado==='cancelado'?'Cancelado':'Pendiente'}</Badge></Td>
                <Td>{f.estado==='pendiente'&&<Btn variante="outline" small onClick={()=>pagar(f.id)}>Marcar pagado</Btn>}</Td>
              </Tr>
            ))}
          </Tabla>
        </Card>
      </div>
    </>
  );
}
