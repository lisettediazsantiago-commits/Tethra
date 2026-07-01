import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { BLUEPRINT } from "../data/content";

export default function Blueprint() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [answers, setAnswers] = useState({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, "blueprints", user.uid)).then((snap) => {
      if (snap.exists()) setAnswers(snap.data().answers || {});
    });
  }, [user]);

  function choose(q, opt) {
    setAnswers((a) => {
      if (q.multi) {
        const cur = a[q.key] || [];
        const nextVal = cur.includes(opt) ? cur.filter((x) => x !== opt) : [...cur, opt];
        return { ...a, [q.key]: nextVal };
      }
      return { ...a, [q.key]: opt };
    });
  }

  function isOn(q, opt) {
    const v = answers[q.key];
    return q.multi ? (v || []).includes(opt) : v === opt;
  }

  async function save() {
    setBusy(true);
    try {
      if (user) {
        await setDoc(doc(db, "blueprints", user.uid), {
          userId: user.uid, answers, updatedAt: serverTimestamp(),
        }, { merge: true });
      }
      nav("/app");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="screen">
      <div className="head">
        <h1 className="display">Your blueprint</h1>
        <p className="small muted" style={{ marginTop: 6 }}>
          A few words on how you enter connection. There are no wrong answers.
        </p>
      </div>

      {BLUEPRINT.map((q) => (
        <div className="card" key={q.key} style={{ marginBottom: 12 }}>
          <p className="small" style={{ fontWeight: 500, marginTop: 0 }}>{q.prompt}</p>
          <div className="chips">
            {q.options.map((opt) => (
              <button key={opt} className="chip" aria-pressed={isOn(q, opt)} onClick={() => choose(q, opt)}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="spacer-sm" />
      <button className="btn btn-primary" disabled={busy} onClick={save}>
        {busy ? "Saving\u2026" : "Save & continue"}
      </button>
    </div>
  );
}
