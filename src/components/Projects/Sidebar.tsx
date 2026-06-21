'use client';

import { useState } from 'react';
import { Zap, ChevronLeft, ChevronRight, Sun, Moon, Settings } from 'lucide-react';

const T = {
  dark: {
    sidebar: '#090c18ee',
    sidebarBorder: '#ffffff0e',
    text: '#dde2f0',
    sub: '#5e6880',
    chip: '#ffffff0a',
    cardBorder: '#ffffff12',
    panelItem: '#1a2035',
    panelItemBorder: '#ffffff0f',
  },
  light: {
    sidebar: '#edf0f8f0',
    sidebarBorder: '#00000010',
    text: '#141928',
    sub: '#8892aa',
    chip: '#00000008',
    cardBorder: '#00000010',
    panelItem: '#e4e8f4',
    panelItemBorder: '#00000010',
  },
} as const;

export default function Sidebar({
  theme,
  setTheme,
}: {
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const t = T[theme];
  const w = collapsed ? 54 : 210;

  const iconBtn = {
    width: 28,
    height: 28,
    borderRadius: 8,
    flexShrink: 0,
    background: t.chip,
    border: `1px solid ${t.cardBorder}`,
    cursor: 'pointer',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    color: t.sub,
  };

  return (
    <aside
      className="hidden lg:flex"
      style={{
        width: w,
        flexShrink: 0,
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        zIndex: 10,
        overflow: 'hidden',
        background: t.sidebar,
        borderRight: `1px solid ${t.sidebarBorder}`,
        backdropFilter: 'blur(20px)',
        transition: 'width .22s ease',
      }}
    >
      {/* Logo row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '0 12px',
          height: 60,
          borderBottom: `1px solid ${t.sidebarBorder}`,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: 'linear-gradient(135deg,#7c6dfa,#00d4ff)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Zap size={13} color="#fff" />
        </div>
        {!collapsed && (
          <>
            <span
              style={{
                fontWeight: 700,
                color: t.text,
                fontSize: 14,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            >
              DevPilot
            </span>
          </>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            ...iconBtn,
            marginLeft: collapsed ? 'auto' : 4,
            flexShrink: 0,
            border: `1px solid ${t.cardBorder}`,
          }}
        >
          {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Bottom */}
      <div style={{ marginTop: 'auto', padding: collapsed ? '10px 8px' : 10, borderTop: `1px solid ${t.sidebarBorder}` }}>
        {collapsed ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title="Toggle theme"
              style={{ ...iconBtn, border: `1px solid ${t.cardBorder}` }}
            >
              {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', marginBottom: 4 }}>
            <span style={{ fontSize: 12, color: t.sub, flex: 1 }}>Theme</span>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '4px 10px',
                borderRadius: 20,
                background: t.panelItem,
                border: `1px solid ${t.panelItemBorder}`,
                color: t.text,
                cursor: 'pointer',
                fontSize: 12,
              }}
            >
              {theme === 'dark' ? <Sun size={12} /> : <Moon size={12} />}
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
