import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { COMFORT_CATEGORIES, opener, PHILOSOPHY_LINES, dailyPick } from "../data/content";
import Spectrum from "../components/Spectrum";
import { IconLock, IconHeart, IconEye } from "../components/Icons";
import ComfortWheel from "../components/ComfortWheel";
import IntimacyPanel from "../components/IntimacyPanel";

const keyOf = (cat, item) => `${cat}:${item}`;

// Pastel segment colors + icon per wheel slice.
const SEG_COLOR = {
  emotional: "#E5EBE0", social: "#EFE7F5", communication: "#FBE8EB",
  intimacy: "#F0E6F2", boundaries: "#EDE7F3", pace: "#E7EEF5",
};
const SEG_ICON = {
  emotional: "empathy", social: "shared-space", communication: "communication",
  intimacy: "intimacy", boundaries: "safety-resources", pace: "trust",
};

export default function ComfortMap() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [map, setMap] = useState({});
  const [activeCat, setActiveCat] = useState(null);
  const [openKey, setOpenKey] = useState(null);
  const [status, setStatus] = useState("");
  const [copied, setCopied] = useState(false);
  const loaded = useRef(false);
  const itemsRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, "comfortMaps", user.uid)).then((snap) => {
      if (snap.exists()) setMap(snap.data().items || {});
      loaded.current = true;
    });
  }, [user]);

  useEffect(() => {
    if (!loaded.current || !user) return;
    setStatus("Saving\u2026");
    const t = setTimeout(async () => {
      await setDoc(doc(db, "comfortMaps", user.uid), {
        userId: user.uid, items: map, updatedAt: serverTimestamp(),
      }, { merge: true });
      setStatus("All changes saved");
    }, 700);
    return () => clearTimeout(t);
  }, [map, user]);

  function update(k, patch) {
    setMap((m) => ({ ...m, [k]: { ...(m[k] || {}), ...patch } }));
  }

  const progressFor = (cat) => {
    const done = cat.items.filter((it) => map[keyOf(cat.key, it)]?.level).length;
    return `${done}/${cat.items.length}`;
  };

  // Build the six wheel segments: three real categories + intimacy (links out) + two coming soon.
  const segments = [
    ...COMFORT_CATEGORIES.map((c) => ({
      key: c.key, label: c.title.split(" ")[0], icon: SEG_ICON[c.key],
      color: SEG_COLOR[c.key], state: "active", progress: progressFor(c),
    })),
    { key: "intimacy", label: "Intimacy", icon: SEG_ICON.intimacy, color: SEG_COLOR.intimacy, state: "active", progress: "open" },
    { key: "boundaries", label: "Boundaries", icon: SEG_ICON.boundaries, color: SEG_COLOR.boundaries, state: "soon" },
    { key: "pace", label: "Trust pace", icon: SEG_ICON.pace, color: SEG_COLOR.pace, state: "soon" },
  ];

  function handleSelect(s) {
    if (s.to) { nav(s.to); return; }
    setActiveCat(s.key); setOpenKey(null); setCopied(false);
    setTimeout(() => itemsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  }

  const category = activeCat ? COMFORT_CATEGORIES.find((c) => c.key === activeCat) : null;

  return (
    <div className="screen">
      <div className="head">
        <h1 className="display">My Comfort Map</h1>
        <p className="small muted" style={{ marginTop: 6 }}>Explore what matters to you.</p>
        <p style={{ marginTop: 10, fontStyle: "italic", fontSize: 13, lineHeight: 1.5, color: "#8c7896" }}>
          Nothing here is permanent. Revisit and change your answers anytime &mdash; you might grow in
          some places, ease back in others. Both are okay.
        </p>
      </div>

      <ComfortWheel segments={segments} onSelect={handleSelect} activeKey={activeCat} />

      <p className="tiny faint center" style={{ marginTop: 12, marginBottom: 4 }}>
        Tap a lit segment to explore &middot; three ready now, three coming soon
      </p>

      <div ref={itemsRef} style={{ scrollMarginTop: 16 }}>
        {activeCat === "intimacy" ? (
          <>
            <div className="row-between" style={{ margin: "18px 0 10px" }}>
              <span className="eyebrow">Physical Intimacy Comfort</span>
              <span className="tiny faint">private by default</span>
            </div>
            <IntimacyPanel />
          </>
        ) : !category ? (
          <p className="small muted center" style={{ marginTop: 18 }}>
            Choose an area above to begin mapping where you are today.
          </p>
        ) : (
          <>
            <div className="row-between" style={{ margin: "18px 0 10px" }}>
              <span className="eyebrow">{category.title}</span>
              <span className="tiny faint">{progressFor(category)} mapped</span>
            </div>

            {category.items.map((item) => {
              const k = keyOf(category.key, item);
              const entry = map[k] || {};
              const open = openKey === k;
              const tip = opener(item, entry.level);
              return (
                <div className={"card" + (open ? " selected" : "")} key={k} style={{ marginBottom: 10 }}>
                  <button
                    className="row-between"
                    style={{ width: "100%", background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}
                    onClick={() => { setOpenKey(open ? null : k); setCopied(false); }}
                    aria-expanded={open}
                  >
                    <span className="small" style={{ fontWeight: 500 }}>{item}</span>
                    <span className="tiny faint">{entry.level ? "edit" : "set"}</span>
                  </button>

                  <Spectrum value={entry.level || ""} onChange={(level) => update(k, { level })} />

                  {open && (
                    <>
                      <div className="why">
                        <label><IconLock width={12} height={12} /> Private note (only you)</label>
                        <textarea rows={2} placeholder="This matters to me because…"
                          value={entry.privateNote || ""} onChange={(e) => update(k, { privateNote: e.target.value })} />
                        <label style={{ marginTop: 9 }}><IconHeart width={12} height={12} /> What helps me feel safe</label>
                        <textarea rows={2} placeholder="Ask first. No rush. Words before touch."
                          value={entry.whatHelps || ""} onChange={(e) => update(k, { whatHelps: e.target.value })} />
                        <div className="toggle-row">
                          <IconEye width={14} height={14} /> Share &ldquo;what helps me feel safe&rdquo; in a shared space
                          <button className="toggle" aria-pressed={!!entry.share} aria-label="Share this note"
                            onClick={() => update(k, { share: !entry.share })}>
                            <span className="knob" />
                          </button>
                        </div>
                      </div>

                      {tip && (
                        <div className="opener">
                          <div className="opener-head">
                            <span className="opener-label">Words to start this conversation</span>
                            <button className="copy" onClick={() => {
                              if (navigator.clipboard) navigator.clipboard.writeText(tip.line);
                              setCopied(true); setTimeout(() => setCopied(false), 1500);
                            }}>{copied ? "Copied" : "Copy"}</button>
                          </div>
                          <p>{tip.line}</p>
                          <p className="alt">{tip.alt}</p>
                          <p className="note">These lines change to match where you are on the spectrum.</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}

            <p className="tiny faint center" style={{ marginTop: 14 }}>{status}</p>
          </>
        )}
      </div>

      <p className="tiny faint center" style={{ marginTop: 22, fontStyle: "italic", lineHeight: 1.5 }}>
        {dailyPick(PHILOSOPHY_LINES)}
      </p>
    </div>
  );
}
