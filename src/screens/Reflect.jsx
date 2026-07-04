import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { REFLECTION_PROMPT, REFLECTION_OPTIONS } from "../data/content";
import Icon from "../components/Icon";
import BackBar from "../components/BackBar";

// Gentle Reflection Check-in (v1.1 §2). Records each check-in in the existing
// reflections/{uid} doc (a `checkins` array, alongside journal and timeline),
// so no new Firestore rule is needed. It's an invitation, never a task.
const MONTHS = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
const newId = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
const fmtDate = (ms) => { const d = new Date(ms); return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`; };
const labelOf = (key) => (REFLECTION_OPTIONS.find((o) => o.key === key)?.label || "");

const optStyle = {
  display: "block", width: "100%", textAlign: "left",
  padding: "12px 14px", marginBottom: 8, borderRadius: 12,
  border: "0.5px solid var(--line)", background: "#FFFFFF",
  fontFamily: "var(--body)", fontSize: 14, lineHeight: 1.4, color: "var(--ink)", cursor: "pointer",
};

export default function Reflect() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [ready, setReady] = useState(false);
  const [checkins, setCheckins] = useState([]);
  const [chosen, setChosen] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, "reflections", user.uid)).then((snap) => {
      if (snap.exists()) setCheckins(snap.data().checkins || []);
      setReady(true);
    });
  }, [user]);

  const hasPrior = checkins.length > 0;
  const prompt = hasPrior ? REFLECTION_PROMPT : "Take a gentle moment \u2014 how are you feeling today?";

  async function choose(opt) {
    setChosen(opt);
    if (!user) return;
    const next = [{ id: newId(), response: opt.key, createdAt: Date.now() }, ...checkins];
    setCheckins(next);
    setStatus("Saving\u2026");
    try {
      await setDoc(doc(db, "reflections", user.uid), {
        userId: user.uid, checkins: next, updatedAt: serverTimestamp(),
      }, { merge: true });
      setStatus("Reflection noted");
    } catch { setStatus(""); }
    setTimeout(() => setStatus(""), 1800);
  }

  const showHistory = ready && (checkins.length >= 2 || (!chosen && checkins.length >= 1));

  return (
    <div className="screen">
      <BackBar />
      <div className="head">
        <div className="rowico" style={{ marginBottom: 8 }}>
          <Icon name="reflection" size={34} />
          <span className="kicker">Just a moment</span>
        </div>
        <h1 className="display">A gentle check-in</h1>
        <p className="small muted" style={{ marginTop: 6, lineHeight: 1.55 }}>
          Nothing to update or prove &mdash; just a place to notice where you are today.
        </p>
      </div>

      {!chosen ? (
        <div className="card">
          <p className="small" style={{ fontWeight: 500, marginTop: 0, lineHeight: 1.5 }}>{prompt}</p>
          <div style={{ marginTop: 12 }}>
            {REFLECTION_OPTIONS.map((o) => (
              <button key={o.key} type="button" style={optStyle} disabled={!ready} onClick={() => choose(o)}>
                {o.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="card">
          <p className="small" style={{ fontWeight: 500, marginTop: 0 }}>{chosen.label}</p>
          <p className="small muted" style={{ marginTop: 8, lineHeight: 1.6 }}>{chosen.ack}</p>
          {chosen.to && (
            <button className="btn btn-outline" style={{ marginTop: 14 }} onClick={() => nav(chosen.to)}>{chosen.cta}</button>
          )}
          <p className="tiny faint center" style={{ marginTop: 10, minHeight: 14 }}>{status}</p>
          <button className="link" style={{ display: "block", margin: "4px auto 0" }} onClick={() => setChosen(null)}>
            Choose a different answer
          </button>
        </div>
      )}

      {showHistory && (
        <>
          <p className="eyebrow" style={{ margin: "18px 0 8px" }}>Your reflections over time</p>
          {checkins.map((c) => (
            <div className="card" key={c.id} style={{ marginBottom: 8, padding: "11px 14px" }}>
              <div className="row-between">
                <span className="small">{labelOf(c.response)}</span>
                <span className="tiny faint">{fmtDate(c.createdAt)}</span>
              </div>
            </div>
          ))}
        </>
      )}

      <p className="tiny faint center" style={{ marginTop: 18 }}>
        Completely private. This is only ever for you.
      </p>
    </div>
  );
}
