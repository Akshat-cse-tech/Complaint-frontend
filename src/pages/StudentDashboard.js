import { useState, useEffect } from 'react';
import API from '../api';
import Navbar from '../components/Navbar';
import ComplaintCard from '../components/ComplaintCard';
import NewComplaintModal from '../components/NewComplaintModal';

export default function StudentDashboard() {
  const [complaints, setComplaints]   = useState([]);
  const [myFeedbacks, setMyFeedbacks] = useState([]);
  const [filter, setFilter]           = useState('all');
  const [search, setSearch]           = useState('');
  const [showModal, setShowModal]     = useState(false);

  const load = async () => {
    const [c, f] = await Promise.all([
      API.get('/complaints'),
      API.get('/feedback/my')
    ]);
    setComplaints(c.data);
    setMyFeedbacks(f.data);
  };

  useEffect(() => { load(); }, []);

  const visible = complaints
    .filter(c => filter === 'all' || c.status === filter)
    .filter(c => c.title.toLowerCase().includes(search.toLowerCase()) ||
                 c.desc.toLowerCase().includes(search.toLowerCase()));

  const open     = complaints.filter(c => c.status === 'open').length;
  const progress = complaints.filter(c => c.status === 'in-progress').length;
  const resolved = complaints.filter(c => c.status === 'resolved').length;

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        <div style={styles.statsBar}>
          <div style={styles.stat}>
            <div style={{...styles.statNum, color:'#a5b4fc'}}>{complaints.length}</div>
            <div style={styles.statLabel}>My Complaints</div>
          </div>
          <div style={styles.stat}>
            <div style={{...styles.statNum, color:'#f59e0b'}}>{open}</div>
            <div style={styles.statLabel}>Open</div>
          </div>
          <div style={styles.stat}>
            <div style={{...styles.statNum, color:'#60a5fa'}}>{progress}</div>
            <div style={styles.statLabel}>In Progress</div>
          </div>
          <div style={styles.stat}>
            <div style={{...styles.statNum, color:'#34d399'}}>{resolved}</div>
            <div style={styles.statLabel}>Resolved</div>
          </div>
        </div>

        <div style={styles.toolbar}>
          <input style={styles.search} placeholder="🔍 Search complaints..."
            value={search} onChange={e => setSearch(e.target.value)}/>
          <div style={styles.tabs}>
            {['all','open','in-progress','resolved'].map(f => (
              <button key={f} style={{...styles.tab, ...(filter===f ? styles.activeTab:{})}}
                onClick={() => setFilter(f)}>
                {f==='in-progress' ? 'In Progress' : f.charAt(0).toUpperCase()+f.slice(1)}
              </button>
            ))}
          </div>
          <button style={styles.newBtn} onClick={() => setShowModal(true)}>+ New Complaint</button>
        </div>

        {visible.length === 0
          ? <div style={styles.empty}>No complaints found.</div>
          : visible.map(c => (
              <ComplaintCard
                key={c._id}
                complaint={c}
                isAdmin={false}
                onRefresh={load}
                myFeedbacks={myFeedbacks}
              />
            ))
        }
      </div>
      {showModal && <NewComplaintModal onClose={() => setShowModal(false)} onRefresh={load}/>}
    </div>
  );
}

const styles = {
  page: { minHeight:'100vh', background:'#0f1117' },
  content: { padding:'1.5rem' },
  statsBar: { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px', marginBottom:'1.5rem' },
  stat: { background:'rgba(255,255,255,0.04)', border:'0.5px solid rgba(255,255,255,0.08)', borderRadius:'12px', padding:'1rem' },
  statNum: { fontSize:'26px', fontWeight:'700' },
  statLabel: { fontSize:'11px', color:'rgba(255,255,255,0.4)', marginTop:'2px' },
  toolbar: { display:'flex', gap:'10px', marginBottom:'1rem', flexWrap:'wrap', alignItems:'center' },
  search: { flex:1, minWidth:'200px', padding:'8px 14px', background:'rgba(255,255,255,0.06)', border:'0.5px solid rgba(255,255,255,0.15)', borderRadius:'10px', color:'#fff', fontSize:'13px', outline:'none' },
  tabs: { display:'flex', gap:'6px' },
  tab: { fontSize:'12px', padding:'5px 12px', borderRadius:'20px', cursor:'pointer', border:'0.5px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.4)', background:'transparent' },
  activeTab: { background:'rgba(99,102,241,0.15)', borderColor:'rgba(99,102,241,0.4)', color:'#a5b4fc' },
  newBtn: { padding:'7px 16px', background:'#6366f1', border:'none', borderRadius:'8px', color:'#fff', fontSize:'13px', fontWeight:'500', cursor:'pointer' },
  empty: { textAlign:'center', padding:'3rem', color:'rgba(255,255,255,0.2)', fontSize:'14px' },
};