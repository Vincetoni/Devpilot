import { useState } from 'react';
import { Milestones } from '@/types';
import { getStatusColor, getStatusLabel } from '@/lib/mock-data';

interface MilestoneDetailProps {
  milestone: Milestones;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Milestones>) => void;
}

export default function MilestoneDetail({ milestone, onClose, onUpdate }: MilestoneDetailProps) {
  const [notes, setNotes] = useState(milestone.notes || '');
  const [status, setStatus] = useState(milestone.status);

  function handleStatusChange(newStatus: Milestones['status']) {
    setStatus(newStatus);
    onUpdate(milestone.id, { status: newStatus });
  }

  function handleSaveNotes() {
    onUpdate(milestone.id, { notes });
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: 20
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        maxWidth: 600,
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        padding: 32
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 20 }}>
          <div>
            <span style={{ 
              fontSize: 12, 
              fontWeight: 600,
              color: getStatusColor(status),
              textTransform: 'uppercase'
            }}>
              {getStatusLabel(status)}
            </span>
            <h2 style={{ margin: '4px 0 0', fontSize: 24 }}>{milestone.title}</h2>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 24,
              cursor: 'pointer',
              color: '#9ca3af'
            }}
          >
            ✕
          </button>
        </div>

        <p style={{ color: '#6b7280', lineHeight: 1.6, marginBottom: 24 }}>
          {milestone.description}
        </p>

        {/* Status Toggle */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 14, fontWeight: 500, display: 'block', marginBottom: 8 }}>Status</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['not_started', 'in_progress', 'completed'] as const).map(s => (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: '1.5px solid',
                  borderColor: status === s ? getStatusColor(s) : '#e5e7eb',
                  background: status === s ? `${getStatusColor(s)}15` : '#fff',
                  color: status === s ? getStatusColor(s) : '#6b7280',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                {getStatusLabel(s)}
              </button>
            ))}
          </div>
        </div>

        {/* Signals */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 14, fontWeight: 500, display: 'block', marginBottom: 12 }}>Completion Signals</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {milestone.signals.map((signal, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: 12,
                background: '#f9fafb',
                borderRadius: 8
              }}>
                <span style={{ fontSize: 18 }}>
                  {signal.type === 'file_exists' ? '📁' : signal.type === 'dependency' ? '📦' : '👤'}
                </span>
                <div>
                  <span style={{ fontSize: 12, color: '#9ca3af', textTransform: 'uppercase' }}>{signal.type}</span>
                  <p style={{ margin: '2px 0 0', fontSize: 14, fontFamily: 'monospace' }}>{signal.pattern}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Notes */}
        {milestone.ai_notes && milestone.ai_notes.length > 0 && (
          <div style={{ marginBottom: 24, padding: 16, background: '#eff6ff', borderRadius: 8 }}>
            <label style={{ fontSize: 14, fontWeight: 500, color: '#3b82f6', display: 'block', marginBottom: 8 }}>
              🤖 AI Suggestions
            </label>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {milestone.ai_notes.map((note, i) => (
                <li key={i} style={{ color: '#1e40af', fontSize: 14, marginBottom: 4 }}>{note}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Manual Notes */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 14, fontWeight: 500, display: 'block', marginBottom: 8 }}>Your Notes</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Add implementation details, links, reminders..."
            style={{
              width: '100%',
              minHeight: 100,
              padding: 12,
              border: '1.5px solid #e5e7eb',
              borderRadius: 8,
              fontSize: 14,
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
          />
          <button
            onClick={handleSaveNotes}
            style={{
              marginTop: 8,
              padding: '8px 16px',
              background: '#111',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontSize: 13,
              cursor: 'pointer'
            }}
          >
            Save Notes
          </button>
        </div>

        {/* Dependencies */}
        {milestone.depends_on.length > 0 && (
          <div>
            <label style={{ fontSize: 14, fontWeight: 500, display: 'block', marginBottom: 8 }}>Dependencies</label>
            <p style={{ color: '#6b7280', fontSize: 14 }}>
              This milestone requires: <strong>{milestone.depends_on.join(', ')}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}