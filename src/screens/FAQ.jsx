import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackBar from "../components/BackBar";

const GROUPS = [
  {
    title: "What Tethra is",
    items: [
      {
        q: "What is Tethra for?",
        a: "Tethra helps two people build understanding. You map how comfortable you each feel across emotional, physical, social, and communication areas, then compare only what you choose to share. It\u2019s for dating again after time away, healing, moving slowly on purpose, or deepening a relationship you\u2019re already in.",
      },
      {
        q: "Is Tethra a dating app?",
        a: "No. There\u2019s no matching, swiping, or scores, and it isn\u2019t about finding someone new. Tethra is for building trust and understanding with one person you\u2019ve already chosen to connect with \u2014 one relationship at a time.",
      },
      {
        q: "Is it therapy or crisis support?",
        a: "No. Tethra isn\u2019t therapy, counseling, or crisis support, and it can\u2019t replace professional help. If you\u2019re struggling or in crisis, please reach out to a professional \u2014 the Safety resources page has places to turn.",
      },
    ],
  },
  {
    title: "Getting around",
    items: [
      {
        q: "What\u2019s a Comfort Map?",
        a: "Your Comfort Map is where you note how you feel about different parts of closeness \u2014 from daily texting to meeting family to physical intimacy \u2014 using gentle levels like \u201cmaybe later\u201d or \u201ccomfortable.\u201d It stays private to you until you choose to share parts of it.",
      },
      {
        q: "How do I share with someone?",
        a: "Open Shared space and tap \u201cCreate an invite code,\u201d then give that code to the person you want to connect with. They enter it under \u201cJoin with a code.\u201d You\u2019ll each see only what you\u2019ve chosen to share, grouped gently as growing together, worth a conversation, or ease into gently.",
      },
      {
        q: "Can I connect with more than one person?",
        a: "For now, Tethra is built for one Shared Space at a time \u2014 one relationship, given full attention. Additional Shared Spaces for friends, family, and mentors are on the roadmap; understanding takes time, so Tethra begins with one.",
      },
    ],
  },
  {
    title: "Privacy & safety",
    items: [
      {
        q: "What can my partner see?",
        a: "Only what you switch on to share. Your private notes, your raw Comfort Map, and anything you haven\u2019t shared stay yours alone. You can update what you share, hide your identity symbol, or disconnect entirely \u2014 anytime.",
      },
      {
        q: "Does a shared map mean consent?",
        a: "No. A shared map is a starting point for conversation, never permission. Consent is always asked for in the moment, and anyone can change their mind at any time.",
      },
    ],
  },
];

export default function FAQ() {
  const nav = useNavigate();
  const [open, setOpen] = useState("0-0");

  return (
    <div className="screen">
      <BackBar />
      <div className="head">
        <h1 className="display">Questions &amp; answers</h1>
        <p className="small muted" style={{ marginTop: 6 }}>
          What Tethra is for, what it isn&rsquo;t, and how to find your way around.
        </p>
      </div>

      <div style={{ display: "flex", gap: 9, marginBottom: 4 }}>
        <div style={{ flex: 1, background: "#EDF2E4", borderRadius: 12, padding: "11px 12px" }}>
          <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.03em", textTransform: "uppercase", color: "#6E8158", marginBottom: 4 }}>Tethra is</div>
          <div style={{ fontSize: 11, color: "#54633C", lineHeight: 1.45 }}>A calm space to understand each other and move at the pace of trust.</div>
        </div>
        <div style={{ flex: 1, background: "#F3ECEF", borderRadius: 12, padding: "11px 12px" }}>
          <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.03em", textTransform: "uppercase", color: "#9C5F77", marginBottom: 4 }}>Tethra isn&rsquo;t</div>
          <div style={{ fontSize: 11, color: "#8C5570", lineHeight: 1.45 }}>A dating app, a scorecard, or a substitute for therapy.</div>
        </div>
      </div>

      {GROUPS.map((g, gi) => (
        <div key={g.title}>
          <p className="eyebrow" style={{ margin: "18px 0 9px" }}>{g.title}</p>
          <div style={{ background: "#FFFFFF", border: "1px solid var(--line, #ECE4DE)", borderRadius: 12, overflow: "hidden" }}>
            {g.items.map((it, ii) => {
              const key = `${gi}-${ii}`;
              const isOpen = open === key;
              return (
                <div key={key}>
                  {ii > 0 && <div style={{ height: 1, background: "#F1EAE4", margin: "0 14px" }} />}
                  <button onClick={() => setOpen(isOpen ? null : key)} aria-expanded={isOpen}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, width: "100%", background: "none", border: "none", cursor: "pointer", padding: "13px 14px", textAlign: "left" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#3F2A4C" }}>{it.q}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B7ABBE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: "none", transition: "transform .18s ease", transform: isOpen ? "rotate(180deg)" : "none" }}><path d="M6 9l6 6 6-6" /></svg>
                  </button>
                  {isOpen && (
                    <p style={{ margin: 0, padding: "0 14px 14px", fontSize: 12, color: "#7A6E86", lineHeight: 1.6 }}>{it.a}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="safety-note" style={{ justifyContent: "flex-start", textAlign: "left", marginTop: 18 }}>
        Not therapy or crisis support &middot;{" "}
        <button className="link" onClick={() => nav("/safety")} style={{ padding: 0 }}>Safety resources anytime</button>
      </div>

      <p className="tiny faint center" style={{ marginTop: 14, fontStyle: "italic", lineHeight: 1.55 }}>
        Still curious? Tethra grows one conversation at a time.
      </p>
    </div>
  );
}
