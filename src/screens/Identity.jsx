import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import BackBar from "../components/BackBar";
import IdentityAvatar, { SymbolGlyph, SYMBOL_KEYS, SYMBOL_LABEL } from "../components/IdentityAvatar";

const VIS = [
  { key: "everyone", title: "Everyone I connect with", sub: "Anyone you share a space with sees this." },
  { key: "onshare", title: "Only after I choose to share", sub: "Hidden until you show your symbol in a space." },
  { key: "private", title: "Keep private until I\u2019m ready", sub: "You stay as initials until you decide to reveal more." },
];

const markBtn = (on) => ({
  aspectRatio: "1 / 1", borderRadius: "50%", background: "#EFE7F5", color: "#7B5E96",
  border: on ? "2px solid #7B5E96" : "2px solid transparent", cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
});
const visRow = (on) => ({
  display: "flex", gap: 10, alignItems: "flex-start", width: "100%", padding: "11px 12px",
  border: on ? "1px solid #8B6BA6" : "1px solid var(--line, #ECE4DE)", background: on ? "#F7F3FA" : "#FFFFFF",
  borderRadius: 12, marginBottom: 8, cursor: "pointer",
});
const radio = (on) => ({
  width: 16, height: 16, borderRadius: "50%", border: on ? "1.5px solid #8B6BA6" : "1.5px solid #C9BBD4",
  flex: "none", marginTop: 1, display: "flex", alignItems: "center", justifyContent: "center",
});

export default function Identity() {
  const { user } = useAuth();
  const firstName = (user?.displayName || "").split(" ")[0] || "You";
  const [type, setType] = useState("initials");
  const [symbol, setSymbol] = useState("leaf");
  const [visibility, setVisibility] = useState("onshare");
  const [busy, setBusy] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const u = await getDoc(doc(db, "users", user.uid));
        const id = u.exists() ? (u.data().identity || null) : null;
        if (id) {
          setType(id.type || "initials");
          setSymbol(id.symbol || "leaf");
          setVisibility(id.visibility || "onshare");
        }
      } catch { /* keep defaults */ }
    })();
  }, [user]);

  const identity = { type, symbol: type === "symbol" ? symbol : null };
  const modeLabel = type === "symbol" ? `Personal symbol \u00b7 ${SYMBOL_LABEL[symbol].toLowerCase()}` : "Initials";

  async function save() {
    setBusy(true);
    try {
      await setDoc(doc(db, "users", user.uid), {
        identity: { type, symbol: type === "symbol" ? symbol : null, visibility, updatedAt: serverTimestamp() },
      }, { merge: true });
      setSavedFlash(true); setTimeout(() => setSavedFlash(false), 1400);
    } finally { setBusy(false); }
  }

  return (
    <div className="screen">
      <BackBar />
      <div className="head" style={{ textAlign: "center" }}>
        <h1 className="display" style={{ fontSize: 21, lineHeight: 1.3 }}>How would you like others to recognize you?</h1>
        <p className="small muted" style={{ marginTop: 8 }}>
          Choose how you&rsquo;d like to present yourself. You can change this anytime.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "6px 0 18px" }}>
        <IdentityAvatar identity={identity} name={firstName} size={84} />
        <div style={{ fontSize: 15, fontWeight: 600, marginTop: 10, color: "var(--tethra-plum, #4B2E59)" }}>{firstName}</div>
        <div style={{ fontSize: 11.5, color: "#9585A2", marginTop: 2 }}>{modeLabel}</div>
      </div>

      <p className="eyebrow" style={{ marginBottom: 9 }}>Your mark</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 9 }}>
        <button onClick={() => setType("initials")} aria-pressed={type === "initials"} title="Initials" style={markBtn(type === "initials")}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Aa</span>
        </button>
        {SYMBOL_KEYS.map((k) => (
          <button key={k} onClick={() => { setType("symbol"); setSymbol(k); }}
            aria-pressed={type === "symbol" && symbol === k} title={SYMBOL_LABEL[k]} style={markBtn(type === "symbol" && symbol === k)}>
            <SymbolGlyph name={k} size={20} />
          </button>
        ))}
      </div>
      <p className="tiny faint" style={{ marginTop: 8 }}>
        {type === "initials" ? "A simple monogram \u2014 maximum privacy." : "A meaningful symbol that represents you."}
      </p>

      <p className="eyebrow" style={{ margin: "18px 0 9px" }}>Who can see this</p>
      {VIS.map((v) => (
        <button key={v.key} onClick={() => setVisibility(v.key)} aria-pressed={visibility === v.key} style={visRow(visibility === v.key)}>
          <span style={radio(visibility === v.key)}>{visibility === v.key && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#8B6BA6" }} />}</span>
          <span style={{ flex: 1, textAlign: "left" }}>
            <span style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#3F2A4C" }}>{v.title}</span>
            <span style={{ display: "block", fontSize: 11, color: "#8A7C93", marginTop: 1, lineHeight: 1.4 }}>{v.sub}</span>
          </span>
        </button>
      ))}

      <button className="btn btn-primary" style={{ marginTop: 18 }} disabled={busy} onClick={save}>
        {savedFlash ? "Saved" : busy ? "Saving\u2026" : "Save how I\u2019m seen"}
      </button>

      <p className="tiny faint center" style={{ marginTop: 14, lineHeight: 1.55 }}>
        Identity is an extension of consent &mdash; how you&rsquo;re seen can grow as trust does.
      </p>
    </div>
  );
}
