import { useState } from 'react';
import API from '../api';

export default function FeedbackModal({ complaint, onClose, onRefresh }) {
  const [rating, setRating]   = useState(0);
  const [hover, setHover]     = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const submit = async () => {
    if (!rating) { setError('Please select a rating'); return; }
    setLoading(true);
    try {
      await API.post('/feedback', {
        complaintId: complaint._id,
        rating,
        comment
      });
      onRefresh();
      onClose();
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to submit feedback');
    }
    setLoading(false);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>⭐ Rate Resolution</h2>
        <p style={styles.sub}>How satisfied are you with the resolution of your complaint?</p>

        <div style={styles.complaintBox}>
          <p style={styles.complaintLabel}>COMPLAINT</p>
          <p style={styles.complaintTitle}>{complaint.title}</p>
        </div>

        {/* Star Rating */}
        <div style={styles.starsRow}>
          {[1,2,3,4,5].map(star => (
            <span
              key={star}
              style={{
                ...styles.star,
                color: star <= (hover || rating) ? '#f59e0b' : 'rgba(255,255,255,0.2)'
              }}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            >★</span>
          ))}
        </div>
        <p style={styles.ratingLabel}>
          {rating === 1 && '😞 Very Unsatisfied'}
          {rating === 2 && '😕 Unsatisfied'}
          {rating === 3 && '😐 Neutral'}
          {rating === 4 && '😊 Satisfied'}
          {rating === 5 && '😄 Very Satisfied'}
          {!rating && 'Click to rate'}
        </p>

        {/* Comment */}
        <label style={styles.label}>COMMENT (OPTIONAL)</label>
        <textarea
          style={styles.textarea}
          placeholder="Share your experience..."
          value={comment}
          onChange={e => setComment(e.target.value)}
        />

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.actions}>
          <button style={styles.cancel} onClick={onClose}>Cancel</button>
          <button style={styles.submit} onClick={submit} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200 },
  modal: { background:'#181a25', border:'0.5px solid rgba(255,255,255,0.12)', borderRadius:'16px', padding:'1.5rem', width:'100%', maxWidth:'400px' },
  title: { fontSize:'18px', fontWeight:'700', color:'#fff', marginBottom:'4px' },
  sub: { fontSize:'13px', color:'rgba(255,255,255,0.4)', marginBottom:'1rem' },
  complaintBox: { background:'rgba(255,255,255,0.04)', border:'0.5px solid rgba(255,255,255,0.1)', borderRadius:'10px', padding:'12px', marginBottom:'1rem' },
  complaintLabel: { fontSize:'10px', color:'rgba(255,255,255,0.4)', letterSpacing:'0.06em', marginBottom:'4px' },
  complaintTitle: { fontSize:'14px', color:'#fff', fontWeight:'500' },
  starsRow: { display:'flex', gap:'8px', justifyContent:'center', marginBottom:'8px' },
  star: { fontSize:'36px', cursor:'pointer', transition:'color 0.15s, transform 0.1s', userSelect:'none' },
  ratingLabel: { textAlign:'center', fontSize:'13px', color:'rgba(255,255,255,0.5)', marginBottom:'1rem', height:'20px' },
  label: { fontSize:'11px', fontWeight:'500', color:'rgba(255,255,255,0.45)', letterSpacing:'0.06em', marginBottom:'5px', display:'block' },
  textarea: { width:'100%', padding:'9px 12px', background:'rgba(255,255,255,0.06)', border:'0.5px solid rgba(255,255,255,0.14)', borderRadius:'9px', color:'#fff', fontSize:'13px', outline:'none', resize:'vertical', minHeight:'80px', marginBottom:'1rem' },
  error: { background:'rgba(239,68,68,0.12)', border:'0.5px solid rgba(239,68,68,0.3)', borderRadius:'8px', padding:'8px 12px', fontSize:'13px', color:'#f87171', marginBottom:'1rem' },
  actions: { display:'flex', gap:'8px' },
  cancel: { padding:'10px 16px', background:'rgba(255,255,255,0.06)', border:'0.5px solid rgba(255,255,255,0.12)', borderRadius:'9px', color:'rgba(255,255,255,0.5)', fontSize:'14px', cursor:'pointer' },
  submit: { flex:1, padding:'10px', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', border:'none', borderRadius:'9px', color:'#fff', fontSize:'14px', fontWeight:'600', cursor:'pointer' },
};