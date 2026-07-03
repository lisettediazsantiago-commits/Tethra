import { useEffect, useState } from "react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { JOURNAL_PROMPTS } from "../data/content";
import Icon from "../components/Icon";

// A lightweight, fully private journal (v1.1 §10). Entries live inside the
// existing owner-only reflections/{uid} document (a `journal` array), so no
// new Firestore collection or rule is needed. Nothing here is ever shared.
const FREE = "Free write";
const MONTHS = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
const newId = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
const fmtDate = (ms) => {
  const d = new Date(ms);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};

export default function Journal() {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [prompt, setPrompt] = useState(JOURNAL_PROMPTS[0]);
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  const [confirmId, setConfirmId] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, "reflections", user.uid)).then((snap) => {
      if (snap.exists()) setEntries(snap.data().journal || []);
      setReady(true);
    });
  }, [user]);

  async function persist(next) {
    setEntries(next);
    if (!user) return;
    setStatus("Saving\u2026");
    try {
      await setDoc(doc(db, "reflections", user.uid), {
        userId: user.uid, journal: next, updatedAt: serverTimestamp(),
      }, { merge: true });
      setStatus("Saved");
    } catch {
      setStatus("Couldn\u2019t save \u2014 try again");
    }
    setTimeout(() => setStatus(""), 1600);
  }

  async function addEntry() {
    const body = text.trim();
    if (!body) return;
    const entry = { id: newId(), prompt, text: body, createdAt: Date.now() };
    setText("");
    await persist([entry, ...entries]);
  }

  async function remove(id) {
    setConfirmId(null);
    await persist(entries.filter((e) => e.id !== id));
  }

  const taStyle = {
    width: "100%", marginTop: 12, resize: "vertical", minHeight: 88,
    border: "0.5px solid var(--line)", borderRadius: 12, padding: "10px 12px",
    fontFamily: "var(--body)", fontSize: 14, lineHeight: 1.55, color: "var(--ink)",
    background: "#FFFFFF", boxSizing: "border-box",
  };

  return (
    <div className="screen">
      <div className="head">
        <div className="rowico" style={{ marginBottom: 8 }}>
          <Icon name="journal" size={34} />
          <span className="kicker">Just for you</span>
        </div>
        <h1 className="display">Reflection journal</h1>
        <p className="small muted" style={{ marginTop: 6, lineHeight: 1.55 }}>
          A private space to notice yourself &mdash; no one else ever sees this.
        </p>
      </div>

      {/* Composer */}
      <div className="card" style={{ marginBottom: 16 }}>
        <p className="eyebrow" style={{ marginTop: 0 }}>Reflect on</p>
        <div className="chips" style={{ marginTop: 8 }}>
          {[...JOURNAL_PROMPTS, FREE].map((p) => (
            <button key={p} className="chip" aria-pressed={prompt === p} onClick={() => setPrompt(p)}>
              {p}
            </button>
          ))}
        </div>
        <textarea
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={prompt === FREE ? "Whatever\u2019s on your mind\u2026" : prompt}
          style={taStyle}
        />
        <button className="btn btn-primary" style={{ marginTop: 12 }}
          disabled={!ready || !text.trim()} onClick={addEntry}>
          Save entry
        </button>
        <p className="tiny faint center" style={{ marginTop: 8, minHeight: 14 }}>{status}</p>
      </div>

      {/* Past entries */}
      {!ready ? null : entries.length === 0 ? (
        <p className="small muted center" style={{ marginTop: 8 }}>
          Your reflections will gather here, newest first. There&rsquo;s no wrong thing to write.
        </p>
      ) : (
        entries.map((e) => (
          <div className="card" key={e.id} style={{ marginBottom: 10 }}>
            <div className="row-between">
              <span className="tiny faint">{fmtDate(e.createdAt)}</span>
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
            {e.prompt && e.prompt !== FREE && (
              <p className="tiny" style={{ color: "var(--plum-700)", marginTop: 6, fontStyle: "italic" }}>{e.prompt}</p>
            )}
            <p className="small" style={{ marginTop: 6, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{e.text}</p>
          </div>
        ))
      )}

      <p className="tiny faint center" style={{ marginTop: 18 }}>
        Private by default. This never appears in any shared space.
      </p>
    </div>
  );
}
