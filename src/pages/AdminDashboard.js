import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import API from '../api';
import Navbar from '../components/Navbar';
import ComplaintCard from '../components/ComplaintCard';

const COLORS = ['#f59e0b','#60a5fa','#34d399'];

export default function AdminDashboard() {
  const [complaints, setComplaints]     = useState([]);
  const [stats, setStats]               = useState({});
  const [feedbacks, setFeedbacks]       = useState([]);
  const [feedbackStats, setFeedbackStats] = useState({});
  const [filter, setFilter]             = useState('all');
  const [search, setSearch]             = useState('');
  const [priority, setPriority]         = useState('all');
  const [activeTab, setActiveTab]       = useState('complaints');

 const load = async () => {
  try {
    const [c, s, f, fs] = await Promise.all([
      API.get('/complaints'),
      API.get('/complaints/stats'),
      API.get('/feedback'),
      API.get('/feedback/stats'),
    ]);
    setComplaints([...c.data]);
    setStats({...s.data});
    setFeedbacks([...f.data]);
    setFeedbackStats({...fs.data});
  } catch (err) {
    console.log('Error loading:', err);
  }
};
    setComplaints(c.data);
    setStats(s.data);
    setFeedbacks(f.data);
    setFeedbackStats(fs.data);
  };

  useEffect(() => { load(); }, []);

  const visible = complaints
    .filter(c => filter === 'all'   || c.status === filter)
    .filter(c => priority === 'all' || c.priority === priority)
    .filter(c => c.title.toLowerCase().includes(search.toLowerCase()) ||
                 c.desc.toLowerCase().includes(search.toLowerCase()));

  const pieData = [
    { name:'Open',        value: stats.open     || 0 },
    { name:'In Progress', value: stats.progress || 0 },
    { name:'Resolved',    value: stats.resolved || 0 },
  ];

  const barData = [
    { name:'Open',        count: stats.open     || 0 },
    { name:'In Progress', count: stats.progress || 0 },
    { name:'Resolved',    count: stats.resolved || 0 },
    { name:'High Priority', count: stats.high   || 0 },
  ];

  const renderStars = (rating) => '★'.repeat(rating) + '☆'.repeat(5 - rating);

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>

        {/* Stats Cards */}
        <div style={styles.statsBar}>
          {[
            { label:'Total',        value: stats.total,    color:'#a5b4fc' },
            { label:'Open',         value: stats.open,     color:'#f59e0b' },
            { label:'In Progress',  value: stats.progress, color:'#60a5fa' },
            { label:'Resolved',     value: stats.resolved, color:'#34d399' },
            { label:'High Priority',value: stats.high,     color:'#f87171' },
          ].map(s => (
            <div key={s.label} style={styles.stat}>
              <div style={{...styles.statNum, color:s.color}}>{s.value || 0}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div style={styles.charts}>
          <div style={styles.chartBox}>
            <h3 style={styles.chartTitle}>Status Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={70} dataKey="value"
                  label={({name,value})=>`${name}: ${value}`}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]}/>)}
                </Pie>
                <Tooltip contentStyle={{background:'#181a25', border:'none', color:'#fff'}}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={styles.chartBox}>
            <h3 style={styles.chartTitle}>Complaints Overview</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData}>
                <XAxis dataKey="name" tick={{fill:'rgba(255,255,255,0.4)', fontSize:11}}/>
                <YAxis tick={{fill:'rgba(255,255,255,0.4)', fontSize:11}}/>
                <Tooltip contentStyle={{background:'#181a25', border:'none', color:'#fff'}}/>
                <Bar dataKey="count" fill="#6366f1" radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tab Switch */}
        <div style={styles.tabSwitch}>
          <button style={{...styles.switchBtn, ...(activeTab==='complaints' ? styles.switchActive:{})}}
            onClick={() => setActiveTab('complaints')}>
            📋 Complaints
          </button>
          <button style={{...styles.switchBtn, ...(activeTab==='feedback' ? styles.switchActive:{})}}
            onClick={() => setActiveTab('feedback')}>
            ⭐ Feedback {feedbacks.length > 0 && `(${feedbacks.length})`}
          </button>
        </div>

        {/* COMPLAINTS TAB */}
        {activeTab === 'complaints' && (
          <>
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
              <select style={styles.select} value={priority}
                onChange={e => setPriority(e.target.value)}>
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            {visible.length === 0
              ? <div style={styles.empty}>No complaints found.</div>
              : visible.map(c => (
                  <ComplaintCard key={c._id} complaint={c} isAdmin={true} onRefresh={load}/>
                ))
            }
          </>
        )}

        {/* FEEDBACK TAB */}
        {activeTab === 'feedback' && (
          <div>
            {/* Feedback Stats */}
            <div style={styles.feedbackStats}>
              <div style={styles.avgBox}>
                <div style={styles.avgNum}>{feedbackStats.avg || 0}</div>
                <div style={{color:'#f59e0b', fontSize:'24px'}}>
                  {'★'.repeat(Math.round(feedbackStats.avg || 0))}
                  {'☆'.repeat(5 - Math.round(feedbackStats.avg || 0))}
                </div>
                <div style={styles.avgLabel}>Average Rating</div>
                <div style={styles.avgTotal}>{feedbackStats.total || 0} reviews</div>
              </div>
              <div style={styles.ratingBars}>
                {[5,4,3,2,1].map(star => (
                  <div key={star} style={styles.ratingRow}>
                    <span style={styles.starLabel}>{star}★</span>
                    <div style={styles.barBg}>
                      <div style={{
                        ...styles.barFill,
                        width: feedbackStats.total
                          ? `${((feedbackStats[['','one','two','three','four','five'][star]] || 0) / feedbackStats.total) * 100}%`
                          : '0%'
                      }}/>
                    </div>
                    <span style={styles.starCount}>
                      {feedbackStats[['','one','two','three','four','five'][star]] || 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Feedback List */}
            {feedbacks.length === 0
              ? <div style={styles.empty}>No feedback yet.</div>
              : feedbacks.map(f => (
                  <div key={f._id} style={styles.feedbackCard}>
                    <div style={styles.feedbackTop}>
                      <div>
                        <div style={styles.feedbackUser}>👤 {f.givenBy?.username}</div>
                        <div style={styles.feedbackComplaint}>{f.complaint?.title}</div>
                      </div>
                      <div style={{textAlign:'right'}}>
                        <div style={{color:'#f59e0b', fontSize:'18px'}}>{renderStars(f.rating)}</div>
                        <div style={styles.feedbackDate}>{new Date(f.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    {f.comment && <p style={styles.feedbackComment}>"{f.comment}"</p>}
                  </div>
                ))
            }
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight:'100vh', background:'#0f1117' },
  content: { padding:'1.5rem' },
  statsBar: { display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'12px', marginBottom:'1.5rem' },
  stat: { background:'rgba(255,255,255,0.04)', border:'0.5px solid rgba(255,255,255,0.08)', borderRadius:'12px', padding:'1rem' },
  statNum: { fontSize:'26px', fontWeight:'700' },
  statLabel: { fontSize:'11px', color:'rgba(255,255,255,0.4)', marginTop:'2px' },
  charts: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'1.5rem' },
  chartBox: { background:'rgba(255,255,255,0.04)', border:'0.5px solid rgba(255,255,255,0.08)', borderRadius:'12px', padding:'1rem' },
  chartTitle: { fontSize:'13px', color:'rgba(255,255,255,0.6)', marginBottom:'0.5rem', fontWeight:'500' },
  tabSwitch: { display:'flex', gap:'8px', marginBottom:'1rem' },
  switchBtn: { padding:'8px 20px', borderRadius:'8px', border:'0.5px solid rgba(255,255,255,0.1)', background:'transparent', color:'rgba(255,255,255,0.4)', fontSize:'13px', cursor:'pointer' },
  switchActive: { background:'rgba(99,102,241,0.15)', borderColor:'rgba(99,102,241,0.4)', color:'#a5b4fc' },
  toolbar: { display:'flex', gap:'10px', marginBottom:'1rem', flexWrap:'wrap', alignItems:'center' },
  search: { flex:1, minWidth:'200px', padding:'8px 14px', background:'rgba(255,255,255,0.06)', border:'0.5px solid rgba(255,255,255,0.15)', borderRadius:'10px', color:'#fff', fontSize:'13px', outline:'none' },
  tabs: { display:'flex', gap:'6px' },
  tab: { fontSize:'12px', padding:'5px 12px', borderRadius:'20px', cursor:'pointer', border:'0.5px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.4)', background:'transparent' },
  activeTab: { background:'rgba(99,102,241,0.15)', borderColor:'rgba(99,102,241,0.4)', color:'#a5b4fc' },
  select: { padding:'6px 12px', background:'rgba(255,255,255,0.06)', border:'0.5px solid rgba(255,255,255,0.15)', borderRadius:'8px', color:'#fff', fontSize:'12px', outline:'none' },
  empty: { textAlign:'center', padding:'3rem', color:'rgba(255,255,255,0.2)', fontSize:'14px' },
  feedbackStats: { display:'grid', gridTemplateColumns:'200px 1fr', gap:'16px', background:'rgba(255,255,255,0.04)', border:'0.5px solid rgba(255,255,255,0.08)', borderRadius:'12px', padding:'1.2rem', marginBottom:'1rem' },
  avgBox: { textAlign:'center', borderRight:'0.5px solid rgba(255,255,255,0.08)', paddingRight:'16px' },
  avgNum: { fontSize:'48px', fontWeight:'700', color:'#f59e0b' },
  avgLabel: { fontSize:'12px', color:'rgba(255,255,255,0.4)', marginTop:'4px' },
  avgTotal: { fontSize:'11px', color:'rgba(255,255,255,0.25)' },
  ratingBars: { display:'flex', flexDirection:'column', justifyContent:'center', gap:'6px' },
  ratingRow: { display:'flex', alignItems:'center', gap:'8px' },
  starLabel: { fontSize:'12px', color:'#f59e0b', minWidth:'24px' },
  barBg: { flex:1, height:'8px', background:'rgba(255,255,255,0.06)', borderRadius:'4px', overflow:'hidden' },
  barFill: { height:'100%', background:'#f59e0b', borderRadius:'4px', transition:'width 0.3s' },
  starCount: { fontSize:'11px', color:'rgba(255,255,255,0.3)', minWidth:'16px' },
  feedbackCard: { background:'rgba(255,255,255,0.04)', border:'0.5px solid rgba(255,255,255,0.08)', borderRadius:'12px', padding:'1rem', marginBottom:'10px' },
  feedbackTop: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'8px' },
  feedbackUser: { fontSize:'13px', fontWeight:'500', color:'#e8eaf0', marginBottom:'4px' },
  feedbackComplaint: { fontSize:'11px', color:'rgba(255,255,255,0.35)' },
  feedbackDate: { fontSize:'11px', color:'rgba(255,255,255,0.25)', marginTop:'4px' },
  feedbackComment: { fontSize:'13px', color:'rgba(255,255,255,0.5)', fontStyle:'italic', borderLeft:'2px solid rgba(99,102,241,0.4)', paddingLeft:'10px' },
};
