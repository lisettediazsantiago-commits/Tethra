import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { COMFORT_CATEGORIES, INTIMACY_CATEGORIES, blueprintNarrative } from "../data/content";
import Icon from "../components/Icon";
import BackBar from "../components/BackBar";

// My Snapshot (v1.1 §5): a read-only preview of exactly what a partner would see.
// It never exposes anything new — it faithfully mirrors the sharing controls the
// user already set (comfort items with share=true, intimacy items with
// visibility="partner") plus the shareable Blueprint narrative.
const catTitle = (cats, key) => (cats.find((c) => c.key === key)?.title || "");
const splitKey = (k) => { const i = k.indexOf(":"); return [k.slice(0, i), k.slice(i + 1)]; };

export default function Snapshot() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [ready, setReady] = useState(false);
  const [comfort, setComfort] = useState([]);
  const [intimacy, setIntimacy] = useState([]);
  const [narrative, setNarrative] = useState(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [cSnap, iSnap, bSnap] = await Promise.all([
        getDoc(doc(db, "comfortMaps", user.uid)),
        getDoc(doc(db, "intimacyMaps", user.uid)),
        getDoc(doc(db, "blueprints", user.uid)),
      ]);

      const cItems = cSnap.exists() ? (cSnap.data().items || {}) : {};
      setComfort(Object.entries(cItems)
        .filter(([, e]) => e && e.share)
        .map(([k, e]) => { const [cat, item] = splitKey(k); return { cat, item, level: e.level || "", whatHelps: e.whatHelps || "" }; }));

      const iItems = iSnap.exists() ? (iSnap.data().items || {}) : {};
      setIntimacy(Object.entries(iItems)
        .filter(([, e]) => e && e.visibility === "partner")
        .map(([k, e]) => { const [cat, item] = splitKey(k); return { cat, item, state: e.state || "" }; }));

      const answers = bSnap.exists() ? (bSnap.data().answers || {}) : {};
      setNarrative(blueprintNarrative(answers));
      setReady(true);
    })();
  }, [user]);

  const nothingShared = ready && comfort.length === 0 && intimacy.length === 0 && !narrative;

  return (
    <div className="screen">
      <BackBar fallback="/app/shared" />
      <div className="head">
        <div className="rowico" style={{ marginBottom: 8 }}>
          <Icon name="privacy" size={34} />
          <span className="kicker">Preview</span>
        </div>
        <h1 className="display">My snapshot</h1>
        <p className="small muted" style={{ marginTop: 6, lineHeight: 1.55 }}>
          Exactly what a partner would see &mdash; nothing more. Your private notes, your unshared
          items, and your journal are never visible here.
        </p>
      </div>

      {!ready ? null : nothingShared ? (
        <div className="card">
          <p className="small" style={{ marginTop: 0, lineHeight: 1.6 }}>
            You haven&rsquo;t chosen to share anything yet, so a partner would see an empty snapshot.
            That&rsquo;s completely okay &mdash; you decide what to reveal, item by item, whenever you&rsquo;re ready.
          </p>
          <button className="btn btn-outline" style={{ marginTop: 12 }} onClick={() => nav("/app/comfort-map")}>
            Go to your Comfort Map
          </button>
        </div>
      ) : (
        <>
          {narrative && (
            <div className="card" style={{ marginBottom: 14, padding: "18px 16px" }}>
              <p className="eyebrow" style={{ marginTop: 0 }}>How you enter connection</p>
              {narrative.lines.map((line, i) => (
                <p key={i} style={{ fontSize: 14, lineHeight: 1.6, color: "var(--ink)", margin: i ? "10px 0 0" : "8px 0 0" }}>{line}</p>
              ))}
            </div>
          )}

          {comfort.length > 0 && (
            <>
              <p className="eyebrow" style={{ marginBottom: 8 }}>Comfort you&rsquo;ve shared</p>
              {comfort.map((r, i) => (
                <div className="card" key={"c" + i} style={{ marginBottom: 10 }}>
                  <div className="row-between">
                    <span className="small" style={{ fontWeight: 500 }}>{r.item}</span>
                    <span className="tiny faint">{catTitle(COMFORT_CATEGORIES, r.cat)}</span>
                  </div>
                  {r.level && <p className="tiny" style={{ color: "var(--plum-700)", marginTop: 5 }}>{r.level}</p>}
                  {r.whatHelps && <p className="tiny muted" style={{ marginTop: 5, lineHeight: 1.55 }}>What helps me feel safe: {r.whatHelps}</p>}
                </div>
              ))}
            </>
          )}

          {intimacy.length > 0 && (
            <>
              <p className="eyebrow" style={{ margin: "16px 0 8px" }}>Physical intimacy you&rsquo;ve shared</p>
              {intimacy.map((r, i) => (
                <div className="card" key={"i" + i} style={{ marginBottom: 10 }}>
                  <div className="row-between">
                    <span className="small" style={{ fontWeight: 500 }}>{r.item}</span>
                    <span className="tiny faint">{catTitle(INTIMACY_CATEGORIES, r.cat)}</span>
                  </div>
                  {r.state && <p className="tiny" style={{ color: "var(--plum-700)", marginTop: 5 }}>{r.state}</p>}
                </div>
              ))}
            </>
          )}
        </>
      )}

      <p className="tiny faint center" style={{ marginTop: 18, lineHeight: 1.55 }}>
        To change what appears here, adjust the share setting on each item in your Comfort Map and
        Physical Intimacy Comfort.
      </p>
    </div>
  );
}
