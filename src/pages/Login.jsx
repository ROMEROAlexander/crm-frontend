import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setCargando(true);
    try {
      await iniciarSesion(email, password);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--navy)',padding:'20px'}}>
      <div style={{background:'var(--white)',borderRadius:16,padding:'40px 36px',width:'100%',maxWidth:400,boxShadow:'0 8px 40px rgba(0,0,0,0.25)'}}>
        <div style={{textAlign:'center',marginBottom:32}}>
          <div style={{fontFamily:"'DM Serif Display',serif",fontSize:24,color:'var(--navy)',lineHeight:1.2}}>Asesoría Mercantil</div>
          <div style={{color:'var(--text3)',fontSize:13,marginTop:6}}>La Unión, El Salvador</div>
          <div style={{width:40,height:3,background:'var(--gold)',margin:'16px auto 0',borderRadius:2}}/>
        </div>
        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:14}}>
          <div style={{display:'flex',flexDirection:'column',gap:5}}>
            <label style={{fontSize:12,color:'var(--text2)',fontWeight:500}}>Correo electrónico</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="correo@asesoria.com" required
              style={{padding:'10px 14px',border:'1px solid var(--border)',borderRadius:8,fontSize:14,outline:'none'}}/>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:5}}>
            <label style={{fontSize:12,color:'var(--text2)',fontWeight:500}}>Contraseña</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required
              style={{padding:'10px 14px',border:'1px solid var(--border)',borderRadius:8,fontSize:14,outline:'none'}}/>
          </div>
          <button type="submit" disabled={cargando}
            style={{marginTop:8,padding:'12px',background:'var(--navy)',color:'var(--white)',border:'none',borderRadius:8,fontSize:14,fontWeight:600,cursor:cargando?'not-allowed':'pointer',opacity:cargando?0.7:1}}>
            {cargando ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>
        <div style={{marginTop:20,padding:'10px 14px',background:'var(--cream)',borderRadius:8,fontSize:12,color:'var(--text3)',textAlign:'center'}}>
          Acceso restringido al personal autorizado
        </div>
      </div>
    </div>
  );
}
