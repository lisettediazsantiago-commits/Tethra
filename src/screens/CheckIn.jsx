import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { CHECKIN } from "../data/content";
import BackBar from "../components/BackBar";

export default function CheckIn() {
  const { user } = useAuth();
  const [type, setType] = useState("before");
  const [answers, setAnswers] = useState({});
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  const prompts = CHECKIN[type];

  async function save() {
    setBusy(true);
    try {
      await addDoc(collection(db, "checkIns"), {
        userId: user.uid,
        type: type === "before" ? "beforeDate" : "afterDate",
        answers,
        createdAt: serverTimestamp(),
      });
      setSaved(true);
      setAnswers({});
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="screen">
      <BackBar />
      <div className="head">
        <h1 className="display">Check-in</h1>
        <p className="small muted" style={{ marginTop: 6 }}>
          A quiet moment for yourself, before or after time together. Yours to keep.
        </p>
      </div>

      <div className="chips" style={{ marginBottom: 16 }}>
        <button className="chip" aria-pressed={type === "before"} onClick={() => setType("before")}>Before</button>
        <button className="chip" aria-pressed={type === "after"} onClick={() => setType("after")}>After</button>
      </div>

      {prompts.map((q, i) => (
        <div className="field" key={i}>
          <label>{q}</label>
          <textarea
            rows={2}
            value={answers[q] || ""}
            onChange={(e) => setAnswers((a) => ({ ...a, [q]: e.target.value }))}
          />
        </div>
      ))}

      <button className="btn btn-primary" disabled={busy} onClick={save}>
        {busy ? "Saving\u2026" : saved ? "Saved" : "Save check-in"}
      </button>
    </div>
  );
}
