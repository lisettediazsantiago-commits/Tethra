// Reusable identity mark. Renders a chosen personal symbol, or falls back to a
// clean initials monogram. Used anywhere a person appears — Identity settings,
// Settings, and the shared-space header. Illustrated avatars and photos are
// intentionally future rungs (Initials -> Symbol -> Avatar -> Photo).

const STROKE = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };

export const SYMBOL_KEYS = ["leaf", "sunrise", "moon", "wave", "mountain", "tree", "lotus", "star", "compass", "hummingbird"];
export const SYMBOL_LABEL = {
  leaf: "Leaf", sunrise: "Sunrise", moon: "Moon", wave: "Wave", mountain: "Mountain",
  tree: "Tree", lotus: "Lotus", star: "Star", compass: "Compass", hummingbird: "Hummingbird",
};

export function SymbolGlyph({ name, size = 22 }) {
  const p = { width: size, height: size, viewBox: "0 0 24 24", ...STROKE };
  switch (name) {
    case "leaf": return <svg {...p}><path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14z" /><path d="M5 19c3-5 7-8 11-9" /></svg>;
    case "sunrise": return <svg {...p}><path d="M3 18.5h18" /><path d="M7.5 18.5a4.5 4.5 0 019 0" /><path d="M12 6.5V4M5.8 8.6L4.4 7.2M18.2 8.6l1.4-1.4" /></svg>;
    case "moon": return <svg {...p}><path d="M18 14.6A7 7 0 119.4 5.1 5.6 5.6 0 0018 14.6z" /></svg>;
    case "wave": return <svg {...p}><path d="M3 10.5c2-3 4-3 6 0s4 3 6 0 4-3 6 0" /><path d="M3 15.5c2-3 4-3 6 0s4 3 6 0 4-3 6 0" /></svg>;
    case "mountain": return <svg {...p}><path d="M3 19l5.5-9 3.5 5.2 2.4-3.9L21 19z" /><path d="M7 13.4l1.6 1.6" /></svg>;
    case "tree": return <svg {...p}><path d="M12 21v-5" /><path d="M8.5 16.2a4 4 0 01-1.3-7.9 5 5 0 019.6 0 4 4 0 01-1.3 7.9z" /></svg>;
    case "lotus": return <svg {...p}><path d="M12 19.6c-4 0-7-2.6-7-5.9 2 0 3.9.9 5 2.7C10 12.9 10.7 9.9 12 8c1.3 1.9 2 4.9 2 8.4 1.1-1.8 3-2.7 5-2.7 0 3.3-3 5.9-7 5.9z" /></svg>;
    case "star": return <svg {...p}><path d="M12 3.8l2.35 4.76 5.25.76-3.8 3.7.9 5.24L12 15.75l-4.7 2.47.9-5.24-3.8-3.7 5.25-.76z" /></svg>;
    case "compass": return <svg {...p}><circle cx="12" cy="12" r="8" /><path d="M12 7.2l1.6 4.4 4.4 1.6-4.4 1.6L12 19l-1.6-4.2L6 13.2l4.4-1.6z" /></svg>;
    case "hummingbird": return <svg {...p}><path d="M5 15.4c3.6.5 5.7-1.3 6.7-3.4" /><path d="M11.7 12c1.2-2.1 3.9-2.9 6.1-1.7 1.9 1 2.1 3.3.6 4.6-1-1.7-2.9-2.5-4.7-2.5" /><path d="M11.7 12L8.4 7.8M15.6 14.8l3.1 3.2" /></svg>;
    default: return null;
  }
}

function initialsFrom(name, identity) {
  if (identity?.initials) return identity.initials.toUpperCase().slice(0, 3);
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "\u2014";
  const s = parts.length === 1 ? parts[0].slice(0, 2) : parts[0][0] + parts[parts.length - 1][0];
  return s.toUpperCase();
}

// identity: { type: "symbol"|"initials", symbol?, initials? }. When type isn't a
// valid symbol (or identity is null/private), we render initials from `name`.
export default function IdentityAvatar({ identity, name, size = 44 }) {
  const isSymbol = identity?.type === "symbol" && identity.symbol && SYMBOL_KEYS.includes(identity.symbol);
  const base = {
    width: size, height: size, borderRadius: "50%", flex: "none",
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    background: "#EFE7F5", color: "#7B5E96",
  };
  if (isSymbol) {
    return <span style={base} aria-hidden="true"><SymbolGlyph name={identity.symbol} size={Math.round(size * 0.5)} /></span>;
  }
  return (
    <span style={{ ...base, fontWeight: 600, fontSize: Math.round(size * 0.34), letterSpacing: 0.5 }} aria-hidden="true">
      {initialsFrom(name, identity)}
    </span>
  );
}
