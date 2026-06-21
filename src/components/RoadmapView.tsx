import { useState } from 'react';
import { Roadmap, Milestones } from '@/types';
import { getStatusColor, getStatusLabel, calculateProgress } from '@/lib/mock-data';
import MilestoneDetail from './MilestoneDetail';

interface RoadmapViewProps {
  roadmap: Roadmap;
  onUpdateMilestone: (id: string, updates: Partial<Milestones>) => void;
}

export default function RoadmapView({ roadmap, onUpdateMilestone }: RoadmapViewProps) {
  const [selectedMilestone, setSelectedMilestone] = useState<Milestones | null>(null);
  const progress = calculateProgress(roadmap);

  return (
    <div style={{ padding: 40, maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 30 }}>
        <h1 style={{ margin: '0 0 8px', fontSize: 28 }}>{roadmap.project_name}</h1>
        <p style={{ color: '#6b7280', margin: '0 0 16px' }}>{roadmap.description}</p>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 500 }}>Progress</span>
              <span style={{ fontSize: 14, fontWeight: 700 }}>{progress}%</span>
            </div>
            <div style={{ height: 8, background: '#f3f4f6', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${progress}%`,
                background: progress === 100 ? '#22c55e' : '#3b82f6',
                borderRadius: 4,
                transition: 'width 0.5s ease'
              }} />
            </div>
          </div>
          <div style={{ fontSize: 14, color: '#6b7280' }}>
            {roadmap.estimated_weeks} weeks
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {roadmap.milestones.map((milestone, index) => {
          const isBlocked = milestone.status === 'blocked' || 
            milestone.depends_on.some(depId => {
              const dep = roadmap.milestones.find(m => m.id === depId);
              return dep?.status !== 'completed';
            });

          const effectiveStatus = isBlocked && milestone.status !== 'completed' 
            ? 'blocked' 
            : milestone.status;

          return (
            <div
              key={milestone.id}
              onClick={() => setSelectedMilestone(milestone)}
              style={{
                border: '1.5px solid #e5e7eb',
                borderRadius: 12,
                padding: 20,
                cursor: 'pointer',
                background: '#fff',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Status indicator line */}
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: 4,
                background: getStatusColor(effectiveStatus),
                borderRadius: '12px 0 0 12px'
              }} />

              <div style={{ marginLeft: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <span style={{ 
                      fontSize: 12, 
                      fontWeight: 600,
                      color: getStatusColor(effectiveStatus),
                      textTransform: 'uppercase',
                      letterSpacing: 0.5
                    }}>
                      {getStatusLabel(effectiveStatus)}
                    </span>
                    <h3 style={{ margin: '4px 0 0', fontSize: 18 }}>{milestone.title}</h3>
                  </div>
                  <span style={{ fontSize: 14, color: '#9ca3af', fontWeight: 500 }}>
                    {milestone.id}
                  </span>
                </div>

                <p style={{ margin: '8px 0 0', color: '#6b7280', fontSize: 14, lineHeight: 1.5 }}>
                  {milestone.description}
                </p>

                <div style={{ marginTop: 12, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 13, color: '#9ca3af' }}>
                    Week {milestone.week_start}–{milestone.week_end}
                  </span>
                  
                  {milestone.depends_on.length > 0 && (
                    <span style={{ fontSize: 12, color: '#ef4444', background: '#fef2f2', padding: '2px 8px', borderRadius: 4 }}>
                      Needs: {milestone.depends_on.join(', ')}
                    </span>
                  )}

                  <span style={{ fontSize: 12, color: '#6b7280' }}>
                    {milestone.signals.length} signals
                  </span>

                  {milestone.notes && (
                    <span style={{ fontSize: 12, color: '#3b82f6' }}>📝 Has notes</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selectedMilestone && (
        <MilestoneDetail
          milestone={selectedMilestone}
          onClose={() => setSelectedMilestone(null)}
          onUpdate={onUpdateMilestone}
        />
      )}
    </div>
  );
}