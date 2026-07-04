import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import IdentityAvatar, { SYMBOL_LABEL } from "../components/IdentityAvatar";
import Icon from "../components/Icon";

export default function Settings() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [identity, setIdentity] = useState(null);
  const firstName = (user?.displayName || "").split(" ")[0] || "You";

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, "users", user.uid)).then((u) => {
      setIdentity(u.exists() ? (u.data().identity || null) : null);
    }).catch(() => {});
  }, [user]);

  const mark = identity?.type === "symbol" && identity.symbol
    ? `Symbol \u00b7 ${(SYMBOL_LABEL[identity.symbol] || "").toLowerCase()}`
    : "Initials";

  async function signOut() {
    await logout();
    nav("/");
  }

  return (
    <div className="screen">
      <div className="head">
        <h1 className="display">Settings</h1>
      </div>

      <div className="card">
        <p className="tiny faint" style={{ margin: 0 }}>Signed in as</p>
        <p className="small" style={{ marginTop: 4 }}>{user?.email}</p>
      </div>

      <button className="card entry-card" style={{ marginTop: 12, width: "100%" }} onClick={() => nav("/app/identity")}>
        <IdentityAvatar identity={identity} name={firstName} size={40} />
        <span className="grow">
          <span className="t">How you&rsquo;re seen</span>
          <span className="s">{mark}</span>
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--tethra-lavender)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}><path d="M9 6l6 6-6 6" /></svg>
      </button>

      <button className="card entry-card" style={{ marginTop: 12, width: "100%" }} onClick={() => nav("/app/connection")}>
        <Icon name="gentle-reminder" size={40} />
        <span className="grow">
          <span className="t">Connection preferences</span>
          <span className="s">Gentle invitations, on your terms</span>
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--tethra-lavender)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}><path d="M9 6l6 6-6 6" /></svg>
      </button>

      <button className="card entry-card" style={{ marginTop: 12, width: "100%" }} onClick={() => nav("/faq")}>
        <span style={{ width: 40, height: 40, borderRadius: "50%", background: "#F0E9F6", color: "#8B6BA6", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M9.2 9.3a2.8 2.8 0 015.4 1c0 1.9-2.8 2.5-2.8 2.5" /><path d="M12 17h.01" /></svg>
        </span>
        <span className="grow">
          <span className="t">Questions &amp; answers</span>
          <span className="s">What Tethra is for, and how to get around</span>
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--tethra-lavender)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}><path d="M9 6l6 6-6 6" /></svg>
      </button>

      <div className="card" style={{ marginTop: 12 }}>
        <p className="small" style={{ fontWeight: 500, marginTop: 0 }}>Privacy</p>
        <p className="tiny muted" style={{ marginTop: 6, lineHeight: 1.6 }}>
          Everything you write is private by default. In a shared space, a partner sees only the fields
          you toggle to share &mdash; never your private notes.
        </p>
        <button className="link" style={{ marginTop: 10 }} onClick={() => nav("/safety")}>
          Safety &amp; resources
        </button>
      </div>

      <div className="spacer" />
      <button className="btn btn-outline" onClick={signOut}>Log out</button>
    </div>
  );
}
