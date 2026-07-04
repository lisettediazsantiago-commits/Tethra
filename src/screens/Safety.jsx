import { IconShield } from "../components/Icons";
import BackBar from "../components/BackBar";

// NOTE FOR THE BUILDER: verify and localize these resources for your users'
// region before launch. The numbers below are long-standing US services shown
// as examples. Replace or add local equivalents as needed.
const RESOURCES = [
  { name: "988 Suicide & Crisis Lifeline (US)", detail: "Call or text 988 \u00b7 24/7" },
  { name: "National Domestic Violence Hotline (US)", detail: "1-800-799-7233 \u00b7 24/7" },
  { name: "RAINN (sexual assault, US)", detail: "1-800-656-4673 \u00b7 24/7" },
];

export default function Safety() {
  return (
    <div className="screen">
      <BackBar fallback="/" />
      <div className="head">
        <div className="emblem" style={{ marginBottom: 12 }}><IconShield width={22} height={22} /></div>
        <h1 className="display">Safety &amp; support</h1>
      </div>

      <div className="card">
        <p className="small" style={{ fontWeight: 500, marginTop: 0 }}>What Tethra is &mdash; and isn&rsquo;t</p>
        <ul className="small muted" style={{ paddingLeft: 18, lineHeight: 1.7, margin: "8px 0 0" }}>
          <li>Tethra is not a replacement for therapy, legal advice, or crisis support.</li>
          <li>Tethra does not guarantee anyone&rsquo;s safety.</li>
          <li>Consent must always be active, mutual, ongoing, and revocable.</li>
          <li>A shared comfort map is not permission.</li>
          <li>Anyone can change their mind at any time.</li>
        </ul>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <p className="small" style={{ fontWeight: 500, marginTop: 0 }}>A &ldquo;yes&rdquo; here is not permanent permission.</p>
        <p className="tiny muted" style={{ marginTop: 6 }}>
          Anything you mark in Tethra is a starting point for conversation. Consent still needs to be
          asked for, and freely given, in the moment.
        </p>
      </div>

      <div className="spacer-sm" />
      <p className="eyebrow" style={{ marginBottom: 8 }}>If you need support now</p>
      {RESOURCES.map((r) => (
        <div className="card" key={r.name} style={{ marginBottom: 10 }}>
          <p className="small" style={{ fontWeight: 500, margin: 0 }}>{r.name}</p>
          <p className="tiny muted" style={{ marginTop: 4 }}>{r.detail}</p>
        </div>
      ))}

      <p className="tiny faint" style={{ marginTop: 14, lineHeight: 1.6 }}>
        Tip: the &ldquo;Quick exit&rdquo; button at the top of every screen leaves Tethra immediately
        for a neutral page.
      </p>
    </div>
  );
}
