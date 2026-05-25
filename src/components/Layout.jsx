import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const navItems = [
  { to:'/',            label:'Dashboard',   icon:'▦', exact:true },
  { to:'/clientes',    label:'Clientes',    icon:'👥' },
  { to:'/seguimiento', label:'Seguimiento', icon:'📊' },
  { to:'/alertas',     label:'Alertas',     icon:'🔔', badge:true },
  { to:'/facturacion', label:'Facturación', icon:'💵' },
];

const navSupervisor = [
  { to:'/reportes', label:'Reportes', icon:'📈' },
  { to:'/usuarios', label:'Usuarios', icon:'⚙' },
];

export default function Layout({ alertasCount = 0 }) {
  const { usuario, cerrarSesion, esSupervisor } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    cerrarSesion();
    navigate('/login');
    toast.success('Sesión cerrada');
  }

  const initiales = usuario?.nombre?.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase() || '?';

  return (
    <div style={{display:'flex',height:'100vh',overflow:'hidden'}}>
      <aside style={{width:'var(--sidebar)',background:'var(--navy)',display:'flex',flexDirection:'column',flexShrink:0,overflowY:'auto'}}>
        <div style={{padding:'20px 18px 16px',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
          <div style={{fontFamily:"'DM Serif Display',serif",color:'#e6b84a',fontSize:15,lineHeight:1.3}}>Asesoría<br/>Mercantil</div>
          <div style={{color:'rgba(255,255,255,0.4)',fontSize:11,marginTop:4}}>La Unión, SV</div>
        </div>
        <div style={{padding:'8px 0',flex:1}}>
          <div style={{padding:'12px 14px 4px',color:'rgba(255,255,255,0.3)',fontSize:10,letterSpacing:'.08em',textTransform:'uppercase'}}>Principal</div>
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end={item.exact}
              style={({isActive})=>({display:'flex',alignItems:'center',gap:10,padding:'9px 14px',margin:'1px 6px',borderRadius:7,color:isActive?'var(--navy)':'rgba(255,255,255,0.65)',background:isActive?'var(--gold)':'transparent',fontWeight:isActive?600:400,fontSize:13,textDecoration:'none',transition:'all .15s',position:'relative'})}>
              <span style={{fontSize:14}}>{item.icon}</span>
              {item.label}
              {item.badge && alertasCount > 0 && (
                <span style={{marginLeft:'auto',background:'#c0392b',color:'#fff',fontSize:10,padding:'1px 6px',borderRadius:10}}>{alertasCount}</span>
              )}
            </NavLink>
          ))}
          {esSupervisor && (
            <>
              <div style={{padding:'12px 14px 4px',color:'rgba(255,255,255,0.3)',fontSize:10,letterSpacing:'.08em',textTransform:'uppercase',marginTop:4}}>Supervisión</div>
              {navSupervisor.map(item => (
                <NavLink key={item.to} to={item.to}
                  style={({isActive})=>({display:'flex',alignItems:'center',gap:10,padding:'9px 14px',margin:'1px 6px',borderRadius:7,color:isActive?'var(--navy)':'rgba(255,255,255,0.65)',background:isActive?'var(--gold)':'transparent',fontWeight:isActive?600:400,fontSize:13,textDecoration:'none',transition:'all .15s'})}>
                  <span style={{fontSize:14}}>{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </>
          )}
        </div>
        <div style={{padding:14,borderTop:'1px solid rgba(255,255,255,0.08)'}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
            <div style={{width:32,height:32,borderRadius:'50%',background:'var(--gold)',color:'var(--navy)',fontWeight:700,fontSize:12,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{initiales}</div>
            <div>
              <div style={{color:'var(--white)',fontSize:12,fontWeight:500}}>{usuario?.nombre}</div>
              <div style={{color:'rgba(255,255,255,0.4)',fontSize:11,textTransform:'capitalize'}}>{usuario?.rol}</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{width:'100%',padding:'7px',background:'rgba(255,255,255,0.08)',color:'rgba(255,255,255,0.6)',border:'none',borderRadius:7,fontSize:12,cursor:'pointer'}}>
            Cerrar sesión
          </button>
        </div>
      </aside>
      <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
        <Outlet />
      </div>
    </div>
  );
}
