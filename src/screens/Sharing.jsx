import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { COMFORT_CATEGORIES, INTIMACY_CATEGORIES } from "../data/content";
import BackBar from "../components/BackBar";
import Icon from "../components/Icon";

// One place to manage what a partner can see. Writes the same per-item flags the
// item screens use (comfort item.share, intimacy item.visibility === "partner"),
// so it's just an easier surface over the existing sharing model. Private by
// default: nothing is shared until switched on here.
const keyOf = (cat, item) => `${cat}:${item}`;

function Toggle({ on, onClick, label }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={onClick}
      style={{ width: 36, height: 20, borderRadius: 10, border: "none", padding: 0, flex: "none",
        cursor: "pointer", background: on ? "#6E5480" : "#DED6E2", position: "relative", transition: "background .15s" }}>
      <span style={{ position: "absolute", top: 2, left: on ? 18 : 2, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left .15s" }} />
    </button>
  );
}

export default function Sharing() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [ready, setReady] = useState(false);
  const [comfort, setComfort] = useState({});
  const [intimacy, setIntimacy] = useState({});
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [c, i] = await Promise.all([
        getDoc(doc(db, "comfortMaps", user.uid)),
        getDoc(doc(db, "intimacyMaps", user.uid)),
      ]);
      setComfort(c.exists() ? (c.data().items || {}) : {});
      setIntimacy(i.exists() ? (i.data().items || {}) : {});
      setReady(true);
    })();
  }, [user]);

  function flash(m) { setStatus(m); setTimeout(() => setStatus(""), 1400); }

  async function toggleComfort(cat, item) {
    const k = keyOf(cat, item);
    const entry = comfort[k] || {};
    const next = !entry.share;
    setComfort((m) => ({ ...m, [k]: { ...entry, share: next } }));
    try {
      await setDoc(doc(db, "comfortMaps", user.uid), { items: { [k]: { share: next } }, updatedAt: serverTimestamp() }, { merge: true });
      flash("Saved");
    } catch { setComfort((m) => ({ ...m, [k]: { ...entry } })); flash("Couldn\u2019t save"); }
  }

  async function toggleIntimacy(cat, item) {
    const k = keyOf(cat, item);
    const entry = intimacy[k] || {};
    const nextVis = entry.visibility === "partner" ? "only-me" : "partner";
    setIntimacy((m) => ({ ...m, [k]: { ...entry, visibility: nextVis } }));
    try {
      await setDoc(doc(db, "intimacyMaps", user.uid), { items: { [k]: { visibility: nextVis } }, updatedAt: serverTimestamp() }, { merge: true });
      flash("Saved");
    } catch { setIntimacy((m) => ({ ...m, [k]: { ...entry } })); flash("Couldn\u2019t save"); }
  }

  const comfortSections = COMFORT_CATEGORIES.map((c) => ({
    key: c.key, title: c.title,
    items: c.items.filter((it) => comfort[keyOf(c.key, it)]?.level),
  })).filter((s) => s.items.length > 0);

  const intimacySections = INTIMACY_CATEGORIES.map((c) => ({
    key: c.key, title: c.title,
    items: c.items.filter((it) => intimacy[keyOf(c.key, it)]?.state),
  })).filter((s) => s.items.length > 0);

  const nothing = ready && comfortSections.length === 0 && intimacySections.length === 0;

  const rowStyle = (last) => ({
    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
    padding: "11px 0", borderBottom: last ? "none" : "0.5px solid #F0E8F1",
  });

  return (
    <div className="screen">
      <BackBar fallback="/app/shared" />
      <div className="head">
        <div className="rowico" style={{ marginBottom: 8 }}>
          <Icon name="privacy" size={34} />
          <span className="kicker">Your choice</span>
        </div>
        <h1 className="display">What you share</h1>
        <p className="small muted" style={{ marginTop: 6, lineHeight: 1.55 }}>
          Everything stays private until you switch it on. A partner only ever sees what&rsquo;s on here.
        </p>
      </div>

      {!ready ? null : nothing ? (
        <div className="card">
          <p className="small muted" style={{ marginTop: 0, lineHeight: 1.6 }}>
            You haven&rsquo;t mapped any comfort or intimacy items yet, so there&rsquo;s nothing to share.
            Map a few first and they&rsquo;ll appear here to switch on whenever you&rsquo;re ready.
          </p>
          <button className="btn btn-outline" style={{ marginTop: 12 }} onClick={() => nav("/app/comfort-map")}>
            Go to your Comfort Map
          </button>
        </div>
      ) : (
        <>
          {comfortSections.map((s) => (
            <div key={"c" + s.key}>
              <p className="eyebrow" style={{ margin: "16px 0 8px 2px" }}>{s.title}</p>
              <div className="card" style={{ padding: "2px 13px" }}>
                {s.items.map((item, idx) => {
                  const e = comfort[keyOf(s.key, item)] || {};
                  return (
                    <div key={item} style={rowStyle(idx === s.items.length - 1)}>
                      <span style={{ minWidth: 0 }}>
                        <span style={{ display: "block", fontSize: 13, color: "var(--plum-900, #4B2E59)" }}>{item}</span>
                        <span style={{ display: "block", fontSize: 11, color: "#9a8fa0" }}>{e.level || ""}</span>
                      </span>
                      <Toggle on={!!e.share} label={`Share ${item}`} onClick={() => toggleComfort(s.key, item)} />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {intimacySections.length > 0 && (
            <>
              <p className="tiny muted" style={{ margin: "18px 2px 0", lineHeight: 1.5 }}>
                Physical intimacy is the most sensitive &mdash; share item by item, only what you want a partner to know.
              </p>
              {intimacySections.map((s) => (
                <div key={"i" + s.key}>
                  <p className="eyebrow" style={{ margin: "14px 0 8px 2px" }}>{s.title}</p>
                  <div className="card" style={{ padding: "2px 13px" }}>
                    {s.items.map((item, idx) => {
                      const e = intimacy[keyOf(s.key, item)] || {};
                      return (
                        <div key={item} style={rowStyle(idx === s.items.length - 1)}>
                          <span style={{ minWidth: 0 }}>
                            <span style={{ display: "block", fontSize: 13, color: "var(--plum-900, #4B2E59)" }}>{item}</span>
                            <span style={{ display: "block", fontSize: 11, color: "#9a8fa0" }}>{e.state || ""}</span>
                          </span>
                          <Toggle on={e.visibility === "partner"} label={`Share ${item}`} onClick={() => toggleIntimacy(s.key, item)} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </>
          )}

          <button className="btn btn-text" style={{ marginTop: 20 }} onClick={() => nav("/app/snapshot")}>
            Preview my snapshot
          </button>
          <p className="tiny faint center" style={{ marginTop: 2, minHeight: 14 }}>{status}</p>
        </>
      )}
    </div>
  );
}
