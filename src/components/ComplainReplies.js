import { useState, useEffect } from 'react';
import { getReplies, postReply } from '../api';

export default function ComplaintReplies({ complaintId }) {
  const [replies, setReplies] = useState([]);
  const [text, setText]       = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getReplies(complaintId).then(res => setReplies(res.data)).catch(() => {});
  }, [complaintId]);

  const handleSend = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await postReply(complaintId, text);
      setReplies(prev => [...prev, res.data]);
      setText('');
    } catch (e) {}
    setLoading(false);
  };

  return (
    <div style={styles.wrap}>
      <p style={styles.sectionLabel}>REPLIES</p>

      <div style={styles.list}>
        {replies.length === 0 && (
          <p style={styles.empty}>No replies yet.</p>
        )}
        {replies.map((r, i) => (
          <div key={r._id || i} style={{
            ...styles.bubble,
            background: r.isAdmin ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.04)',
            borderColor: r.isAdmin ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.08)',
          }}>
            <div style={styles.meta}>
              <span style={{ ...styles.name, color: r.isAdmin ? '#a5b4fc' : '#e8eaf0' }}>
                {r.isAdmin ? '🛡 Admin' : `👤 ${r.senderName || 'You'}`}
              </span>
              <span style={styles.time}>
                {new Date(r.createdAt).toLocaleString()}
              </span>
            </div>
            <p style={styles.msg}>{r.message}</p>
          </div>
        ))}
      </div>

      <div style={styles.inputRow}>
        <textarea
          style={styles.textarea}
          rows={2}
          placeholder="Write a reply..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <button
          style={{ ...styles.sendBtn, opacity: !text.trim() || loading ? 0.4 : 1 }}
          onClick={handleSend}
          disabled={!text.trim() || loading}
        >
          {loading ? '...' : '➤ Send'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrap:         { marginTop: '12px', borderTop: '0.5px solid rgba(255,255,255,0.08)', paddingTop: '12px' },
  sectionLabel: { fontSize: '10px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em', marginBottom: '8px' },
  list:         { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' },
  empty:        { fontSize: '12px', color: 'rgba(255,255,255,0.2)', textAlign: 'center', padding: '8px 0' },
  bubble:       { border: '0.5px solid', borderRadius: '8px', padding: '8px 10px' },
  meta:         { display: 'flex', justifyContent: 'space-between', marginBottom: '4px' },
  name:         { fontSize: '11px', fontWeight: '500' },
  time:         { fontSize: '10px', color: 'rgba(255,255,255,0.25)' },
  msg:          { fontSize: '12px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.5', margin: 0 },
  inputRow:     { display: 'flex', gap: '6px', alignItems: 'flex-end' },
  textarea:     { flex: 1, padding: '8px 10px', background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#fff', fontSize: '12px', outline: 'none', resize: 'none' },
  sendBtn:      { padding: '8px 14px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' },
};