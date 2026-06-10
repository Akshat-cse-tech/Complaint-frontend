 import { useState } from 'react';
import API from '../api';

export default function NewComplaintModal({ onClose, onRefresh }) {
  const [form, setForm] = useState({ title:'', category:'Placement Process', desc:'', priority:'medium' });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.title || !form.desc) { alert('Fill in all fields'); return; }
    setLoading(true);
    await API.post('/complaints', form);
    setLoading(false);
    onRefresh();
    onClose();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>📝 New Complaint</h2>

        <label style={styles.label}>TITLE</label>
        <input style={styles.input} placeholder="Brief complaint title"
          value={form.title} onChange={e => setForm({...form, title:e.target.value})}/>

        <label style={styles.label}>CATEGORY</label>
        <select style={styles.input} value={form.category}
          onChange={e => setForm({...form, category:e.target.value})}>
          <option>Placement Process</option>
          <option>Faculty</option>
          <option>Infrastructure</option>
          <option>Exam / Grading</option>
          <option>Hostel</option>
          <option>Other</option>
        </select>

        <label style={styles.label}>PRIORITY</label>
        <select style={styles.input} value={form.priority}
          onChange={e => setForm({...form, priority:e.target.value})}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <label style={styles.label}>DESCRIPTION</label>
        <textarea style={{...styles.input, minHeight:'80px', resize:'vertical'}}
          placeholder="Describe the issue in detail..."
          value={form.desc} onChange={e => setForm({...form, desc:e.target.value})}/>

        <div style={styles.actions}>
          <button style={styles.cancel} onClick={onClose}>Cancel</button>
          <button style={styles.submit} onClick={submit} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200 },
  modal: { background:'#181a25', border:'0.5px solid rgba(255,255,255,0.12)', borderRadius:'16px', padding:'1.5rem', width:'100%', maxWidth:'400px' },
  title: { fontSize:'16px', fontWeight:'700', color:'#fff', marginBottom:'1.2rem' },
  label: { fontSize:'11px', fontWeight:'500', color:'rgba(255,255,255,0.45)', letterSpacing:'0.06em', marginBottom:'5px', display:'block', marginTop:'0.8rem' },
  input: { 
  width:'100%', 
  padding:'9px 12px', 
  background:'rgba(255,255,255,0.06)', 
  border:'0.5px solid rgba(255,255,255,0.14)', 
  borderRadius:'9px', 
  color:'#fff', 
  fontSize:'13px', 
  outline:'none',
  colorScheme: 'dark'
},
  actions: { display:'flex', gap:'8px', marginTop:'1.2rem' },
  cancel: { padding:'10px 16px', background:'rgba(255,255,255,0.06)', border:'0.5px solid rgba(255,255,255,0.12)', borderRadius:'9px', color:'rgba(255,255,255,0.5)', fontSize:'14px', cursor:'pointer' },
  submit: { flex:1, padding:'10px', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', border:'none', borderRadius:'9px', color:'#fff', fontSize:'14px', fontWeight:'600', cursor:'pointer' },
};
