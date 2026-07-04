import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import Icon from "../components/Icon";
import { QuietGlyph } from "../components/GlyphIcons";
import BackBar from "../components/BackBar";

// Connection Preferences — Tethra's take on "notifications." Everything here is
// framed as a gentle invitation, never an alarm. This screen stores intent; the
// invitations themselves surface quietly in-app (see Dashboard). Guiding line:
// "Tethra should never interrupt a relationship. It should gently support one."

export const PREF_DEFAULTS = {
  cadence: "checkin",
  reflectionFreq: "ai",
  conversationInvites: true,
  milestones: { newUnderstanding: true, revisit: false, bothMaps: true, garden: true },
  season: null,
  voice: "gentle",
  quiet: { active: false, reason: null },
};

const CADENCE = [
  { k: "onopen", t: "Only when I open the app" },
  { k: "occasional", t: "Occasionally remind me" },
  { k: "checkin", t: "Check in from time to time" },
  { k: "habits", t: "Help me build consistent habits" },
];
const FREQ = [
  { k: "never", t: "Never" }, { k: "weekly", t: "Weekly" }, { k: "biweekly", t: "Every other week" },
  { k: "monthly", t: "Monthly" }, { k: "ai", t: "Let Tethra decide" },
];
const MILESTONES = [
  { k: "newUnderstanding", t: "We reach a new shared understanding" },
  { k: "revisit", t: "We revisit an old topic" },
  { k: "bothMaps", t: "We both update our Comfort Maps" },
  { k: "garden", t: "We reach a new Trust Garden milestone" },
];
const SEASONS = [
  { k: "getting-to-know", t: "Just getting to know each other" }, { k: "growing", t: "Growing together" },
  { k: "long-term", t: "Long-term" }, { k: "engaged", t: "Engaged" }, { k: "married", t: "Married" },
  { k: "rebuilding", t: "Rebuilding trust" }, { k: "taking-space", t: "Taking space" },
];
export const VOICE = [
  { k: "gentle", t: "Gentle", sample: "Whenever you\u2019re ready\u2026" },
  { k: "encouraging", t: "Encouraging", sample: "A small conversation today could strengthen tomorrow." },
  { k: "reflective", t: "Reflective", sample: "Growth often begins with curiosity." },
  { k: "minimal", t: "Minimal", sample: "Only the invitations that matter." },
];
const QUIET_REASONS = ["Vacation", "Busy season", "Grieving", "Taking space", "Until I turn them back on"];

const reflectionPreview = (voice) => ({
  gentle: "A quiet moment might be waiting for you whenever you\u2019re ready.",
  encouraging: "A small reflection today could strengthen tomorrow.",
  reflective: "Growth often begins with curiosity \u2014 a reflection is here when it feels right.",
  minimal: "A reflection is waiting.",
}[voice] || "A quiet moment might be waiting for you whenever you\u2019re ready.");

const chip = (on) => ({
  cursor: "pointer", fontSize: 11.5, fontWeight: 500, borderRadius: 20, padding: "6px 12px",
  border: on ? "1px solid #B79FCB" : "1px solid #E4DAEC", background: on ? "#EFE7F5" : "#FFFFFF", color: on ? "#5A4472" : "#6E6178",
});
const row = (on) => ({
  display: "flex", gap: 10, alignItems: "flex-start", width: "100%", padding: "11px 12px",
  border: on ? "1px solid #8B6BA6" : "1px solid var(--line, #ECE4DE)", background: on ? "#F7F3FA" : "#FFFFFF",
  borderRadius: 12, marginBottom: 7, cursor: "pointer", textAlign: "left",
});
const dot = (on) => ({
  width: 16, height: 16, borderRadius: "50%", border: on ? "1.5px solid #8B6BA6" : "1.5px solid #C9BBD4",
  flex: "none", marginTop: 1, display: "flex", alignItems: "center", justifyContent: "center",
});

export default function ConnectionPreferences() {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState(PREF_DEFAULTS);
  const [status, setStatus] = useState("");
  const [showQuiet, setShowQuiet] = useState(false);

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, "users", user.uid)).then((u) => {
      const p = u.exists() ? u.data().connectionPrefs : null;
      if (p) setPrefs({ ...PREF_DEFAULTS, ...p, milestones: { ...PREF_DEFAULTS.milestones, ...(p.milestones || {}) }, quiet: { ...PREF_DEFAULTS.quiet, ...(p.quiet || {}) } });
    }).catch(() => {});
  }, [user]);

  function update(patch) {
    setPrefs((p) => {
      const next = { ...p, ...patch };
      if (user) setDoc(doc(db, "users", user.uid), { connectionPrefs: next }, { merge: true }).catch(() => {});
      return next;
    });
    setStatus("Saved");
    setTimeout(() => setStatus(""), 1300);
  }
  const toggleMilestone = (k) => update({ milestones: { ...prefs.milestones, [k]: !prefs.milestones[k] } });
  const startQuiet = (reason) => { update({ quiet: { active: true, reason } }); setShowQuiet(false); };
  const endQuiet = () => update({ quiet: { active: false, reason: null } });

  const Head = ({ icon, glyph, title, right }) => (
    <div className="rowico" style={{ marginTop: 20, marginBottom: 9 }}>
      {glyph ? <span style={{ color: "#8272A0", display: "flex", flex: "none" }}>{glyph}</span> : <Icon name={icon} size={26} />}
      <span className="small" style={{ fontWeight: 600, flex: 1 }}>{title}</span>
      {right}
    </div>
  );

  return (
    <div className="screen">
      <BackBar />
      <div className="head">
        <h1 className="display">Connection preferences</h1>
        <p className="small muted" style={{ marginTop: 6 }}>
          Tethra never interrupts &mdash; it gently supports. Choose how it shows up.
        </p>
      </div>

      <Head icon="gentle-reminder" title="How Tethra shows up" />
      {CADENCE.map((c) => (
        <button key={c.k} onClick={() => update({ cadence: c.k })} aria-pressed={prefs.cadence === c.k} style={row(prefs.cadence === c.k)}>
          <span style={dot(prefs.cadence === c.k)}>{prefs.cadence === c.k && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#8B6BA6" }} />}</span>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: "#3F2A4C" }}>{c.t}</span>
        </button>
      ))}

      <Head icon="reflection" title="Reflection invitations" />
      <div style={{ display: "flex", gap: 8, alignItems: "flex-start", background: "#EFF4E7", borderRadius: 11, padding: "10px 12px", fontSize: 11.5, color: "#54633C", lineHeight: 1.45 }}>
        <Icon name="reflection" size={18} />
        <span>{reflectionPreview(prefs.voice)}</span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 10 }}>
        {FREQ.map((f) => (
          <button key={f.k} onClick={() => update({ reflectionFreq: f.k })} aria-pressed={prefs.reflectionFreq === f.k} style={chip(prefs.reflectionFreq === f.k)}>{f.t}</button>
        ))}
      </div>

      <Head icon="conversations" title="Conversation invitations" right={
        <button role="switch" aria-checked={prefs.conversationInvites} aria-label="Conversation invitations"
          onClick={() => update({ conversationInvites: !prefs.conversationInvites })}
          style={{ width: 38, height: 22, borderRadius: 12, border: "none", cursor: "pointer", position: "relative", flex: "none", background: prefs.conversationInvites ? "#8B6BA6" : "#DFD6E7", padding: 0 }}>
          <span style={{ position: "absolute", top: 2, left: prefs.conversationInvites ? 18 : 2, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left .15s" }} />
        </button>
      } />
      <p className="tiny muted" style={{ margin: "-2px 2px 8px", lineHeight: 1.45 }}>
        When Tethra notices a conversation that might be meaningful for you both.
      </p>
      <div style={{ display: "flex", gap: 8, alignItems: "flex-start", background: "#F0E9F6", borderRadius: 11, padding: "10px 12px", fontSize: 11.5, color: "#5A4472", lineHeight: 1.45, opacity: prefs.conversationInvites ? 1 : 0.5 }}>
        <Icon name="conversations" size={18} />
        <span>A conversation about emotional safety might be helpful this week.</span>
      </div>

      <Head icon="milestone" title="Milestones" />
      <div style={{ background: "#FFFFFF", border: "1px solid #ECE4DE", borderRadius: 12, overflow: "hidden" }}>
        {MILESTONES.map((m, i) => {
          const on = !!prefs.milestones[m.k];
          return (
            <div key={m.k}>
              {i > 0 && <div style={{ height: 1, background: "#F1EAE4", margin: "0 12px" }} />}
              <button onClick={() => toggleMilestone(m.k)} aria-pressed={on} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", background: "none", border: "none", cursor: "pointer", padding: "11px 12px", textAlign: "left" }}>
                <span style={{ width: 18, height: 18, borderRadius: 6, border: on ? "1.5px solid #8B6BA6" : "1.5px solid #C9BBD4", background: on ? "#8B6BA6" : "transparent", color: "#fff", flex: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {on && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12.5l5 5 11-11" /></svg>}
                </span>
                <span style={{ fontSize: 12.5, flex: 1, color: "#3F2A4C" }}>{m.t}</span>
              </button>
            </div>
          );
        })}
      </div>

      <Head icon="growth" title="Your season" />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
        {SEASONS.map((s) => (
          <button key={s.k} onClick={() => update({ season: prefs.season === s.k ? null : s.k })} aria-pressed={prefs.season === s.k} style={chip(prefs.season === s.k)}>{s.t}</button>
        ))}
      </div>
      <p className="tiny faint" style={{ marginTop: 8, lineHeight: 1.45 }}>
        Your season gently shapes the pace &mdash; no two relationships move alike.
      </p>

      <Head icon="thoughts" title="Tethra&rsquo;s voice" />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 9 }}>
        {VOICE.map((v) => (
          <button key={v.k} onClick={() => update({ voice: v.k })} aria-pressed={prefs.voice === v.k} style={chip(prefs.voice === v.k)}>{v.t}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "flex-start", background: "#F5F1EC", borderRadius: 11, padding: "10px 12px", fontSize: 11.5, color: "#7A6E86", lineHeight: 1.45, fontStyle: "italic" }}>
        <Icon name="thoughts" size={18} />
        <span>{(VOICE.find((v) => v.k === prefs.voice) || VOICE[0]).sample}</span>
      </div>

      <Head glyph={<QuietGlyph size={24} />} title="Quiet mode" />
      <div style={{ background: "#FBF9FC", border: "1px solid #E7DFEF", borderRadius: 12, padding: "13px 14px" }}>
        {prefs.quiet.active ? (
          <>
            <p className="small" style={{ fontWeight: 600, margin: 0, color: "#5A4472" }}>Invitations paused</p>
            <p className="tiny muted" style={{ marginTop: 4, lineHeight: 1.5 }}>
              {prefs.quiet.reason ? `${prefs.quiet.reason} \u2014 they'll wait quietly until you're ready.` : "They'll wait quietly until you're ready."}
            </p>
            <button className="btn btn-outline" style={{ marginTop: 11 }} onClick={endQuiet}>Resume invitations</button>
          </>
        ) : showQuiet ? (
          <>
            <p className="tiny muted" style={{ margin: "0 0 9px", lineHeight: 1.5 }}>What are you pausing for? This only shapes the tone &mdash; no reason is needed.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {QUIET_REASONS.map((r) => (
                <button key={r} onClick={() => startQuiet(r)} style={chip(false)}>{r}</button>
              ))}
            </div>
            <button className="link" style={{ marginTop: 10 }} onClick={() => setShowQuiet(false)}>Cancel</button>
          </>
        ) : (
          <>
            <p className="tiny muted" style={{ margin: 0, lineHeight: 1.5 }}>
              Pause invitations for a while &mdash; a vacation, a busy season, grief, or just taking space. They wait quietly until you turn them back on.
            </p>
            <button className="btn btn-outline" style={{ marginTop: 11 }} onClick={() => setShowQuiet(true)}>Pause invitations</button>
          </>
        )}
      </div>

      <p className="tiny faint center" style={{ marginTop: 18, fontStyle: "italic", lineHeight: 1.55 }}>
        Tethra should never interrupt a relationship. It should gently support one.
      </p>
      <p className="tiny faint center" style={{ marginTop: 8, minHeight: 16 }}>{status}</p>
    </div>
  );
}
