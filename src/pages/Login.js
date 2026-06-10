import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  useEffect(() => { localStorage.clear(); }, []);

  const handleLogin = async () => {
    console.log('Login clicked', username, password);
    if (!username || !password) { setError('Please fill in all fields'); return; }
    setError('');
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', { username, password });
      console.log('Login success', data);
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('username', data.username);
      if (data.role === 'admin') navigate('/admin');
      else navigate('/student');
    } catch (err) {
      console.log('Login error', err);
      setError(err.response?.data?.msg || 'Login failed');
      localStorage.clear();
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.orb1}/>
      <div style={styles.orb2}/>
      <div style={styles.grid}/>

      <div style={styles.card}>
        <div style={styles.accentLine}/>

        <div style={styles.logoWrap}>
          <div style={styles.logo}>⚖️</div>
        </div>

        <h1 style={styles.title}>ComplaintDesk</h1>
        <p style={styles.subtitle}>Smart Complaint Management Portal</p>

        <div style={styles.divider}>
          <div style={styles.dividerLine}/>
          <span style={styles.dividerText}>SECURE LOGIN</span>
          <div style={styles.dividerLine}/>
        </div>

        {error && (
          <div style={styles.errorBox}>
            ⚠️ {error}
          </div>
        )}

        <div style={styles.fieldWrap}>
          <label style={styles.label}>USERNAME</label>
          <div style={styles.inputWrap}>
            <span style={styles.inputIcon}>👤</span>
            <input
              style={styles.input}
              placeholder="Enter your username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>
        </div>

        <div style={styles.fieldWrap}>
          <label style={styles.label}>PASSWORD</label>
          <div style={styles.inputWrap}>
            <span style={styles.inputIcon}>🔒</span>
            <input
              style={styles.input}
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>
        </div>

        <button style={styles.btn} onClick={handleLogin} disabled={loading}>
          {loading ? '⏳ Signing in...' : 'Sign In →'}
        </button>

        <div style={styles.footer}>
          <span style={styles.dot}/> College Placement Portal
          <span style={styles.dot}/> Silver Oak University
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:wght@400;500&display=swap');
        @keyframes orb1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(30px,-30px)} }
        @keyframes orb2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-20px,20px)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes fadein { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(99,102,241,0.4)} 50%{box-shadow:0 0 0 12px rgba(99,102,241,0)} }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
    background:'#080b14', padding:'2rem', position:'relative', overflow:'hidden',
    fontFamily:"'DM Sans', sans-serif",
  },
  grid: {
    position:'fixed', inset:0,
    backgroundImage:'linear-gradient(rgba(99,102,241,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.06) 1px,transparent 1px)',
    backgroundSize:'50px 50px', pointerEvents:'none',
  },
  orb1: {
    position:'fixed', width:'500px', height:'500px', borderRadius:'50%',
    background:'radial-gradient(circle,rgba(99,102,241,0.2),transparent)',
    top:'-150px', left:'-150px', filter:'blur(60px)', pointerEvents:'none',
    animation:'orb1 8s ease-in-out infinite',
  },
  orb2: {
    position:'fixed', width:'400px', height:'400px', borderRadius:'50%',
    background:'radial-gradient(circle,rgba(139,92,246,0.15),transparent)',
    bottom:'-100px', right:'-100px', filter:'blur(60px)', pointerEvents:'none',
    animation:'orb2 10s ease-in-out infinite',
  },
  card: {
    position:'relative', zIndex:10,
    background:'rgba(13,17,30,0.9)',
    border:'1px solid rgba(99,102,241,0.25)',
    borderRadius:'24px', padding:'2.5rem 2.2rem',
    width:'100%', maxWidth:'420px',
    backdropFilter:'blur(20px)',
    boxShadow:'0 0 80px rgba(99,102,241,0.1), 0 30px 60px rgba(0,0,0,0.5)',
    animation:'fadein 0.6s ease both',
  },
  accentLine: {
    position:'absolute', top:0, left:'20%', width:'60%', height:'2px',
    background:'linear-gradient(90deg,transparent,#6366f1,#8b5cf6,transparent)',
    borderRadius:'2px',
  },
  logoWrap: {
    width:'64px', height:'64px', margin:'0 auto 1.2rem',
    background:'linear-gradient(135deg,#6366f1,#8b5cf6)',
    borderRadius:'18px', display:'flex', alignItems:'center', justifyContent:'center',
    fontSize:'28px', boxShadow:'0 8px 32px rgba(99,102,241,0.4)',
    animation:'pulse 2s ease-in-out infinite',
  },
  logo: { fontSize:'28px' },
  title: {
    fontFamily:"'Sora',sans-serif", fontSize:'26px', fontWeight:'700',
    textAlign:'center', margin:'0 0 6px',
    background:'linear-gradient(135deg,#fff 30%,#a5b4fc)',
    WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
    backgroundSize:'200% auto', animation:'shimmer 4s linear infinite',
  },
  subtitle: {
    fontSize:'13px', color:'rgba(255,255,255,0.4)',
    textAlign:'center', marginBottom:'1.5rem', letterSpacing:'0.03em',
  },
  divider: { display:'flex', alignItems:'center', gap:'10px', marginBottom:'1.5rem' },
  dividerLine: { flex:1, height:'1px', background:'rgba(255,255,255,0.08)' },
  dividerText: { fontSize:'10px', color:'rgba(255,255,255,0.25)', letterSpacing:'0.15em' },
  errorBox: {
    background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.25)',
    borderRadius:'10px', padding:'10px 14px', fontSize:'13px', color:'#fca5a5',
    marginBottom:'1.2rem',
  },
  fieldWrap: { marginBottom:'1rem' },
  label: {
    fontSize:'10px', fontWeight:'600', color:'rgba(255,255,255,0.35)',
    letterSpacing:'0.12em', marginBottom:'8px', display:'block',
  },
  inputWrap: {
    display:'flex', alignItems:'center',
    background:'rgba(255,255,255,0.05)',
    border:'1px solid rgba(255,255,255,0.1)',
    borderRadius:'12px', overflow:'hidden',
  },
  inputIcon: { padding:'0 12px', fontSize:'16px', borderRight:'1px solid rgba(255,255,255,0.08)' },
  input: {
    flex:1, padding:'12px 14px', background:'transparent',
    border:'none', color:'#fff', fontSize:'14px',
    fontFamily:"'DM Sans',sans-serif", outline:'none',
  },
  btn: {
    width:'100%', padding:'13px',
    background:'linear-gradient(135deg,#6366f1,#8b5cf6)',
    border:'none', borderRadius:'12px', color:'#fff',
    fontSize:'15px', fontWeight:'600', cursor:'pointer',
    marginTop:'0.8rem', fontFamily:"'Sora',sans-serif",
    boxShadow:'0 8px 24px rgba(99,102,241,0.35)',
    transition:'opacity 0.2s, transform 0.1s',
    letterSpacing:'0.03em',
  },
  footer: {
    display:'flex', alignItems:'center', justifyContent:'center',
    gap:'8px', marginTop:'1.5rem',
    fontSize:'11px', color:'rgba(255,255,255,0.2)', letterSpacing:'0.05em',
  },
  dot: {
    width:'3px', height:'3px', borderRadius:'50%',
    background:'rgba(99,102,241,0.6)', display:'inline-block',
  },
};