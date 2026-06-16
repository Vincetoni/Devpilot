import { useState } from 'react';

export default function Home() {
  const [idea, setIdea] = useState('');
  const [stack, setStack] = useState('React, Node.js');
  const [weeks, setWeeks] = useState(8);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);

  async function generateRoadmap() {
    setLoading(true);
    try {
      const res = await fetch('/api/roadmaps/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, stack, weeks })
      });
      const data = await res.json();
      setRoadmap(data.data);
    } catch (e) {
      alert('Failed: ' + e.message);
    }
    setLoading(false);
  }

  return (
    <div style={{ padding: 40, maxWidth: 600, margin: '0 auto' }}>
      <h1>DevPilot</h1>
      <p>AI project manager for developers</p>
      
      <input 
        placeholder="Project idea (e.g. food delivery app)"
        value={idea}
        onChange={e => setIdea(e.target.value)}
        style={{ width: '100%', padding: 10, marginBottom: 10 }}
      />
      
      <input 
        placeholder="Tech stack"
        value={stack}
        onChange={e => setStack(e.target.value)}
        style={{ width: '100%', padding: 10, marginBottom: 10 }}
      />
      
      <input 
        type="number"
        value={weeks}
        onChange={e => setWeeks(Number(e.target.value))}
        style={{ width: '100%', padding: 10, marginBottom: 10 }}
      />
      
      <button 
        onClick={generateRoadmap}
        disabled={loading || !idea}
        style={{ padding: '10px 20px', fontSize: 16 }}
      >
        {loading ? 'Generating...' : 'Generate Roadmap'}
      </button>

      {roadmap && (
        <div style={{ marginTop: 30 }}>
          <h2>{roadmap.project_name}</h2>
          <p>{roadmap.description}</p>
          <p>{roadmap.estimated_weeks} weeks</p>
          
          {roadmap.milestones.map(m => (
            <div key={m.id} style={{ border: '1px solid #ccc', padding: 15, marginTop: 10 }}>
              <h3>{m.id} — {m.title}</h3>
              <p>{m.description}</p>
              <p>Week {m.week_start}–{m.week_end}</p>
              <p>Signals: {m.signals.length}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}