import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { COMFORT_CATEGORIES } from "../data/content";
import { IconArrow } from "../components/Icons";

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
    { to: "/app/comfort-map", title: "Comfort map", sub: "Mark where you are today" },
    { to: "/app/shared", title: "Shared space", sub: "Understand each other, gently" },
    { to: "/app/check-in", title: "Consent check-in", sub: "Before or after time together" },
    { to: "/blueprint", title: "Your blueprint", sub: "How you enter connection" },
    { to: "/safety", title: "Safety & resources", sub: "Support, anytime" },
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
          <button key={l.to} className="card row-between" style={{ width: "100%", cursor: "pointer", textAlign: "left" }} onClick={() => nav(l.to)}>
            <span>
              <span className="small" style={{ fontWeight: 500 }}>{l.title}</span>
              <br />
              <span className="tiny faint">{l.sub}</span>
            </span>
            <IconArrow width={18} height={18} />
          </button>
        ))}
      </div>
    </div>
  );
}
