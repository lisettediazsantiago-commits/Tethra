import { useNavigate } from "react-router-dom";

// A brief philosophy intro shown to new users right after sign-up, before
// onboarding begins (v1.1 §4). Also reachable from the Landing page so anyone
// can read the "why" before committing. Purely static — no data.
export default function WhyTethra() {
  const nav = useNavigate();
  return (
    <div className="screen">
      <div className="head">
        <p className="eyebrow">A moment before you begin</p>
        <h1 className="display" style={{ marginTop: 6 }}>Why Tethra?</h1>
      </div>

      <p className="lead" style={{ marginTop: 4 }}>Most relationship apps help people meet.</p>
      <p style={{ fontFamily: "var(--display)", fontSize: 20, lineHeight: 1.35, color: "var(--plum-700)", margin: "8px 0 0" }}>
        Tethra helps people understand one another.
      </p>

      <div style={{ marginTop: 24 }}>
        <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--ink)", margin: 0 }}>You don&rsquo;t have to rush.</p>
        <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--ink)", margin: "5px 0 0" }}>You don&rsquo;t have to guess.</p>
        <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--ink)", margin: "5px 0 0" }}>You don&rsquo;t have to assume.</p>
      </div>

      <p className="small muted" style={{ marginTop: 24, lineHeight: 1.65 }}>
        You deserve language for your comfort, your boundaries, and your hopes &mdash;
        before misunderstandings happen.
      </p>

      <div style={{ marginTop: 26, paddingTop: 16, borderTop: "0.5px solid var(--line)" }}>
        <p style={{ fontFamily: "var(--display)", fontSize: 18, lineHeight: 1.4, color: "var(--plum-900)", margin: 0 }}>
          There is no perfect score here.
        </p>
        <p style={{ fontFamily: "var(--display)", fontSize: 18, lineHeight: 1.4, color: "var(--plum-700)", margin: "2px 0 0" }}>
          Only greater clarity.
        </p>
      </div>

      <div className="spacer" />
      <button className="btn btn-primary" onClick={() => nav("/onboarding")}>Begin</button>
    </div>
  );
}
