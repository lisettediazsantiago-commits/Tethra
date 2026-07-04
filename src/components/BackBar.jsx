import { useNavigate } from "react-router-dom";

// A small, consistent "back" control for screens that aren't top-level nav tabs
// (so the bottom nav doesn't already provide an obvious way back). Uses real
// browser history when there is any, and falls back to a safe destination on a
// fresh/deep load so it never strands the person or leaves the app unexpectedly.
export default function BackBar({ label = "Back", fallback = "/app" }) {
  const nav = useNavigate();
  const goBack = () => {
    if (window.history.length > 1) nav(-1);
    else nav(fallback);
  };
  return (
    <button type="button" onClick={goBack} aria-label="Go back"
      style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        background: "none", border: "none", padding: "2px 2px 2px 0", marginBottom: 8,
        cursor: "pointer", color: "var(--tethra-gray, #7D7B87)", fontSize: 13,
        fontFamily: "var(--body)", lineHeight: 1.2,
      }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
      {label}
    </button>
  );
}
