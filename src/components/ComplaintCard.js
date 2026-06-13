import { useState } from 'react';
import API from '../api';
import FeedbackModal from './FeedbackModal';

const priorityColors = {
  high:   { color:'#f87171', bg:'rgba(248,113,113,0.1)', border:'rgba(248,113,113,0.3)' },
  medium: { color:'#f59e0b', bg:'rgba(245,158,11,0.1)',  border:'rgba(245,158,11,0.3)'  },
  low:    { color:'#34d399', bg:'rgba(52,211,153,0.1)',  border:'rgba(52,211,153,0.3)'  },
};

const statusColors = {
  open:          { color:'#f59e0b', label:'⏳ Open' },
  'in-progress': { color:'#60a5fa', label:'🔄 In Progress' },
  resolved:      { color:'#34d399', label:'✓ Resolved' },
};

export default function ComplaintCard({ complaint, isAdmin, onRefresh, myFeedbacks }) {
  const [showFeedback, setShowFeedback] = useState(false);
  const { _id, title, desc, category, status, priority, createdBy, createdAt } = complaint;
  const p = priorityColors[priority] || priorityColors.medium;
  const s = statusColors[status]     || statusColors.open;

  const alreadyRated = myFeedbacks?.some(f => f.complaint?._id === _id || f.complaint === _id);

  const updateStatus = async (newStatus) => {
  try {
    await API.put(`/complaints/${_id}`, { status: newStatus });
    onRefresh();
  } catch (err) {
    console.log('Error updating status:', err);
  }
};
  const deleteComplaint = async () => {
    if (!window.confirm('Delete this complaint?')) return;
    await API.delete(`/complaints/${_id}`);
    onRefresh();
  };

  return (
    <>
      <div style={{...styles.card, borderLeft:`3px solid ${s.color}`}}>
        <div style={styles.top}>
          <div style={styles.titleRow}>
            <span style={styles.title}>{title}</span>
            <span style={{...styles.priority, color:p.color, background:p.bg, border:`0.5px solid ${p.border}`}}>
              {priority?.toUpperCase()}
            </span>
          </div>
          <p style={styles.desc}>{desc}</p>
          <div style={styles.meta}>
            <span style={{...styles.badge, color:s.color}}>{s.label}</span>
            <span style={styles.cat}>{category}</span>
            {isAdmin && <span style={styles.by}>by {createdBy?.username}</span>}
            <span style={styles.date}>{new Date(createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div style={styles.actions}>
          {/* Admin Actions */}
          {isAdmin && (
            <>
              {status === 'open' && (
                <button style={{...styles.btn, color:'#60a5fa', borderColor:'rgba(96,165,250,0.3)'}}
                  onClick={() => updateStatus('in-progress')}>
                  🔄 In Progress
                </button>
              )}
              {status === 'in-progress' && (
                <button style={{...styles.btn, color:'#34d399', borderColor:'rgba(52,211,153,0.3)'}}
                  onClick={() => updateStatus('resolved')}>
                  ✓ Resolve
                </button>
              )}
              <button style={{...styles.btn, color:'#f87171', borderColor:'rgba(248,113,113,0.2)'}}
                onClick={deleteComplaint}>
                🗑 Delete
              </button>
            </>
          )}

          {/* Student Feedback Button */}
          {!isAdmin && status === 'resolved' && (
            alreadyRated
              ? <span style={styles.rated}>✓ Feedback Submitted</span>
              : <button style={{...styles.btn, color:'#f59e0b', borderColor:'rgba(245,158,11,0.3)'}}
                  onClick={() => setShowFeedback(true)}>
                  ⭐ Give Feedback
                </button>
          )}
        </div>
      </div>

      {showFeedback && (
        <FeedbackModal
          complaint={complaint}
          onClose={() => setShowFeedback(false)}
          onRefresh={onRefresh}
        />
      )}
    </>
  );
}

const styles = {
  card: { background:'rgba(255,255,255,0.04)', border:'0.5px solid rgba(255,255,255,0.1)', borderRadius:'12px', padding:'1rem 1.1rem', marginBottom:'10px' },
  top: { flex:1 },
  titleRow: { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'6px' },
  title: { fontSize:'14px', fontWeight:'500', color:'#e8eaf0' },
  priority: { fontSize:'10px', fontWeight:'600', padding:'2px 8px', borderRadius:'20px', letterSpacing:'0.05em' },
  desc: { fontSize:'12px', color:'rgba(255,255,255,0.4)', lineHeight:'1.5', marginBottom:'8px' },
  meta: { display:'flex', alignItems:'center', gap:'8px', flexWrap:'wrap' },
  badge: { fontSize:'11px', fontWeight:'500', padding:'2px 9px', borderRadius:'20px', background:'rgba(255,255,255,0.05)' },
  cat: { fontSize:'11px', color:'#a5b4fc', background:'rgba(99,102,241,0.1)', borderRadius:'20px', padding:'2px 8px' },
  by: { fontSize:'11px', color:'rgba(255,255,255,0.25)' },
  date: { fontSize:'11px', color:'rgba(255,255,255,0.25)' },
  actions: { display:'flex', gap:'6px', marginTop:'10px', flexWrap:'wrap', alignItems:'center' },
  btn: { border:'0.5px solid rgba(255,255,255,0.12)', borderRadius:'7px', padding:'5px 10px', fontSize:'11.5px', cursor:'pointer', background:'transparent' },
  rated: { fontSize:'12px', color:'#34d399', background:'rgba(52,211,153,0.1)', padding:'4px 10px', borderRadius:'20px' },
};
