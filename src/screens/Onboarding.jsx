import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { ONBOARDING } from "../data/content";

export default function Onboarding() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [picked, setPicked] = useState([]);
  const [busy, setBusy] = useState(false);

  function toggle(opt) {
    setPicked((p) => (p.includes(opt) ? p.filter((x) => x !== opt) : [...p, opt]));
  }

  async function next() {
    setBusy(true);
    try {
      if (user) {
        await setDoc(doc(db, "users", user.uid), { onboardingSelections: picked }, { merge: true });
      }
      nav("/blueprint");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="screen">
      <div className="head">
        <h1 className="display">What brings you here?</h1>
        <p className="small muted" style={{ marginTop: 6 }}>
          Pick anything that fits. This only guides your reflection &mdash; it never labels you,
          and you can change it whenever.
        </p>
      </div>

      <div className="chips">
        {ONBOARDING.map((opt) => (
          <button key={opt} className="chip" aria-pressed={picked.includes(opt)} onClick={() => toggle(opt)}>
            {opt}
          </button>
        ))}
      </div>

      <div className="spacer" />
      <button className="btn btn-primary" disabled={busy} onClick={next}>
        {busy ? "Saving\u2026" : "Continue"}
      </button>
      <button className="btn btn-text" onClick={() => nav("/blueprint")}>Skip for now</button>
    </div>
  );
}
