const T = {
  dark: {
    canvasDot: 'rgba(124,109,250,0.18)',
  },
  light: {
    canvasDot: 'rgba(100,110,180,0.18)',
  },
} as const;

export default function ShellGrid({ theme }: { theme: 'dark' | 'light' }) {
  const t = T[theme];
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div
        style={{
          position: 'absolute',
          inset: '-40px',
          backgroundImage: `radial-gradient(circle,${t.canvasDot} 1px,transparent 1px)`,
          backgroundSize: '20px 20px',
          animation: 'gridScroll 12s linear infinite',
        }}
      />
      {theme === 'dark' && (
        <>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(ellipse 55% 45% at 18% 65%,rgba(124,109,250,.16) 0%,transparent 100%)',
              animation: 'glowPulse 7s ease-in-out infinite',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(ellipse 40% 35% at 78% 20%,rgba(0,212,255,.09) 0%,transparent 100%)',
              animation: 'glowAlt 9s ease-in-out infinite',
            }}
          />
        </>
      )}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            theme === 'dark'
              ? 'radial-gradient(ellipse 80% 80% at 50% 50%,transparent 30%,rgba(8,11,18,.82) 100%)'
              : 'radial-gradient(ellipse 80% 80% at 50% 50%,transparent 30%,rgba(237,240,248,.72) 100%)',
        }}
      />
    </div>
  );
}
