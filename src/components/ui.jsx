export function Badge({ tipo='gray', children }) {
  const estilos = {
    success:{background:'var(--success-bg)',color:'var(--success)'},
    warn:{background:'var(--warn-bg)',color:'var(--warn)'},
    danger:{background:'var(--danger-bg)',color:'var(--danger)'},
    info:{background:'var(--info-bg)',color:'var(--info)'},
    gray:{background:'var(--cream2)',color:'var(--text2)'},
  };
  return <span style={{display:'inline-flex',alignItems:'center',gap:4,fontSize:11,padding:'3px 9px',borderRadius:20,fontWeight:500,...estilos[tipo]}}>{children}</span>;
}

export const estadoBadge = {
  iniciado:{tipo:'info',label:'Iniciado'},
  en_proceso:{tipo:'warn',label:'En proceso'},
  revision:{tipo:'warn',label:'Revisión final'},
  completado:{tipo:'success',label:'Completado'},
  cancelado:{tipo:'gray',label:'Cancelado'},
};

export function Btn({ children, variante='primary', onClick, type='button', disabled=false, small=false, style={} }) {
  const base = {display:'inline-flex',alignItems:'center',gap:6,padding:small?'5px 12px':'8px 16px',borderRadius:7,fontSize:small?12:13,fontWeight:500,border:'none',cursor:disabled?'not-allowed':'pointer',opacity:disabled?0.6:1,transition:'all .15s',...style};
  const variantes = {
    primary:{background:'var(--navy)',color:'var(--white)'},
    gold:{background:'var(--gold)',color:'var(--navy)'},
    outline:{background:'transparent',border:'1px solid var(--border)',color:'var(--text2)'},
    danger:{background:'var(--danger-bg)',color:'var(--danger)',border:'1px solid #f0b0b0'},
  };
  return <button type={type} onClick={onClick} disabled={disabled} style={{...base,...variantes[variante]}}>{children}</button>;
}

export function Card({ children, style={}, padding='0' }) {
  return <div style={{background:'var(--white)',borderRadius:'var(--radius)',border:'1px solid var(--border)',boxShadow:'var(--shadow)',overflow:'hidden',padding,...style}}>{children}</div>;
}

export function CardHeader({ title, children }) {
  return <div style={{padding:'14px 18px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'space-between'}}><span style={{fontWeight:600,fontSize:14,color:'var(--navy)'}}>{title}</span><div style={{display:'flex',gap:8,alignItems:'center'}}>{children}</div></div>;
}

export function Tabla({ headers, children }) {
  return <table style={{width:'100%',borderCollapse:'collapse'}}><thead><tr>{headers.map((h,i)=><th key={i} style={{padding:'10px 16px',textAlign:'left',fontSize:11,color:'var(--text3)',textTransform:'uppercase',letterSpacing:'.06em',borderBottom:'1px solid var(--border)',background:'var(--cream)',fontWeight:500}}>{h}</th>)}</tr></thead><tbody>{children}</tbody></table>;
}

export function Tr({ children, onClick }) {
  return <tr onClick={onClick} style={{cursor:onClick?'pointer':'default'}} onMouseEnter={e=>{if(onClick)e.currentTarget.style.background='var(--cream)'}} onMouseLeave={e=>e.currentTarget.style.background=''}>{children}</tr>;
}

export function Td({ children, bold=false, muted=false, danger=false, style={} }) {
  return <td style={{padding:'11px 16px',fontSize:13,borderBottom:'1px solid var(--border)',color:danger?'var(--danger)':muted?'var(--text3)':'var(--text)',fontWeight:bold?600:400,verticalAlign:'middle',...style}}>{children}</td>;
}

export function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null;
  return <div onClick={e=>{if(e.target===e.currentTarget)onClose();}} style={{position:'fixed',inset:0,background:'rgba(15,31,61,0.45)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
    <div style={{background:'var(--white)',borderRadius:14,padding:24,width:'100%',maxWidth:560,boxShadow:'var(--shadow2)',maxHeight:'90vh',overflowY:'auto'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:18}}>
        <span style={{fontFamily:"'DM Serif Display',serif",fontSize:20,color:'var(--navy)'}}>{title}</span>
        <button onClick={onClose} style={{background:'none',border:'none',fontSize:22,cursor:'pointer',color:'var(--text3)',lineHeight:1}}>×</button>
      </div>
      {children}
      {footer && <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:18,paddingTop:14,borderTop:'1px solid var(--border)'}}>{footer}</div>}
    </div>
  </div>;
}

export function Campo({ label, children, full=false }) {
  return <div style={{display:'flex',flexDirection:'column',gap:5,gridColumn:full?'1/-1':undefined}}><label style={{fontSize:12,color:'var(--text2)',fontWeight:500}}>{label}</label>{children}</div>;
}

export const inputStyle = {padding:'8px 12px',border:'1px solid var(--border)',borderRadius:7,fontSize:13,fontFamily:'inherit',color:'var(--text)',background:'var(--white)',outline:'none',width:'100%'};

export function Topbar({ titulo, children }) {
  return <div style={{background:'var(--white)',borderBottom:'1px solid var(--border)',padding:'0 24px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}><span style={{fontFamily:"'DM Serif Display',serif",fontSize:18,color:'var(--navy)'}}>{titulo}</span><div style={{display:'flex',gap:10,alignItems:'center'}}>{children}</div></div>;
}

export function StatCard({ label, valor, sub, tag, tagTipo }) {
  return <div style={{background:'var(--white)',borderRadius:'var(--radius)',padding:'16px 18px',border:'1px solid var(--border)',boxShadow:'var(--shadow)'}}><div style={{fontSize:11,color:'var(--text3)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:6}}>{label}</div><div style={{fontSize:26,fontWeight:600,color:'var(--navy)',lineHeight:1}}>{valor}</div>{sub&&<div style={{fontSize:11,color:'var(--text3)',marginTop:5}}>{sub}</div>}{tag&&<Badge tipo={tagTipo||'gray'} style={{marginTop:6}}>{tag}</Badge>}</div>;
}

export function Spinner() {
  return <div style={{display:'flex',justifyContent:'center',padding:'40px',color:'var(--text3)',fontSize:13}}>Cargando...</div>;
}

export function Vacio({ mensaje='Sin datos' }) {
  return <div style={{padding:'40px',textAlign:'center',color:'var(--text3)',fontSize:13}}>{mensaje}</div>;
}
