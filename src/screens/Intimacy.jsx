import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import {
  INTIMACY_INTRO, INTIMACY_STATES, INTIMACY_CONTEXTS, INTIMACY_VISIBILITY,
  INTIMACY_DEFAULT_VISIBILITY, INTIMACY_CATEGORIES, INTIMACY_SECTION,
} from "../data/content";
import Icon from "../components/Icon";

const keyOf = (cat, item) => `${cat}:${item}`;
const CHECK = <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>;

export default function Intimacy() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [items, setItems] = useState({});
  const [openKey, setOpenKey] = useState(null);
  const [status, setStatus] = useState("");
  const loaded = useRef(false);

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, "intimacyMaps", user.uid)).then((snap) => {
      if (snap.exists()) setItems(snap.data().items || {});
      loaded.current = true;
    });
  }, [user]);

  useEffect(() => {
    if (!loaded.current || !user) return;
    setStatus("Saving\u2026");
    const t = setTimeout(async () => {
      await setDoc(doc(db, "intimacyMaps", user.uid), {
        userId: user.uid, items, updatedAt: serverTimestamp(),
      }, { merge: true });
      setStatus("All changes saved");
    }, 700);
    return () => clearTimeout(t);
  }, [items, user]);

  function entryOf(k) {
    return items[k] || { state: "", contexts: [], visibility: INTIMACY_DEFAULT_VISIBILITY };
  }
  function update(k, patch) {
    setItems((m) => ({ ...m, [k]: { ...entryOf(k), ...patch } }));
  }
  function toggleContext(k, ctx) {
    const cur = entryOf(k).contexts || [];
    update(k, { contexts: cur.includes(ctx) ? cur.filter((c) => c !== ctx) : [...cur, ctx] });
  }

  return (
    <div className="screen">
      {/* Entry hero */}
      <div className="intimacy-hero">
        <div className="rowico" style={{ marginBottom: 8 }}>
          <Icon name={INTIMACY_SECTION.icon} size={38} />
          <span className="kicker">Comfort Map</span>
        </div>
        <h1 className="display">{INTIMACY_SECTION.title}</h1>
        <p>Your comfort belongs to you. There are no right or wrong answers.</p>
      </div>

      <div className="assure">
        <Icon name="privacy" size={18} />
        <p>{INTIMACY_INTRO} Every item starts private.</p>
      </div>

      {INTIMACY_CATEGORIES.map((cat) => (
        <div className="card" key={cat.key} style={{ marginBottom: 12 }}>
          <div className="icat-head">
            <Icon name={cat.icon} size={40} />
            <div>
              <h3 className="display">{cat.title}</h3>
              <span className="sub">{cat.sub}</span>
            </div>
          </div>

          {cat.items.map((item) => {
            const k = keyOf(cat.key, item);
            const e = entryOf(k);
            const open = openKey === k;
            const vis = INTIMACY_VISIBILITY.find((v) => v.key === e.visibility) || INTIMACY_VISIBILITY[0];
            return (
              <div key={k}>
                <button className="iitem" aria-expanded={open}
                  onClick={() => setOpenKey(open ? null : k)}>
                  <span className="name">{item}</span>
                  <span className="meta">
                    <Icon name={vis.sharesToPartner ? "shared-space" : "privacy"} size={13} />
                    {e.state ? "edit" : "set"}
                  </span>
                </button>

                {open && (
                  <div style={{ padding: "2px 2px 12px" }}>
                    {/* 7-state scale */}
                    <div className="q-label">How does this currently feel for you?</div>
                    <div role="radiogroup" aria-label={`How ${item} feels`}>
                      {INTIMACY_STATES.map((s) => (
                        <button key={s} type="button" role="radio" aria-checked={e.state === s}
                          className={"istate" + (e.state === s ? " on" : "")}
                          onClick={() => update(k, { state: e.state === s ? "" : s })}>
                          <span className="dot" /><span>{s}</span>
                        </button>
                      ))}
                    </div>

                    {/* Context multi-select */}
                    <div className="q-label">This feels comfortable when&hellip;</div>
                    {INTIMACY_CONTEXTS.map((ctx) => {
                      const on = (e.contexts || []).includes(ctx);
                      return (
                        <button key={ctx} type="button" aria-pressed={on}
                          className={"ictx" + (on ? " on" : "")}
                          onClick={() => toggleContext(k, ctx)}>
                          <span className="chk">{on ? CHECK : null}</span><span>{ctx}</span>
                        </button>
                      );
                    })}

                    {/* Visibility */}
                    <div className="q-label">Who can see this?</div>
                    <div className="ivis">
                      <div className="vh"><Icon name="privacy" size={14} /> Private by default</div>
                      {INTIMACY_VISIBILITY.map((v) => (
                        <button key={v.key} type="button" role="radio" aria-checked={e.visibility === v.key}
                          className={"ivopt" + (e.visibility === v.key ? " on" : "")}
                          onClick={() => update(k, { visibility: v.key })}>
                          <span className="r" /><span>{v.label}</span>
                          {v.badge && <span className="badge">{v.badge}</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}

      <p className="tiny muted center" style={{ margin: "4px 2px 10px", lineHeight: 1.55 }}>
        Only &ldquo;Share with partner&rdquo; ever reveals an item in a shared space. &ldquo;Discuss together&rdquo;
        and &ldquo;Share later&rdquo; stay fully private.
      </p>
      <p className="tiny faint center">{status}</p>

      <button className="btn btn-text" style={{ marginTop: 6 }} onClick={() => nav("/app/comfort-map")}>
        Back to Comfort Map
      </button>
    </div>
  );
}
