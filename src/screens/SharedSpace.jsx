import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { compareLevels } from "../data/content";
import { IconShield } from "../components/Icons";
import Icon from "../components/Icon";

// Illustrative sample so the shared view is understandable before a partner joins.
// Real spaces compare each person's *shareable* fields only — never private notes.
const SAMPLE = [
  { topic: "Taking things slowly", you: "Slow", partner: "Slow", raw: false },
  { topic: "Holding hands", you: "Comfortable", partner: "Open with conversation", raw: true },
  { topic: "Exclusivity", you: "Ready to talk", partner: "Needs more time", raw: false },
];

export default function SharedSpace() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  async function invite() {
    setBusy(true);
    try {
      const ref = doc(collection(db, "sharedSpaces"));
      const shareCode = ref.id.slice(0, 6).toUpperCase();
      await setDoc(ref, {
        sharedSpaceId: ref.id,
        createdBy: user.uid,
        invitedUserId: null,
        shareCode,
        status: "pending",
        createdAt: serverTimestamp(),
        permissions: { shareWhatHelps: true, shareLevels: true, sharePrivateNotes: false },
      });
      setCode(shareCode);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="screen">
      <div className="head">
        <h1 className="display">Shared space</h1>
        <p className="small muted" style={{ marginTop: 6 }}>
          A place to understand each other. No matches or scores here &mdash; only shared comfort
          and gentle conversation invitations.
        </p>
      </div>

      <button className="card entry-card" style={{ marginBottom: 12, width: "100%" }} onClick={() => nav("/app/snapshot")}>
        <Icon name="privacy" size={40} />
        <span className="grow">
          <span className="t">Preview my snapshot</span>
          <span className="s">See exactly what a partner would see</span>
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--tethra-lavender)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}><path d="M9 6l6 6-6 6" /></svg>
      </button>

      <div className="card">
        <p className="small" style={{ fontWeight: 500, marginTop: 0 }}>Invite someone to share</p>
        <p className="tiny muted">
          They&rsquo;ll only ever see what you&rsquo;ve chosen to share. Private notes stay private.
        </p>
        {code ? (
          <p className="small" style={{ marginTop: 10 }}>
            Your invite code: <strong style={{ letterSpacing: 2, color: "var(--plum-700)" }}>{code}</strong>
          </p>
        ) : (
          <button className="btn btn-outline" style={{ marginTop: 10 }} disabled={busy} onClick={invite}>
            {busy ? "Creating\u2026" : "Create invite"}
          </button>
        )}
      </div>

      <div className="spacer-sm" />
      <p className="eyebrow" style={{ marginBottom: 8 }}>Preview &middot; you &amp; a partner</p>

      {SAMPLE.map((r) => {
        const cmp = r.raw ? compareLevels(r.you, r.partner) : fallback(r);
        return (
          <div className="card" key={r.topic} style={{ marginBottom: 10 }}>
            <div className="row-between">
              <span className="small" style={{ fontWeight: 500 }}>{r.topic}</span>
              <span className={`state ${cmp.state}`}><span className="dot" />{cmp.label}</span>
            </div>
            <p className="tiny muted" style={{ marginTop: 7 }}>You: {r.you} &middot; Partner: {r.partner}</p>
            {cmp.state === "talk" && (
              <p className="suggestion">
                One of you feels comfortable, and the other would like to talk first. A gentle place to
                begin: &ldquo;What would make this feel easy and welcome for you?&rdquo;
              </p>
            )}
          </div>
        );
      })}

      <div className="safety-note" style={{ justifyContent: "flex-start", textAlign: "left" }}>
        <IconShield width={13} height={13} />
        A shared map isn&rsquo;t permission. Consent is still asked for in the moment &mdash; and anyone can
        change their mind anytime.
      </div>
    </div>
  );
}

// For non-spectrum sample rows, pick a neutral state by hand.
function fallback(r) {
  if (r.you === r.partner) return { state: "shared", label: "Shared comfort" };
  return { state: "slow", label: "Move slowly here" };
}
