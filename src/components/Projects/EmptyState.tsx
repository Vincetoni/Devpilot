'use client';

import { Plus, FolderOpen } from 'lucide-react';

const T = {
  dark: {
    text: '#dde2f0',
    sub: '#5e6880',
    card: '#161c2e',
    cardBorder: '#ffffff12',
  },
  light: {
    text: '#141928',
    sub: '#8892aa',
    card: '#ffffff',
    cardBorder: '#00000010',
  },
} as const;

export default function EmptyState({
  theme,
  onCreateProject,
}: {
  theme: 'dark' | 'light';
  onCreateProject: () => void;
}) {
  const t = T[theme];

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: 420 }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 16,
            background: t.card,
            border: `2px solid ${t.cardBorder}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}
        >
          <FolderOpen size={40} color={t.sub} opacity={0.5} />
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 700, color: t.text, margin: '0 0 8px' }}>
          No projects yet
        </h2>
        <p style={{ fontSize: 14, color: t.sub, margin: '0 0 24px', lineHeight: 1.6 }}>
          Create your first project to get started with managing roadmaps, tasks, and workflows.
        </p>

        <button
          onClick={onCreateProject}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 20px',
            borderRadius: 8,
            background: 'linear-gradient(135deg,#7c6dfa,#6356e8)',
            border: 'none',
            color: '#fff',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Plus size={16} />
          Create Project
        </button>
      </div>
    </div>
  );
}
