import { useEffect, useState } from 'react';
import { getResumen, getServiciosPopulares } from '../services/api';
import { Topbar, Card, StatCard, Spinner } from '../components/ui';

export default function Reportes() {
  const [resumen, setResumen] = useState(null);
  const [servicios, setServicios] = useState([]);

  useEffect(() => {
    getResumen().then(setResumen).catch(()=>{});
    getServiciosPopulares().then(setServicios).catch(()=>{});
  }, []);

  if (!resumen) return <><Topbar titulo="Reportes"/><Spinner/></>;

  const total = servicios.reduce((s,x)=>s+x.cantidad,0)||1;

  return (
    <>
      <Topbar titulo="Reportes"/>
      <div style={{flex:1,overflowY:'auto',padding:24}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:20}}>
          <StatCard label="Clientes activos" valor={resumen.clientes_activos}/>
          <StatCard label="Trámites en curso" valor={resumen.tramites_en_curso}/>
          <StatCard label="Completados" valor={resumen.tramites_completados} tag="✓" tagTipo="success"/>
          <StatCard label="Ingresos del mes" valor={`$${Number(resumen.ingresos_mes_actual||0).toFixed(2)}`}/>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <Card padding="20px">
            <div style={{fontWeight:600,fontSize:14,color:'var(--navy)',marginBottom:16}}>Pendiente de cobro</div>
            <div style={{fontSize:32,fontWeight:700,color:'var(--danger)'}}>
              ${Number(resumen.pendiente_cobro||0).toFixed(2)}
            </div>
          </Card>
          <Card padding="20px">
            <div style={{fontWeight:600,fontSize:14,color:'var(--navy)',marginBottom:16}}>Servicios más solicitados</div>
            {servicios.map((s,i)=>(
              <div key={i} style={{marginBottom:10}}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:4}}>
                  <span>{s.nombre}</span>
                  <span style={{color:'var(--text3)'}}>{s.cantidad}</span>
                </div>
                <div style={{height:6,background:'var(--cream2)',borderRadius:3,overflow:'hidden'}}>
                  <div style={{height:'100%',borderRadius:3,background:'var(--navy)',width:`${(s.cantidad/total)*100}%`}}/>
                </div>
              </div>
            ))}
            {!servicios.length && <div style={{color:'var(--text3)',fontSize:13}}>Sin datos aún</div>}
          </Card>
        </div>
      </div>
    </>
  );
}
