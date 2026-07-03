import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import sunrise from "../assets/sunrise.jpg";

export default function Auth() {
  const [params] = useSearchParams();
  const [isSignup, setIsSignup] = useState(params.get("mode") === "signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { signup, login } = useAuth();
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (isSignup) {
        await signup(email.trim(), password, name.trim());
        nav("/onboarding");
      } else {
        await login(email.trim(), password);
        nav("/app");
      }
    } catch (err) {
      setError(friendly(err.code) || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="screen center landing">
      <div className="landing-art" style={{ backgroundImage: `url(${sunrise})` }} aria-hidden="true" />
      <div className="landing-scrim" aria-hidden="true" />
      <div className="landing-body">
      <div className="head center">
        <h1 className="display">{isSignup ? "Create your space" : "Welcome back"}</h1>
        <p className="small muted" style={{ marginTop: 6 }}>
          Your reflections are private by default. You choose what, if anything, to share.
        </p>
      </div>

      <form onSubmit={submit}>
        {isSignup && (
          <div className="field">
            <label htmlFor="name">Name or nickname</label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          </div>
        )}
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={isSignup ? "new-password" : "current-password"} />
        </div>

        {error && <p className="small" style={{ color: "#a32d2d", marginBottom: 12 }}>{error}</p>}

        <button className="btn btn-primary" disabled={busy}>
          {busy ? "One moment\u2026" : isSignup ? "Create account" : "Log in"}
        </button>
      </form>

      <p className="center small muted" style={{ marginTop: 18 }}>
        {isSignup ? "Already have an account? " : "New to Tethra? "}
        <button className="link" onClick={() => { setIsSignup(!isSignup); setError(""); }}>
          {isSignup ? "Log in" : "Create one"}
        </button>
      </p>
      </div>
    </div>
  );
}

function friendly(code) {
  switch (code) {
    case "auth/email-already-in-use": return "That email already has an account. Try logging in.";
    case "auth/invalid-email": return "That email address doesn't look right.";
    case "auth/weak-password": return "Please choose a password with at least 6 characters.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found": return "Email or password didn't match. Please try again.";
    default: return "";
  }
}
