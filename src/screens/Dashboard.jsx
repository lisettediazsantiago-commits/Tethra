import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { TETHRA_QUOTES, dailyPick } from "../data/content";
import Icon from "../components/Icon";

const MONTHS = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

// Reflection language instead of a completion metric — the Comfort Map is a
// living reflection, never a score (v1.1 philosophy: no one is ever "complete").
function reflectionStatus(d) {
  if (!d) return "Not reflected yet";
  const now = new Date();
  const day = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate());
  const diff = Math.round((day(now) - day(d)) / 86400000);
  if (diff <= 0) return "Reflected today";
  if (diff === 1) return "Reflected yesterday";
  if (d.getFullYear() === now.getFullYear()) return `Last reflected: ${MONTHS[d.getMonth()]} ${d.getDate()}`;
  return `Last reflected: ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export default function Dashboard() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [reflectedAt, setReflectedAt] = useState(null);
  const [showInvite, setShowInvite] = useState(false);
  const [hasPriorCheckin, setHasPriorCheckin] = useState(false);

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, "comfortMaps", user.uid)).then((snap) => {
      if (snap.exists()) setReflectedAt(snap.data().updatedAt?.toDate?.() || null);
    });
    getDoc(doc(db, "reflections", user.uid)).then((snap) => {
      const checkins = snap.exists() ? (snap.data().checkins || []) : [];
      setHasPriorCheckin(checkins.length > 0);
      const last = checkins.reduce((m, c) => Math.max(m, c.createdAt || 0), 0);
      const days = last ? (Date.now() - last) / 86400000 : Infinity;
      // Gentle + periodic: only invite when it has been a while (or never).
      setShowInvite(days >= 12);
    });
  }, [user]);

  const name = user?.displayName?.split(" ")[0] || "there";
  const quote = dailyPick(TETHRA_QUOTES);

  const links = [
    { to: "/app/comfort-map", icon: "comfort-map", title: "Comfort map", sub: "Mark where you are today" },
    { to: "/app/intimacy", icon: "intimacy", title: "Physical intimacy comfort", sub: "Private by default \u00b7 at your pace" },
    { to: "/app/shared", icon: "shared-space", title: "Shared space", sub: "Understand each other, gently" },
    { to: "/app/check-in", icon: "check-in", title: "Consent check-in", sub: "Before or after time together" },
    { to: "/app/journal", icon: "journal", title: "Reflection journal", sub: "A private space to notice yourself" },
    { to: "/app/timeline", icon: "growth", title: "Growth timeline", sub: "See how you\u2019ve grown, privately" },
    { to: "/blueprint", icon: "blueprint", title: "Your blueprint", sub: "How you enter connection" },
    { to: "/safety", icon: "safety-resources", title: "Safety & resources", sub: "Support, anytime" },
  ];

  return (
    <div className="screen">
      <div className="head">
        <p className="eyebrow">Welcome back</p>
        <h1 className="display" style={{ marginTop: 6 }}>Hello, {name}</h1>
      </div>

      <div className="card">
        <div className="row-between">
          <span className="small" style={{ fontWeight: 500 }}>Your comfort map</span>
          <span className="tiny faint">{reflectionStatus(reflectedAt)}</span>
        </div>
        <p className="tiny muted" style={{ marginTop: 10, lineHeight: 1.55 }}>
          Your map reflects who you are today &mdash; not who you have to be forever. Revisit it whenever
          you grow, heal, or discover something new.
        </p>
      </div>

      {showInvite && (
        <div className="card" style={{ marginTop: 12 }}>
          <div className="rowico" style={{ marginBottom: 4 }}>
            <Icon name="reflection" size={30} />
            <span className="small" style={{ fontWeight: 500 }}>A gentle moment for you</span>
          </div>
          <p className="tiny muted" style={{ marginTop: 2, lineHeight: 1.55 }}>
            {hasPriorCheckin
              ? "Has anything changed since your last reflection? No pressure \u2014 just a moment to notice."
              : "Whenever you\u2019re ready, take a moment to notice where you are today."}
          </p>
          <button className="btn btn-outline" style={{ marginTop: 10 }} onClick={() => nav("/app/reflect")}>
            Reflect
          </button>
        </div>
      )}

      <div className="spacer-sm" />
      <div className="stack">
        {links.map((l) => (
          <button key={l.to} className="card entry-card" style={{ marginBottom: 10 }} onClick={() => nav(l.to)}>
            <Icon name={l.icon} size={40} />
            <span className="grow">
              <span className="t">{l.title}</span>
              <span className="s">{l.sub}</span>
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--tethra-lavender)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}><path d="M9 6l6 6-6 6" /></svg>
          </button>
        ))}
      </div>

      {quote && (
        <p className="tiny faint center" style={{ marginTop: 22, fontStyle: "italic", lineHeight: 1.5 }}>
          &ldquo;{quote}&rdquo;
        </p>
      )}
    </div>
  );
}
