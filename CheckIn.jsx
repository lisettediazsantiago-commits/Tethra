import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

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
