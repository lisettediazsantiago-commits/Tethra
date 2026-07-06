import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { TETHRA_QUOTES, dailyPick } from "../data/content";
import Icon from "../components/Icon";
import { PREF_DEFAULTS } from "./ConnectionPreferences";

// In-app "invitations" (never alarms). We surface at most one, only when a real
// signal is present, and word it in the person's chosen voice. Quiet mode and a
// "never" reflection frequency silence everything.
const INVITE_COPY = {
  reflection: {
    gentle: "A quiet moment might be waiting for you whenever you\u2019re ready.",
    encouraging: "A small reflection today could strengthen tomorrow.",
    reflective: "Growth often begins with curiosity \u2014 a reflection is here when it feels right.",
    minimal: "A reflection is waiting.",
  },
  conversation: {
    gentle: "There\u2019s a conversation here waiting whenever it feels right.",
    encouraging: "A small conversation could bring you closer \u2014 it\u2019s here when you\u2019re ready.",
    reflective: "Understanding grows one conversation at a time. One is waiting.",
    minimal: "A saved conversation is waiting.",
  },
};
const FREQ_DAYS = { weekly: 7, biweekly: 14, monthly: 30, ai: 12 };

function decideInvitation(prefs, reflectDays, savedCount) {
  if (prefs.quiet?.active) return null;
  const voice = prefs.voice || "gentle";
  if (prefs.reflectionFreq !== "never" && reflectDays >= (FREQ_DAYS[prefs.reflectionFreq] || 12)) {
    return { kind: "reflection", icon: "reflection", line: INVITE_COPY.reflection[voice] || INVITE_COPY.reflection.gentle, cta: "Reflect", to: "/app/reflect" };
  }
  if (prefs.conversationInvites && savedCount > 0) {
    return { kind: "conversation", icon: "conversations", line: INVITE_COPY.conversation[voice] || INVITE_COPY.conversation.gentle, cta: "Open saved", to: "/app/saved" };
  }
  return null;
}

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
  const [reflectDays, setReflectDays] = useState(null);
  const [prefs, setPrefs] = useState(null);
  const [savedCount, setSavedCount] = useState(0);
  const [identity, setIdentity] = useState(undefined);
  const [introDismissed, setIntroDismissed] = useState(true);

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, "comfortMaps", user.uid)).then((snap) => {
      if (snap.exists()) setReflectedAt(snap.data().updatedAt?.toDate?.() || null);
    });
    getDoc(doc(db, "users", user.uid)).then((snap) => {
      const d = snap.exists() ? snap.data() : {};
      setIdentity(d.identity || null);
      setIntroDismissed(!!d.identityIntroDismissed);
      setPrefs(d.connectionPrefs || null);
      setSavedCount((d.savedConversations || []).length);
    });
    getDoc(doc(db, "reflections", user.uid)).then((snap) => {
      const checkins = snap.exists() ? (snap.data().checkins || []) : [];
      const last = checkins.reduce((m, c) => Math.max(m, c.createdAt || 0), 0);
      setReflectDays(last ? (Date.now() - last) / 86400000 : Infinity);
    });
  }, [user]);

  const name = user?.displayName?.split(" ")[0] || "there";
  const quote = dailyPick(TETHRA_QUOTES);
  const invitation = reflectDays !== null ? decideInvitation({ ...PREF_DEFAULTS, ...(prefs || {}) }, reflectDays, savedCount) : null;

  function dismissIdentityIntro() {
    setIntroDismissed(true);
    if (user) setDoc(doc(db, "users", user.uid), { identityIntroDismissed: true }, { merge: true }).catch(() => {});
  }

  const groups = [
    {
      label: "Know yourself",
      color: "#A98BC0",
      labelColor: "#8E6BA6",
      items: [
        { to: "/app/comfort-map", icon: "comfort-map", title: "Comfort map", sub: "Mark where you are today" },
        { to: "/app/intimacy", icon: "intimacy", title: "Physical intimacy comfort", sub: "Private by default \u00b7 at your pace" },
        { to: "/blueprint", icon: "blueprint", title: "Your blueprint", sub: "How you enter connection" },
      ],
    },
    {
      label: "Reflect",
      color: "#8FA87E",
      labelColor: "#657F55",
      items: [
        { to: "/app/journal", icon: "journal", title: "Reflection journal", sub: "A private space to notice yourself" },
        { to: "/app/timeline", icon: "growth", title: "Growth timeline", sub: "See how you\u2019ve grown, privately" },
        { to: "/app/moments", icon: "appreciation", title: "Moments of care", sub: "The care you\u2019ve shown yourself" },
      ],
    },
    {
      label: "Together",
      color: "#D6A0B3",
      labelColor: "#B06B84",
      items: [
        { to: "/app/shared", icon: "shared-space", title: "Shared space", sub: "Understand each other, gently" },
        { to: "/app/conversations", icon: "conversations", title: "Gentle conversations", sub: "Leave each other notes, at your pace" },
        { to: "/app/check-in", icon: "check-in", title: "Consent check-in", sub: "Before or after time together" },
      ],
    },
    {
      label: "Support",
      color: "#BEB4C6",
      labelColor: "#7D7B87",
      items: [
        { to: "/safety", icon: "safety-resources", title: "Safety & resources", sub: "Support, anytime" },
      ],
    },
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

      {identity === null && !introDismissed && (
        <div className="card" style={{ marginTop: 12 }}>
          <div className="rowico" style={{ marginBottom: 4 }}>
            <Icon name="profile" size={30} />
            <span className="small" style={{ fontWeight: 500 }}>How would others recognize you?</span>
          </div>
          <p className="tiny muted" style={{ marginTop: 2, lineHeight: 1.55 }}>
            Choose a symbol or your initials to represent you &mdash; no photo needed. Identity is intentional
            here, never required.
          </p>
          <div style={{ display: "flex", gap: 16, marginTop: 10, alignItems: "center" }}>
            <button className="btn btn-outline" onClick={() => nav("/app/identity")}>Choose how I&rsquo;m seen</button>
            <button className="link" onClick={dismissIdentityIntro}>Maybe later</button>
          </div>
        </div>
      )}

      {invitation && (
        <div className="card" style={{ marginTop: 12 }}>
          <div className="rowico" style={{ marginBottom: 4 }}>
            <Icon name={invitation.icon} size={30} />
            <span className="small" style={{ fontWeight: 500 }}>A quiet invitation</span>
          </div>
          <p className="tiny muted" style={{ marginTop: 2, lineHeight: 1.55 }}>{invitation.line}</p>
          <button className="btn btn-outline" style={{ marginTop: 10 }} onClick={() => nav(invitation.to)}>
            {invitation.cta}
          </button>
        </div>
      )}

      <div className="spacer-sm" />
      {groups.map((g) => (
        <div key={g.label}>
          <p className="eyebrow" style={{ margin: "18px 0 8px 2px", color: g.labelColor }}>{g.label}</p>
          <div className="stack">
            {g.items.map((l) => (
              <button key={l.to} className="card entry-card" style={{ marginBottom: 10, borderLeft: `4px solid ${g.color}` }} onClick={() => nav(l.to)}>
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
      ))}

      {quote && (
        <p className="tiny faint center" style={{ marginTop: 22, fontStyle: "italic", lineHeight: 1.5 }}>
          &ldquo;{quote}&rdquo;
        </p>
      )}
    </div>
  );
}
