import { useNavigate } from "react-router-dom";
import { IconHeart, IconShield } from "../components/Icons";

export default function Landing() {
  const nav = useNavigate();
  return (
    <div className="screen center">
      <div className="emblem" style={{ margin: "10px auto 16px" }}>
        <IconHeart width={24} height={24} />
      </div>

      <h1 className="display">Tethra</h1>
      <p className="eyebrow" style={{ marginTop: 8 }}>Move at the pace of trust</p>

      <p className="lead" style={{ marginTop: 18 }}>A consent-first space for honest connection.</p>
      <p className="small muted" style={{ marginTop: 10, lineHeight: 1.6 }}>
        Whether you&rsquo;re dating again after years, healing, or moving slowly on purpose &mdash;
        Tethra gives you language for what matters, before assumptions are made.
      </p>

      <div className="btn-row" style={{ marginTop: 24 }}>
        <button className="btn btn-primary" onClick={() => nav("/auth?mode=signup")}>
          Start my reflection
        </button>
        <button className="btn btn-outline" onClick={() => nav("/auth?mode=signup")}>
          Create my comfort map
        </button>
        <button className="btn btn-text" onClick={() => nav("/auth")}>
          I already have an account
        </button>
      </div>

      <div className="safety-note">
        <IconShield width={13} height={13} /> Not therapy or crisis support &middot;{" "}
        <a href="/safety">Safety resources anytime</a>
      </div>
    </div>
  );
}
