import Icon from "./Icon";

// A radial "comfort wheel": colored segments fan around a plum "you are at center"
// hub. Every section is traced with a thin outline; the active section is lit with a
// deeper wash + bold plum outline. Active segments are tappable; "soon" segments are
// shown faded (coming soon).
// segments: [{ key, label, icon, color, state: "active"|"soon", progress }]
// activeKey: the key of the currently selected segment (or null).
export default function ComfortWheel({ segments, onSelect, activeKey }) {
  const S = 300;                 // logical viewBox size
  const cx = S / 2, cy = S / 2;
  const R = S / 2 - 4;           // outer radius
  const rHub = 58;               // center hub radius
  const n = segments.length;
  const seg = 360 / n;

  const toXY = (deg, rad) => {
    const a = ((deg - 90) * Math.PI) / 180; // -90 => 0deg points up
    return [cx + Math.cos(a) * rad, cy + Math.sin(a) * rad];
  };
  const wedge = (i) => {
    const a0 = i * seg - seg / 2, a1 = i * seg + seg / 2;
    const [x0, y0] = toXY(a0, R), [x1, y1] = toXY(a1, R);
    const large = seg > 180 ? 1 : 0;
    return `M ${cx} ${cy} L ${x0} ${y0} A ${R} ${R} 0 ${large} 1 ${x1} ${y1} Z`;
  };

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 340, margin: "0 auto", aspectRatio: "1 / 1" }}>
      <svg viewBox={`0 0 ${S} ${S}`} width="100%" height="100%" style={{ display: "block" }} aria-hidden="true">
        {/* Base sections, each traced with a thin plum outline */}
        {segments.map((s, i) => {
          const soon = s.state === "soon";
          return (
            <path key={s.key} d={wedge(i)} fill={s.color}
              fillOpacity={soon ? 0.4 : 1}
              stroke="var(--tethra-plum, #4B2E59)"
              strokeOpacity={soon ? 0.1 : 0.22}
              strokeWidth="1.25"
              strokeLinejoin="round" />
          );
        })}

        {/* Selected section drawn on top: deeper wash + bold traced outline */}
        {segments.map((s, i) =>
          s.key === activeKey && s.state !== "soon" ? (
            <g key={`active-${s.key}`}>
              <path d={wedge(i)} fill="var(--tethra-plum, #4B2E59)" fillOpacity="0.13" />
              <path d={wedge(i)} fill="none" stroke="var(--tethra-plum, #4B2E59)"
                strokeWidth="2.75" strokeLinejoin="round" />
            </g>
          ) : null
        )}

        <circle cx={cx} cy={cy} r={rHub + 4} fill="var(--cream, #F4EEE6)" />
        <circle cx={cx} cy={cy} r={rHub} fill="var(--tethra-plum, #4B2E59)" />
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="14" fontWeight="600" fill="#ffffff">You are</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize="14" fontWeight="600" fill="#ffffff">at center</text>
      </svg>

      {/* Tap targets: one button per segment, placed over its wedge */}
      {segments.map((s, i) => {
        const [bx, by] = toXY(i * seg, R * 0.66);
        const active = s.state !== "soon";
        const selected = active && s.key === activeKey;
        return (
          <button
            key={s.key}
            type="button"
            disabled={!active}
            aria-pressed={selected}
            onClick={() => active && onSelect(s)}
            aria-label={active ? `${s.label}, ${s.progress || "open"}` : `${s.label}, coming soon`}
            style={{
              position: "absolute",
              left: `${(bx / S) * 100}%`, top: `${(by / S) * 100}%`,
              transform: "translate(-50%, -50%)",
              width: 92, background: "none", border: "none", padding: 0,
              cursor: active ? "pointer" : "default",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 2, textAlign: "center",
            }}
          >
            <Icon name={s.icon} size={selected ? 33 : 30} bare
              style={active ? undefined : { opacity: 0.45, filter: "grayscale(1)" }} />
            <span style={{
              fontSize: 11, fontWeight: selected ? 700 : 600, lineHeight: 1.15,
              color: active ? "var(--tethra-plum, #4B2E59)" : "#a29ba6",
            }}>
              {s.label}
            </span>
            <span style={{
              fontSize: 8, letterSpacing: "0.04em",
              fontWeight: active ? (selected ? 700 : 400) : 700,
              color: active ? "var(--tethra-gray, #7D7B87)" : "#b79878",
            }}>
              {active ? (s.progress || "") : "COMING SOON"}
            </span>
          </button>
        );
      })}
    </div>
  );
}
