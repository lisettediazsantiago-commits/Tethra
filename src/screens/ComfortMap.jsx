import { useEffect, useRef, useState } from "react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { COMFORT_CATEGORIES, opener } from "../data/content";
import Spectrum from "../components/Spectrum";
import { IconLock, IconHeart, IconEye } from "../components/Icons";

const keyOf = (cat, item) => `${cat}:${item}`;

export default function ComfortMap() {
  const { user } = useAuth();
  const [map, setMap] = useState({});
  const [activeCat, setActiveCat] = useState(COMFORT_CATEGORIES[1].key); // physical, matches mockup
  const [openKey, setOpenKey] = useState(null);
  const [status, setStatus] = useState("");
  const [copied, setCopied] = useState(false);
  const loaded = useRef(false);

  // Load once
  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, "comfortMaps", user.uid)).then((snap) => {
      if (snap.exists()) setMap(snap.data().items || {});
      loaded.current = true;
    });
  }, [user]);

  // Debounced autosave
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

  const category = COMFORT_CATEGORIES.find((c) => c.key === activeCat);
  const mappedCount = category.items.filter((it) => map[keyOf(activeCat, it)]?.level).length;

  return (
    <div className="screen">
      <div className="head">
        <h1 className="display">Comfort map</h1>
        <p className="small muted" style={{ marginTop: 6 }}>
          Mark where you are today. You can change anything, anytime.
        </p>
      </div>

      {/* Category tabs */}
      <div className="chips" style={{ marginBottom: 14 }}>
        {COMFORT_CATEGORIES.map((c) => (
          <button key={c.key} className="chip" aria-pressed={c.key === activeCat} onClick={() => { setActiveCat(c.key); setOpenKey(null); setCopied(false); }}>
            {c.title}
          </button>
        ))}
      </div>

      <div className="row-between" style={{ marginBottom: 10 }}>
        <span className="eyebrow">{category.title}</span>
        <span className="tiny faint">{mappedCount} of {category.items.length} mapped</span>
      </div>

      {category.items.map((item) => {
        const k = keyOf(activeCat, item);
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
                <textarea
                  rows={2}
                  placeholder="This matters to me because…"
                  value={entry.privateNote || ""}
                  onChange={(e) => update(k, { privateNote: e.target.value })}
                />
                <label style={{ marginTop: 9 }}><IconHeart width={12} height={12} /> What helps me feel safe</label>
                <textarea
                  rows={2}
                  placeholder="Ask first. No rush. Words before touch."
                  value={entry.whatHelps || ""}
                  onChange={(e) => update(k, { whatHelps: e.target.value })}
                />
                <div className="toggle-row">
                  <IconEye width={14} height={14} /> Share &ldquo;what helps me feel safe&rdquo; in a shared space
                  <button
                    className="toggle"
                    aria-pressed={!!entry.share}
                    aria-label="Share this note"
                    onClick={() => update(k, { share: !entry.share })}
                  >
                    <span className="knob" />
                  </button>
                </div>
              </div>

              {tip && (
                <div className="opener">
                  <div className="opener-head">
                    <span className="opener-label">Words to start this conversation</span>
                    <button
                      className="copy"
                      onClick={() => {
                        if (navigator.clipboard) navigator.clipboard.writeText(tip.line);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1500);
                      }}
                    >
                      {copied ? "Copied" : "Copy"}
                    </button>
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
    </div>
  );
}
