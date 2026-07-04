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
