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

export default function WorkflowView({
  theme,
  project,
}: {
  theme: 'dark' | 'light';
  project: Project;
}) {
  const t = T[theme];

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: t.text, margin: 0 }}>
          Workflow
        </h1>
        <p className="mono" style={{ fontSize: 11, color: t.sub, margin: '3px 0 0' }}>
          Project: {project.name}
        </p>
      </div>

      <div style={{ textAlign: 'center', color: t.sub, padding: 40 }}>
        <p>Workflow view for project: {project.name}</p>
        <p style={{ fontSize: 12, margin: '8px 0 0' }}>Workflow stages will be displayed here</p>
      </div>
    </div>
  );
}
