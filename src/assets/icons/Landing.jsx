import { useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import sunrise from "../assets/sunrise.jpg";
import tethraLogo from "../assets/tethra-logo.png";

export default function Landing() {
  const nav = useNavigate();
  return (
    <div className="screen center landing">
      <div className="landing-art" style={{ backgroundImage: `url(${sunrise})` }} aria-hidden="true" />
      <div className="landing-scrim" aria-hidden="true" />

      <div className="landing-body">
        <img src={tethraLogo} alt="Tethra"
          style={{ width: 140, height: "auto", display: "block", margin: "10px auto 12px" }} />

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
          <Icon name="safety-resources" bare size={13} color="currentColor" /> Not therapy or crisis support &middot;{" "}
          <a href="/safety">Safety resources anytime</a>
        </div>
      </div>
    </div>
  );
}
