import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { COMFORT_CATEGORIES } from "../data/content";
import Icon from "../components/Icon";

export default function Dashboard() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [mapped, setMapped] = useState(0);

  const total = COMFORT_CATEGORIES.reduce((n, c) => n + c.items.length, 0);

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, "comfortMaps", user.uid)).then((snap) => {
      if (snap.exists()) {
        const items = snap.data().items || {};
        setMapped(Object.values(items).filter((e) => e && e.level).length);
      }
    });
  }, [user]);

  const pct = total ? Math.round((mapped / total) * 100) : 0;
  const name = user?.displayName?.split(" ")[0] || "there";

  const links = [
    { to: "/app/comfort-map", icon: "comfort-map", title: "Comfort map", sub: "Mark where you are today" },
    { to: "/app/intimacy", icon: "intimacy", title: "Physical intimacy comfort", sub: "Private by default \u00b7 at your pace" },
    { to: "/app/shared", icon: "shared-space", title: "Shared space", sub: "Understand each other, gently" },
    { to: "/app/check-in", icon: "check-in", title: "Consent check-in", sub: "Before or after time together" },
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
          <span className="tiny faint">{pct}% mapped</span>
        </div>
        <div className="progress" style={{ marginTop: 10 }}>
          <span style={{ width: `${pct}%` }} />
        </div>
        <p className="tiny muted" style={{ marginTop: 10 }}>
          Growth here isn&rsquo;t &ldquo;progress toward intimacy.&rdquo; It can mean becoming clearer,
          more open, or more protective of a boundary.
        </p>
      </div>

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
    </div>
  );
}
