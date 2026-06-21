export default function GlobalStyles() {
  return (
    <style>{`
      @keyframes gridScroll{0%{transform:translate(0,0)}100%{transform:translate(20px,20px)}}
      @keyframes glowPulse{0%,100%{opacity:.28}50%{opacity:.55}}
      @keyframes glowAlt{0%,100%{opacity:.12}50%{opacity:.32}}
      ::-webkit-scrollbar{width:4px;height:4px}
      ::-webkit-scrollbar-track{background:transparent}
      ::-webkit-scrollbar-thumb{background:rgba(124,109,250,.28);border-radius:4px}
      *{scrollbar-width:thin;scrollbar-color:rgba(124,109,250,.22) transparent}
      body{font-family:'Outfit',system-ui,sans-serif;margin:0}
      .mono{font-family:'JetBrains Mono',monospace}
      button{font-family:inherit}
      input,textarea{font-family:inherit}
    `}</style>
  );
}
