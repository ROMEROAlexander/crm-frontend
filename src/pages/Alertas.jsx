import { useEffect, useState } from 'react';
import { getAlertas } from '../services/api';
import { Topbar, Card, Spinner } from '../components/ui';

function diasInfo(fecha) {
  const dias = Math.round((new Date(fecha)-new Date())/86400000);
  if (dias<=0) return { label:'VENCE HOY', color:'#c0392b', border:'#c0392b' };
  if (dias===1) return { label:'Mañana', color:'var(--warn)', border:'var(--gold)' };
  if (dias<=7) return { label:`${dias} días`, color:'var(--warn)', border:'var(--gold)' };
  return { label:`${dias} días`, color:'var(--text3)', border:'var(--border)' };
}

export default function Alertas() {
  const [alertas, setAlertas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => { getAlertas().then(setAlertas).finally(()=>setCargando(false)); }, []);

  if (cargando) return <><Topbar titulo="Alertas"/><Spinner/></>;

  return (
    <>
      <Topbar titulo="Alertas y vencimientos"/>
      <div style={{flex:1,overflowY:'auto',padding:24}}>
        {alertas.length===0
          ? <Card padding="40px" style={{textAlign:'center',color:'var(--text3)'}}>✓ Sin vencimientos próximos en los próximos 15 días</Card>
          : <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {alertas.map(a => {
                const { label, color, border } = diasInfo(a.fecha_vencimiento);
                return (
                  <div key={a.id} style={{background:'var(--white)',borderRadius:'var(--radius)',padding:'14px 18px',border:'1px solid var(--border)',borderLeft:`4px solid ${border}`,display:'flex',alignItems:'center',gap:16}}>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:600,fontSize:13,color:'var(--navy)'}}>{a.cliente_nombre}</div>
                      <div style={{fontSize:12,color:'var(--text3)'}}>{a.servicio_nombre}{a.asesor_nombre&&` · ${a.asesor_nombre}`}</div>
                    </div>
                    <div style={{fontWeight:700,fontSize:13,color,minWidth:80,textAlign:'right'}}>{label}</div>
                    <div style={{fontSize:12,color:'var(--text3)'}}>{new Date(a.fecha_vencimiento).toLocaleDateString('es-SV')}</div>
                  </div>
                );
              })}
            </div>
        }
      </div>
    </>
  );
}
