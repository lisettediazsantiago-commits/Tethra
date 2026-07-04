import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { compareLevels } from "../data/content";
import BackBar from "../components/BackBar";

// The "saved conversations" shelf. Items are bookmarked from the Shared space via
// the Save-for-later heart, stored as keys (`domain:cat:item`) on the user's own
// doc. Here we re-read the *current* shared snapshot so each saved card always
// reflects where you both are today — not a frozen copy from when it was saved.
const keyOf = (x) => `${x.cat}:${x.item}`;
const short = (lvl) => (lvl ? lvl.charAt(0).toLowerCase() + lvl.slice(1) : "\u2014");

const parseKey = (k) => {
  const first = k.indexOf(":");
  const rest = k.slice(first + 1);
  const second = rest.indexOf(":");
  return { domain: k.slice(0, first), cat: rest.slice(0, second), item: rest.slice(second + 1) };
};

const SP = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
const box = (s) => ({ width: s, height: s, viewBox: "0 0 24 24" });
const Sprout = ({ s = 16 }) => <svg {...box(s)} {...SP}><path d="M12 20v-7" /><path d="M12 13c0-3 2.2-5 6-5 0 3-2.2 5-6 5z" /><path d="M12 13c0-3-2.2-5-6-5 0 3 2.2 5 6 5z" /></svg>;
const Feather = ({ s = 16 }) => <svg {...box(s)} {...SP}><path d="M4 20l9-9" /><path d="M13 3a6 6 0 016 6c0 4.5-4 8-9 8H6l-2 2v-4c0-5 4.5-12 9-12z" /></svg>;
const Check = ({ s = 16 }) => <svg {...box(s)} {...SP}><path d="M4 12.5l5 5 11-11" /></svg>;
const Bulb = ({ s = 14 }) => <svg {...box(s)} {...SP}><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 00-3.5 10.9c.6.5.9 1.2.9 1.9v.2h5.2v-.2c0-.7.3-1.4.9-1.9A6 6 0 0012 3z" /></svg>;
const Heart = ({ s = 18, filled }) => <svg {...box(s)} {...SP} fill={filled ? "currentColor" : "none"}><path d="M12 20S4 15 4 9a4 4 0 018-1 4 4 0 018 1c0 6-8 11-8 11z" /></svg>;
const ChevR = ({ s = 15 }) => <svg {...box(s)} {...SP}><path d="M9 6l6 6-6 6" /></svg>;

const KIND = {
  talk: { accent: "#8CB064", border: "#E7ECDD", tint: "#EDF3E2", iconInk: "#5E7B39", icon: <Sprout />, prompt: "Try: start with curiosity. Ask. Listen.", pIcon: <Bulb />, pInk: "#C9A24B", pBg: "#F5F1EC", link: "#7B5E96" },
  slow: { accent: "#D6A0B3", border: "#F0DEE6", tint: "#FBECF0", iconInk: "#B06C85", icon: <Feather />, prompt: "When you\u2019re both ready. No rush at all.", pIcon: <Heart s={13} />, pInk: "#CDA0B1", pBg: "#FBF3F6", link: "#9C5F77" },
};

export default function Saved() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState([]);
  const [space, setSpace] = useState(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const u = await getDoc(doc(db, "users", user.uid));
        setSaved(u.exists() ? (u.data().savedConversations || []) : []);
        const id = u.exists() ? (u.data().sharedSpaceId || null) : null;
        if (id) {
          const snap = await getDoc(doc(db, "sharedSpaces", id));
          if (snap.exists()) setSpace(snap.data());
        }
      } catch { /* leave empty */ }
      setReady(true);
    })();
  }, [user]);

  function removeSaved(k) {
    setSaved((cur) => {
      const next = cur.filter((x) => x !== k);
      if (user) setDoc(doc(db, "users", user.uid), { savedConversations: next }, { merge: true }).catch(() => {});
      return next;
    });
  }

  // Build a lookup of each shared item's CURRENT comparison, keyed by full save key.
  let partnerName = "your partner";
  const current = {};
  if (space && user && space.status === "active" && space.invitedUserId) {
    const partnerUid = space.createdBy === user.uid ? space.invitedUserId : space.createdBy;
    const me = space.members?.[user.uid] || { comfort: [], intimacy: [] };
    const them = space.members?.[partnerUid] || { comfort: [], intimacy: [], name: "your partner" };
    partnerName = them.name || "your partner";

    const cKeys = new Set([...(me.comfort || []).map(keyOf), ...(them.comfort || []).map(keyOf)]);
    cKeys.forEach((k) => {
      const cut = k.indexOf(":");
      const cat = k.slice(0, cut), item = k.slice(cut + 1);
      const mine = (me.comfort || []).find((x) => keyOf(x) === k);
      const theirs = (them.comfort || []).find((x) => keyOf(x) === k);
      if (mine && theirs) {
        current[`comfort:${k}`] = { state: compareLevels(mine.level, theirs.level).state, you: mine.level || "", them: theirs.level || "", domain: "comfort", item, cat };
      } else {
        current[`comfort:${k}`] = { state: "waiting", you: "", them: "", domain: "comfort", item, cat };
      }
    });

    const iBoth = (me.intimacy || []).filter((x) => (them.intimacy || []).some((y) => keyOf(y) === keyOf(x)));
    iBoth.forEach((x) => {
      const theirs = (them.intimacy || []).find((y) => keyOf(y) === keyOf(x));
      const same = x.state && theirs.state && x.state === theirs.state;
      current[`intimacy:${keyOf(x)}`] = { state: same ? "shared" : "talk", you: x.state || "", them: theirs.state || "", domain: "intimacy", item: x.item, cat: x.cat };
    });
  }

  const entries = saved.map((k) => {
    const cur = current[k];
    if (cur) return { k, ...cur, live: cur.state === "talk" || cur.state === "slow" || cur.state === "shared" };
    return { k, ...parseKey(k), state: "stale", live: false };
  });

  const talk = entries.filter((e) => e.state === "talk");
  const slow = entries.filter((e) => e.state === "slow");
  const aligned = entries.filter((e) => e.state === "shared");
  const parked = entries.filter((e) => e.state === "waiting" || e.state === "stale");

  const Group = ({ dot, ink, label, children }) => (
    <div style={{ marginTop: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, margin: "0 2px 8px" }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: dot }} />
        <span style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: ink }}>{label}</span>
      </div>
      {children}
    </div>
  );

  const LiveCard = ({ e }) => {
    const kind = KIND[e.state];
    return (
      <div style={{ background: "#FFFFFF", border: `1px solid ${kind.border}`, borderLeft: `4px solid ${kind.accent}`, borderRadius: "0 14px 14px 0", padding: "13px 14px", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 11 }}>
          <span style={{ width: 30, height: 30, borderRadius: "50%", background: kind.tint, color: kind.iconInk, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{kind.icon}</span>
          <span style={{ flex: 1 }}>
            <span style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#4B2E59" }}>{e.item}</span>
            <span style={{ display: "block", fontSize: 11.5, color: "#8A7C93", marginTop: 2 }}>You: {short(e.you)} &middot; {partnerName}: {short(e.them)}</span>
          </span>
          <button onClick={() => removeSaved(e.k)} aria-label="Remove from saved" style={{ background: "none", border: "none", cursor: "pointer", color: "#C07E93", flex: "none", padding: 2 }}><Heart s={18} filled /></button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#8A7C93", marginTop: 10, background: kind.pBg, borderRadius: 9, padding: "8px 10px", lineHeight: 1.4 }}>
          <span style={{ color: kind.pInk, flex: "none", display: "flex" }}>{kind.pIcon}</span>{kind.prompt}
        </div>
        <button onClick={() => nav("/app/shared")} style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4, width: "100%", background: "none", border: "none", cursor: "pointer", fontSize: 11.5, fontWeight: 600, color: kind.link, marginTop: 10, padding: 0 }}>
          Open in shared space<ChevR />
        </button>
      </div>
    );
  };

  const AlignedCard = ({ e }) => (
    <div style={{ background: "#FFFFFF", border: "1px solid #ECE4DE", borderLeft: "4px solid #8FA87E", borderRadius: "0 14px 14px 0", padding: "13px 14px", marginBottom: 10 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 11 }}>
        <span style={{ width: 30, height: 30, borderRadius: "50%", background: "#EDF2E4", color: "#6E8158", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Check /></span>
        <span style={{ flex: 1 }}>
          <span style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#4B2E59" }}>{e.item}</span>
          <span style={{ display: "block", fontSize: 11.5, color: "#8A7C93", marginTop: 2, lineHeight: 1.4 }}>You&rsquo;re both here now &mdash; {short(e.you)}. A nice place to have landed.</span>
        </span>
        <button onClick={() => removeSaved(e.k)} aria-label="Remove from saved" style={{ background: "none", border: "none", cursor: "pointer", color: "#C07E93", flex: "none", padding: 2 }}><Heart s={18} filled /></button>
      </div>
    </div>
  );

  const ParkedCard = ({ e }) => (
    <div style={{ background: "#FBFAFB", border: "1px dashed #E1DAE6", borderRadius: 14, padding: "12px 14px", marginBottom: 10 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 11 }}>
        <span style={{ width: 30, height: 30, borderRadius: "50%", background: "#EFEAF3", color: "#A197AC", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Heart s={15} /></span>
        <span style={{ flex: 1 }}>
          <span style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#7A7085" }}>{e.item}</span>
          <span style={{ display: "block", fontSize: 11.5, color: "#A197AC", marginTop: 2, lineHeight: 1.4 }}>
            {e.state === "waiting" ? "One of you hasn\u2019t shared this yet." : "Not in your shared space right now."}
          </span>
        </span>
        <button onClick={() => removeSaved(e.k)} aria-label="Remove from saved" style={{ background: "none", border: "none", cursor: "pointer", color: "#B4A9BE", flex: "none", padding: 2 }}><Heart s={18} filled /></button>
      </div>
    </div>
  );

  return (
    <div className="screen">
      <BackBar />
      <div className="head">
        <h1 className="display">Saved conversations</h1>
        <p className="small muted" style={{ marginTop: 6 }}>
          Areas you&rsquo;ve kept to come back to &mdash; no pressure, no timeline.
        </p>
      </div>

      {!ready ? null : saved.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "26px 20px" }}>
          <span style={{ display: "inline-flex", width: 48, height: 48, borderRadius: "50%", background: "#F0E9F6", color: "#9375B4", alignItems: "center", justifyContent: "center", marginBottom: 12 }}><Heart s={24} /></span>
          <p className="small" style={{ fontWeight: 600, margin: 0, color: "var(--tethra-plum, #4B2E59)" }}>Nothing saved yet</p>
          <p className="tiny muted" style={{ marginTop: 6, lineHeight: 1.55 }}>
            When a difference feels worth revisiting, tap the heart on its card and it&rsquo;ll wait for you here.
          </p>
          <button className="btn btn-outline" style={{ marginTop: 14 }} onClick={() => nav("/app/shared")}>
            Go to shared space
          </button>
        </div>
      ) : (
        <>
          {talk.length > 0 && <Group dot="#7FA05A" ink="#6E8355" label="Worth a conversation">{talk.map((e) => <LiveCard key={e.k} e={e} />)}</Group>}
          {slow.length > 0 && <Group dot="#D6A0B3" ink="#B07E90" label="Ease into gently">{slow.map((e) => <LiveCard key={e.k} e={e} />)}</Group>}
          {aligned.length > 0 && <Group dot="#8FA87E" ink="#7C8A6C" label="Now growing together">{aligned.map((e) => <AlignedCard key={e.k} e={e} />)}</Group>}
          {parked.length > 0 && <Group dot="#B4A9BE" ink="#9A8FA0" label="Parked for now">{parked.map((e) => <ParkedCard key={e.k} e={e} />)}</Group>}
        </>
      )}
    </div>
  );
}
