'use client';

import { Search, Bell } from 'lucide-react';

const T = {
  dark: {
    topbarBg: '#080b12cc',
    topbarBorder: '#ffffff0e',
    text: '#dde2f0',
    sub: '#5e6880',
    inputBg: '#ffffff08',
    cardBorder: '#ffffff12',
  },
  light: {
    topbarBg: '#edf0f8cc',
    topbarBorder: '#00000010',
    text: '#141928',
    sub: '#8892aa',
    inputBg: '#00000008',
    cardBorder: '#00000010',
  },
} as const;

export default function TopBar({
  theme,
  isViewingProject,
}: {
  theme: 'dark' | 'light';
  isViewingProject: boolean;
}) {
  const t = T[theme];

  return (
    <header
      style={{
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        flexShrink: 0,
        zIndex: 10,
        background: t.topbarBg,
        borderBottom: `1px solid ${t.topbarBorder}`,
        backdropFilter: 'blur(20px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: t.sub }}>
          {isViewingProject ? 'Project Details' : 'Projects'}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            borderRadius: 8,
            background: t.inputBg,
            border: `1px solid ${t.cardBorder}`,
            color: t.sub,
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          <Search size={12} />
          <span className="hidden sm:inline">Search...</span>
          <span className="hidden sm:inline mono" style={{ fontSize: 10, padding: '1px 6px', borderRadius: 4, background: T[theme].inputBg }}>
            ⌘K
          </span>
        </button>
        <button
          style={{
            position: 'relative',
            padding: 8,
            borderRadius: 8,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: t.sub,
          }}
        >
          <Bell size={15} />
          <span
            style={{
              position: 'absolute',
              top: 6,
              right: 6,
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#7c6dfa',
            }}
          />
        </button>
      </div>
    </header>
  );
}
