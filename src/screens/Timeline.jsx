import { useEffect, useState } from "react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { GROWTH_PROMPTS, dailyPick } from "../data/content";
import Icon from "../components/Icon";

// Growth Timeline (v1.1 §9): a completely private, self-authored timeline of how
// someone has evolved. Stored in the existing reflections/{uid} doc as a
// `timeline` array (alongside the journal), so no new Firestore rule is needed.
const MONTHS = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
const newId = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
const fmtMonth = (ms) => { const d = new Date(ms); return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`; };

export default function Timeline() {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  const [confirmId, setConfirmId] = useState(null);
  const [ready, setReady] = useState(false);
  const prompt = dailyPick(GROWTH_PROMPTS);

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, "reflections", user.uid)).then((snap) => {
      if (snap.exists()) setEntries(snap.data().timeline || []);
      setReady(true);
    });
  }, [user]);

  async function persist(next) {
    setEntries(next);
    if (!user) return;
    setStatus("Saving\u2026");
    try {
      await setDoc(doc(db, "reflections", user.uid), {
        userId: user.uid, timeline: next, updatedAt: serverTimestamp(),
      }, { merge: true });
      setStatus("Saved");
    } catch { setStatus("Couldn\u2019t save \u2014 try again"); }
    setTimeout(() => setStatus(""), 1600);
  }

  async function add() {
    const body = text.trim();
    if (!body) return;
    setText("");
    const entry = { id: newId(), text: body, createdAt: Date.now() };
    await persist([...entries, entry].sort((a, b) => a.createdAt - b.createdAt));
  }
  async function remove(id) { setConfirmId(null); await persist(entries.filter((e) => e.id !== id)); }

  const sorted = [...entries].sort((a, b) => a.createdAt - b.createdAt);

  const taStyle = {
    width: "100%", marginTop: 10, resize: "vertical", minHeight: 74,
    border: "0.5px solid var(--line)", borderRadius: 12, padding: "10px 12px",
    fontFamily: "var(--body)", fontSize: 14, lineHeight: 1.55, color: "var(--ink)",
    background: "#FFFFFF", boxSizing: "border-box",
  };

  return (
    <div className="screen">
      <div className="head">
        <div className="rowico" style={{ marginBottom: 8 }}>
          <Icon name="growth" size={34} />
          <span className="kicker">Private &middot; just for you</span>
        </div>
        <h1 className="display">Growth timeline</h1>
        <p className="small muted" style={{ marginTop: 6, lineHeight: 1.55 }}>
          Notice how you&rsquo;ve changed over time. Add a reflection whenever something shifts &mdash;
          the arc builds as you go.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <p className="tiny" style={{ marginTop: 0, color: "var(--plum-700)", fontStyle: "italic" }}>{prompt}</p>
        <textarea rows={3} value={text} onChange={(e) => setText(e.target.value)}
          placeholder="Something you understand about yourself now\u2026" style={taStyle} />
        <button className="btn btn-primary" style={{ marginTop: 12 }}
          disabled={!ready || !text.trim()} onClick={add}>
          Add to timeline
        </button>
        <p className="tiny faint center" style={{ marginTop: 8, minHeight: 14 }}>{status}</p>
      </div>

      {!ready ? null : sorted.length === 0 ? (
        <p className="small muted center" style={{ marginTop: 8, lineHeight: 1.6 }}>
          Your timeline is empty for now. The first entry is just where you are today &mdash; months
          from now, it becomes the start of your story.
        </p>
      ) : (
        <div style={{ position: "relative", paddingLeft: 22 }}>
          <div style={{ position: "absolute", left: 6, top: 8, bottom: 8, width: 2, background: "var(--line)" }} />
          {sorted.map((e) => (
            <div key={e.id} style={{ position: "relative", marginBottom: 14 }}>
              <div style={{ position: "absolute", left: -22, top: 4, width: 12, height: 12, borderRadius: "50%",
                background: "var(--tethra-plum, #4B2E59)", border: "2px solid var(--cream, #F4EEE6)" }} />
              <div className="card" style={{ marginBottom: 0 }}>
                <div className="row-between">
                  <span className="tiny" style={{ color: "var(--plum-700)", fontWeight: 500 }}>{fmtMonth(e.createdAt)}</span>
                  {confirmId === e.id ? (
                    <span className="tiny">
                      <button className="link" onClick={() => remove(e.id)}>Delete</button>
                      <span className="faint">{" \u00b7 "}</span>
                      <button className="link" onClick={() => setConfirmId(null)}>Keep</button>
                    </span>
                  ) : (
                    <button className="link" onClick={() => setConfirmId(e.id)}>Remove</button>
                  )}
                </div>
                <p className="small" style={{ marginTop: 6, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{e.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="tiny faint center" style={{ marginTop: 18 }}>
        Completely private. This never appears in any shared space.
      </p>
    </div>
  );
}
