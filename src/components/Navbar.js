import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const role     = localStorage.getItem('role');

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div style={styles.bar}>
      <div style={styles.brand}>
        <div style={styles.dot}></div>
        ComplaintDesk
      </div>
      <div style={styles.right}>
        <div style={styles.badge}>
          👤 <strong>{username}</strong>
          <span style={{
            marginLeft:'6px',
            padding:'2px 8px',
            borderRadius:'20px',
            fontSize:'10px',
            fontWeight:'600',
            letterSpacing:'0.05em',
            background: role === 'admin' ? 'rgba(245,158,11,0.15)' : 'rgba(52,211,153,0.15)',
            color: role === 'admin' ? '#f59e0b' : '#34d399',
            border: role === 'admin' ? '0.5px solid rgba(245,158,11,0.3)' : '0.5px solid rgba(52,211,153,0.3)',
          }}>
            {role?.toUpperCase()}
          </span>
        </div>
        <button style={styles.logout} onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

const styles = {
  bar: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1rem 1.5rem', borderBottom:'0.5px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.02)', position:'sticky', top:0, zIndex:100 },
  brand: { fontFamily:'sans-serif', fontSize:'16px', fontWeight:'700', color:'#fff', display:'flex', alignItems:'center', gap:'8px' },
  dot: { width:'8px', height:'8px', borderRadius:'50%', background:'#6366f1', boxShadow:'0 0 8px #6366f1' },
  right: { display:'flex', alignItems:'center', gap:'10px' },
  badge: { background:'rgba(99,102,241,0.15)', border:'0.5px solid rgba(99,102,241,0.3)', borderRadius:'20px', padding:'6px 14px', fontSize:'13px', color:'#a5b4fc', display:'flex', alignItems:'center', gap:'4px' },
  logout: { background:'rgba(255,255,255,0.06)', border:'0.5px solid rgba(255,255,255,0.12)', borderRadius:'8px', padding:'5px 12px', color:'rgba(255,255,255,0.5)', fontSize:'12px', cursor:'pointer', fontFamily:'sans-serif' },
};