'use client';

import { Project } from '@/types';

const T = {
  dark: {
    text: '#dde2f0',
    sub: '#5e6880',
  },
  light: {
    text: '#141928',
    sub: '#8892aa',
  },
} as const;

export default function RoadmapView({
  theme,
  project,
}: {
  theme: 'dark' | 'light';
  project: Project;
}) {
  const t = T[theme];
  const roadmap = project.roadmap;
  const milestones = roadmap?.milestones || [];

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: t.text, margin: 0 }}>
          {roadmap?.project_name || 'Roadmap'}
        </h1>
        <p className="mono" style={{ fontSize: 11, color: t.sub, margin: '3px 0 0' }}>
          {roadmap?.description}
        </p>
      </div>

      {milestones.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {milestones.map(milestone => (
            <div
              key={milestone.id}
              style={{
                padding: 16,
                borderRadius: 12,
                background: theme === 'dark' ? '#161c2e' : '#ffffff',
                border: `1px solid ${theme === 'dark' ? '#ffffff12' : '#00000010'}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: t.text, margin: 0 }}>
                  {milestone.title}
                </h3>
                <span
                  className="mono"
                  style={{
                    fontSize: 11,
                    padding: '2px 8px',
                    borderRadius: 20,
                    background: getStatusColor(milestone.status, theme),
                    color: '#fff',
                  }}
                >
                  {milestone.status}
                </span>
              </div>
              <p style={{ fontSize: 13, color: t.sub, margin: '0 0 12px' }}>
                {milestone.description}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      height: 6,
                      borderRadius: 3,
                      background: theme === 'dark' ? '#ffffff0a' : '#00000008',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${milestone.completion_percentage}%`,
                        background: 'linear-gradient(90deg, #7c6dfa, #00d4ff)',
                        borderRadius: 3,
                      }}
                    />
                  </div>
                </div>
                <span
                  className="mono"
                  style={{ fontSize: 11, color: t.sub, minWidth: 40 }}
                >
                  {milestone.completion_percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', color: t.sub, padding: 40 }}>
          No milestones defined yet
        </div>
      )}
    </div>
  );
}

function getStatusColor(status: string, theme: 'dark' | 'light'): string {
  const colors: Record<string, string> = {
    not_started: '#5e6880',
    in_progress: '#7c6dfa',
    completed: '#22c55e',
    blocked: '#ef4444',
  };
  return colors[status] || '#5e6880';
}
