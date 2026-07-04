import { useNavigate } from "react-router-dom";
import { INTIMACY_SECTION } from "../data/content";
import Icon from "../components/Icon";
import IntimacyPanel from "../components/IntimacyPanel";
import BackBar from "../components/BackBar";

// Standalone /app/intimacy screen. The body now lives in the shared
// <IntimacyPanel /> so this page and the inline Comfort Map view stay in sync.
export default function Intimacy() {
  const nav = useNavigate();

  return (
    <div className="screen">
      <BackBar />
      {/* Entry hero */}
      <div className="intimacy-hero">
        <div className="rowico" style={{ marginBottom: 8 }}>
          <Icon name={INTIMACY_SECTION.icon} size={38} />
          <span className="kicker">Comfort Map</span>
        </div>
        <h1 className="display">{INTIMACY_SECTION.title}</h1>
        <p>Your comfort belongs to you. There are no right or wrong answers.</p>
      </div>

      <IntimacyPanel />

      <button className="btn btn-text" style={{ marginTop: 6 }} onClick={() => nav("/app/comfort-map")}>
        Back to Comfort Map
      </button>
    </div>
  );
}
