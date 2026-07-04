import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { BLUEPRINT, blueprintNarrative } from "../data/content";
import BackBar from "../components/BackBar";

function hasAny(a) {
  return !!(a && ((a.needs && a.needs.length) || a.pace || (a.safest && a.safest.length)));
}

export default function Blueprint() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [answers, setAnswers] = useState({});
  const [saved, setSaved] = useState({});
  const [mode, setMode] = useState("edit");      // "view" | "edit"
  const [hadAnswers, setHadAnswers] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) { setLoaded(true); return; }
    getDoc(doc(db, "blueprints", user.uid)).then((snap) => {
      const a = snap.exists() ? (snap.data().answers || {}) : {};
      setAnswers(a);
      setSaved(a);
      const any = hasAny(a);
      setHadAnswers(any);
      setMode(any ? "view" : "edit");
      setLoaded(true);
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
      setSaved(answers);
      const any = hasAny(answers);
      setHadAnswers(any);
      if (any) setMode("view");
      else nav("/app");
    } finally {
      setBusy(false);
    }
  }

  const narrative = blueprintNarrative(answers);

  function copyBlueprint() {
    if (!narrative) return;
    const text = ["Your Relationship Blueprint", "", ...narrative.lines, "", ...narrative.closing, "", "\u2014 Tethra"].join("\n");
    if (navigator.clipboard) navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  if (!loaded) return <div className="screen" />;

  // ---- View mode: the narrative ----
  if (mode === "view" && narrative) {
    return (
      <div className="screen">
        <BackBar />
        <div className="head">
          <p className="eyebrow">Your relationship blueprint</p>
          <h1 className="display" style={{ marginTop: 6 }}>How you enter connection</h1>
          <p className="small muted" style={{ marginTop: 6 }}>
            Drawn from your own words. It can change as you do.
          </p>
        </div>

        <div className="card" style={{ padding: "20px 18px" }}>
          {narrative.lines.map((line, i) => (
            <p key={i} style={{ fontSize: 15, lineHeight: 1.7, color: "var(--ink)", margin: i ? "12px 0 0" : 0 }}>
              {line}
            </p>
          ))}
          <div style={{ marginTop: 18, paddingTop: 14, borderTop: "0.5px solid var(--line)" }}>
            {narrative.closing.map((c, i) => (
              <p key={i} style={{ fontFamily: "var(--display)", fontSize: 17, lineHeight: 1.4, color: "var(--plum-700)", margin: 0 }}>
                {c}
              </p>
            ))}
          </div>
        </div>

        <div className="spacer-sm" />
        <button className="btn btn-primary" onClick={() => nav("/app")}>Continue</button>
        <div style={{ display: "flex", justifyContent: "center", gap: 18, marginTop: 14 }}>
          <button className="link" onClick={copyBlueprint}>{copied ? "Copied" : "Copy my blueprint"}</button>
          <button className="link" onClick={() => setMode("edit")}>Revisit my answers</button>
        </div>
      </div>
    );
  }

  // ---- Edit mode: the questionnaire ----
  return (
    <div className="screen">
      <BackBar />
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
        {busy ? "Saving\u2026" : "See my blueprint"}
      </button>
      {hadAnswers && (
        <div style={{ textAlign: "center", marginTop: 14 }}>
          <button className="link" onClick={() => { setAnswers(saved); setMode("view"); }}>Cancel</button>
        </div>
      )}
    </div>
  );
}
