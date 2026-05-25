import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getKanban, cambiarEstado } from '../services/api';
import { Topbar, Badge, Btn, estadoBadge, Spinner } from '../components/ui';

const COLUMNAS = [
  { key:'iniciado',   label:'Iniciado',       tipo:'info' },
  { key:'en_proceso', label:'En proceso',     tipo:'warn' },
  { key:'revision',   label:'Revisión final', tipo:'warn' },
  { key:'completado', label:'Completado',     tipo:'success' },
];

function diasRestantes(fecha) {
  if (!fecha) return null;
  return Math.round((new Date(fecha)-new Date())/86400000);
}

function diasLabel(dias) {
  if (dias===null) return null;
  if (dias<=0) return 'HOY';
  if (dias===1) return 'Mañana';
  return `${dias}d`;
}

export default function Seguimiento() {
  const [kanban, setKanban] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [moviendo, setMoviendo] = useState(null);

  useEffect(() => { cargar(); }, []);

  async function cargar() {
    setCargando(true);
    try { setKanban(await getKanban()); }
    finally { setCargando(false); }
  }

  async function moverTramite(tramiteId, estadoActual, direccion) {
    const order = ['iniciado','en_proceso','revision','completado'];
    const idx = order.indexOf(estadoActual);
    const nuevoIdx = direccion==='next' ? idx+1 : idx-1;
    if (nuevoIdx<0||nuevoIdx>=order.length) return;
    setMoviendo(tramiteId);
    try {
      await cambiarEstado(tramiteId, order[nuevoIdx]);
      toast.success('Estado actualizado');
      await cargar();
    } catch { toast.error('Error al actualizar'); }
    finally { setMoviendo(null); }
  }

  if (cargando) return <><Topbar titulo="Seguimiento de trámites"/><Spinner/></>;

  return (
    <>
      <Topbar titulo="Seguimiento de trámites">
        <Btn variante="outline" small onClick={cargar}>↻ Actualizar</Btn>
      </Topbar>
      <div style={{flex:1,overflowY:'auto',padding:24}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,minWidth:700}}>
          {COLUMNAS.map(col => {
            const tarjetas = kanban?.[col.key]||[];
            return (
              <div key={col.key} style={{background:'var(--cream2)',borderRadius:'var(--radius)',padding:12}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
                  <Badge tipo={col.tipo}>{col.label}</Badge>
                  <span style={{background:'var(--white)',color:'var(--text3)',fontSize:11,padding:'1px 7px',borderRadius:10}}>{tarjetas.length}</span>
                </div>
                {tarjetas.length===0 && <div style={{padding:'16px',textAlign:'center',color:'var(--text3)',fontSize:12,border:'2px dashed var(--border)',borderRadius:8}}>Sin trámites</div>}
                {tarjetas.map(t => {
                  const dias = diasRestantes(t.fecha_vencimiento);
                  const urgente = dias!==null && dias<=3;
                  const enMov = moviendo===t.id;
                  return (
                    <div key={t.id} style={{background:'var(--white)',borderRadius:8,padding:12,marginBottom:8,border:'1px solid var(--border)',borderLeft:urgente?`3px solid ${dias<=0?'#c0392b':'var(--gold)'}`:'1px solid var(--border)',opacity:enMov?0.6:1}}>
                      <div style={{fontSize:12,fontWeight:600,color:'var(--navy)',marginBottom:3}}>{t.servicio_nombre}</div>
                      <div style={{fontSize:11,color:'var(--text3)',marginBottom:8}}>{t.cliente_nombre}</div>
                      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:4}}>
                        {t.precio && <span style={{fontSize:11,color:'var(--text2)',fontWeight:500}}>${Number(t.precio).toFixed(2)}</span>}
                        {dias!==null && <span style={{fontSize:11,fontWeight:700,color:dias<=0?'#c0392b':dias<=7?'var(--warn)':'var(--text3)'}}>{diasLabel(dias)}</span>}
                      </div>
                      <div style={{display:'flex',gap:4,marginTop:8}}>
                        {col.key!=='iniciado' && <button onClick={()=>moverTramite(t.id,col.key,'prev')} disabled={enMov} style={{flex:1,padding:'4px',fontSize:11,border:'1px solid var(--border)',background:'var(--cream)',borderRadius:5,cursor:'pointer'}}>← Atrás</button>}
                        {col.key!=='completado' && <button onClick={()=>moverTramite(t.id,col.key,'next')} disabled={enMov} style={{flex:1,padding:'4px',fontSize:11,border:'1px solid var(--border)',background:'var(--navy)',color:'#fff',borderRadius:5,cursor:'pointer'}}>Avanzar →</button>}
                      </div>
                      {t.asesor_nombre && <div style={{fontSize:10,color:'var(--text3)',marginTop:6}}>{t.asesor_nombre}</div>}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
