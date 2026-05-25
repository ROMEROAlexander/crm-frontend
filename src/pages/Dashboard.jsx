import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAlertas, getKanban, getServicios } from '../services/api';
import { Topbar, StatCard, Card, CardHeader, Tabla, Tr, Td, Badge, Btn, Spinner, estadoBadge } from '../components/ui';
import { useAuth } from '../context/AuthContext';

function diasColor(dias) {
  if (dias <= 0) return 'var(--danger)';
  if (dias <= 7) return 'var(--warn)';
  return 'var(--text3)';
}

function diasLabel(dias) {
  if (dias <= 0) return 'HOY';
  if (dias === 1) return 'Mañana';
  return `${dias} días`;
}

export default function Dashboard() {
  const [kanban, setKanban] = useState(null);
  const [alertas, setAlertas] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getKanban(), getAlertas(), getServicios()])
      .then(([k,a,s]) => { setKanban(k); setAlertas(a); setServicios(s); })
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return <><Topbar titulo="Dashboard"/><Spinner/></>;

  const enCurso = kanban ? (kanban.iniciado?.length||0)+(kanban.en_proceso?.length||0)+(kanban.revision?.length||0) : 0;
  const completados = kanban?.completado?.length || 0;
  const recientes = [...(kanban?.iniciado||[]),(kanban?.en_proceso||[]),(kanban?.revision||[])].flat().slice(0,6);

  return (
    <>
      <Topbar titulo="Dashboard">
        {alertas.length > 0 && (
          <span onClick={() => navigate('/alertas')} style={{background:'var(--danger-bg)',color:'var(--danger)',fontSize:11,padding:'3px 10px',borderRadius:20,fontWeight:500,cursor:'pointer'}}>
            ⚠ {alertas.length} vencimiento{alertas.length>1?'s':''} próximo{alertas.length>1?'s':''}
          </span>
        )}
        <Btn variante="gold" onClick={() => navigate('/clientes')}>+ Nuevo cliente</Btn>
      </Topbar>
      <div style={{flex:1,overflowY:'auto',padding:24}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:22}}>
          <StatCard label="Trámites en curso" valor={enCurso} sub="Activos ahora"/>
          <StatCard label="Completados" valor={completados} sub="En este período" tag="✓" tagTipo="success"/>
          <StatCard label="Alertas" valor={alertas.length} sub="Próximos a vencer" tag={alertas.length>0?'Revisar':'Al día'} tagTipo={alertas.length>0?'danger':'success'}/>
          <StatCard label="Servicios" valor={servicios.length} sub="En catálogo"/>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:16}}>
          <Card>
            <CardHeader title="Trámites activos">
              <Btn variante="outline" small onClick={() => navigate('/seguimiento')}>Ver tablero →</Btn>
            </CardHeader>
            {recientes.length === 0
              ? <div style={{padding:'30px',textAlign:'center',color:'var(--text3)',fontSize:13}}>No hay trámites activos.</div>
              : <Tabla headers={['Cliente','Servicio','Estado','Vence']}>
                  {recientes.map(t => {
                    const b = estadoBadge[t.estado]||{};
                    const dias = t.fecha_vencimiento ? Math.round((new Date(t.fecha_vencimiento)-new Date())/86400000) : null;
                    return (
                      <Tr key={t.id} onClick={() => navigate('/seguimiento')}>
                        <Td bold>{t.cliente_nombre}</Td>
                        <Td>{t.servicio_nombre}</Td>
                        <Td><Badge tipo={b.tipo}>{b.label}</Badge></Td>
                        <Td muted={dias===null} style={{color:dias!==null?diasColor(dias):undefined,fontWeight:dias!==null&&dias<=7?600:400}}>
                          {dias!==null?diasLabel(dias):'—'}
                        </Td>
                      </Tr>
                    );
                  })}
                </Tabla>
            }
          </Card>
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            <Card padding="16px">
              <div style={{fontWeight:600,fontSize:14,color:'var(--navy)',marginBottom:12}}>Alertas urgentes</div>
              {alertas.length===0
                ? <div style={{color:'var(--text3)',fontSize:13}}>✓ Sin vencimientos próximos</div>
                : alertas.slice(0,5).map(a => {
                    const dias = Math.round((new Date(a.fecha_vencimiento)-new Date())/86400000);
                    return (
                      <div key={a.id} style={{padding:'10px 12px',borderRadius:8,marginBottom:8,background:'var(--white)',border:'1px solid var(--border)',borderLeft:`3px solid ${dias<=0?'#c0392b':'var(--gold)'}`,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                        <div>
                          <div style={{fontSize:12,fontWeight:600,color:'var(--navy)'}}>{a.cliente_nombre}</div>
                          <div style={{fontSize:11,color:'var(--text3)'}}>{a.servicio_nombre}</div>
                        </div>
                        <div style={{fontSize:11,fontWeight:700,color:dias<=0?'#c0392b':'var(--warn)'}}>{diasLabel(dias)}</div>
                      </div>
                    );
                  })
              }
              {alertas.length>0 && <Btn variante="outline" small onClick={() => navigate('/alertas')} style={{width:'100%',justifyContent:'center',marginTop:4}}>Ver todas</Btn>}
            </Card>
            <Card padding="16px">
              <div style={{fontWeight:600,fontSize:14,color:'var(--navy)',marginBottom:10}}>Flujo Kanban</div>
              {kanban && ['iniciado','en_proceso','revision','completado'].map(estado => {
                const b = estadoBadge[estado];
                return (
                  <div key={estado} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 0',borderBottom:'1px solid var(--border)'}}>
                    <Badge tipo={b.tipo}>{b.label}</Badge>
                    <span style={{fontWeight:600,color:'var(--navy)'}}>{kanban[estado]?.length||0}</span>
                  </div>
                );
              })}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
