import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { compareLevels, COMFORT_LEVELS, UNSURE, sharedStarter, intimacyStarter } from "../data/content";
import { IconShield } from "../components/Icons";
import Icon from "../components/Icon";
import IdentityAvatar from "../components/IdentityAvatar";
import BackBar from "../components/BackBar";

// Two-party shared spaces. The document id IS the invite code. Each person's RAW
// comfort/intimacy maps stay owner-locked — the only cross-user data is a snapshot
// of the fields each person chose to share, copied in by that person.
const CODE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const makeCode = () => Array.from({ length: 7 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join("");
const keyOf = (x) => `${x.cat}:${x.item}`;
const splitKey = (k) => { const i = k.indexOf(":"); return [k.slice(0, i), k.slice(i + 1)]; };

// A gentle, faithful one-line form of a level/state for collapsed hints.
const short = (lvl) => (lvl ? lvl.charAt(0).toLowerCase() + lvl.slice(1) : "\u2014");

// Aligned-but-cautious: both partners agree on a low comfort level. That's
// alignment, not ease — so we tag it gently and warm the marker rather than
// showing a green all-clear. (Comfort items only; intimacy has no ranked scale.)
const CAUTIOUS_LEVELS = new Set(["Not comfortable", "Maybe later"]);
const isCautiousAligned = (r) => r.state === "shared" && r.domain === "comfort" && CAUTIOUS_LEVELS.has(r.you);

// Which of two comfort levels is more cautious (lower on the spectrum; "unsure"
// counts as most exploratory). Returns "a" | "b" | "equal".
function moreCautious(a, b) {
  const ia = a === UNSURE ? -1 : COMFORT_LEVELS.indexOf(a);
  const ib = b === UNSURE ? -1 : COMFORT_LEVELS.indexOf(b);
  if (ia === ib) return "equal";
  return ia < ib ? "a" : "b";
}

// Level-driven, generic "how each of you approaches this" lines. Never scripts the
// other person — just names a gentle style based on who's more cautious. Returns
// [{line, sub, kind}] cautious-first, or null if we can't tell (missing/equal).
function approachLines(mine, theirs, partnerName) {
  if (!mine || !theirs) return null;
  const who = moreCautious(mine, theirs);
  if (who === "equal") return null;
  const cautious = who === "a" ? "You" : partnerName;
  const ready = who === "a" ? partnerName : "You";
  const youCautious = cautious === "You";
  const youReady = ready === "You";
  return [
    {
      kind: "ease",
      line: youCautious ? "You like to ease into this." : `${cautious} likes to ease into this.`,
      sub: youCautious ? "A little more time helps you feel ready." : `A little more time helps ${cautious} feel ready.`,
    },
    {
      kind: "ready",
      line: youReady ? "You feel more ready here." : `${ready} feels more ready here.`,
      sub: youReady ? "You\u2019re open to leaning in a little." : `${ready} is open to leaning in a little.`,
    },
  ];
}

async function buildSnapshot(uid, name) {
  const [c, i, u] = await Promise.all([
    getDoc(doc(db, "comfortMaps", uid)),
    getDoc(doc(db, "intimacyMaps", uid)),
    getDoc(doc(db, "users", uid)),
  ]);
  const cItems = c.exists() ? (c.data().items || {}) : {};
  const iItems = i.exists() ? (i.data().items || {}) : {};
  const comfort = Object.entries(cItems).filter(([, e]) => e && e.share)
    .map(([k, e]) => { const [cat, item] = splitKey(k); return { cat, item, level: e.level || "", whatHelps: e.whatHelps || "" }; });
  const intimacy = Object.entries(iItems).filter(([, e]) => e && e.visibility === "partner")
    .map(([k, e]) => { const [cat, item] = splitKey(k); return { cat, item, state: e.state || "" }; });
  // Identity is copied in ONLY when the person's visibility allows it, so a
  // partner literally never receives a hidden symbol. "private" is never sent;
  // "onshare" is sent only once they've revealed it in this space.
  const ud = u.exists() ? u.data() : {};
  const id = ud.identity || null;
  const showId = id && id.type === "symbol" && id.symbol &&
    (id.visibility === "everyone" || (id.visibility === "onshare" && ud.profileRevealed));
  return {
    name: name || "Your partner", comfort, intimacy,
    identity: showId ? { type: "symbol", symbol: id.symbol } : null,
    sharedAt: Date.now(),
  };
}

// Tiny inline icons (stroke, inherit color + size).
const SP = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
const box = (s) => ({ width: s, height: s, viewBox: "0 0 24 24" });
const Check = ({ s = 16 }) => <svg {...box(s)} {...SP}><path d="M4 12.5l5 5 11-11" /></svg>;
const Sprout = ({ s = 15 }) => <svg {...box(s)} {...SP}><path d="M12 20v-7" /><path d="M12 13c0-3 2.2-5 6-5 0 3-2.2 5-6 5z" /><path d="M12 13c0-3-2.2-5-6-5 0 3 2.2 5 6 5z" /></svg>;
const Feather = ({ s = 16 }) => <svg {...box(s)} {...SP}><path d="M4 20l9-9" /><path d="M13 3a6 6 0 016 6c0 4.5-4 8-9 8H6l-2 2v-4c0-5 4.5-12 9-12z" /></svg>;
const Msg = ({ s = 15 }) => <svg {...box(s)} {...SP}><path d="M21 11.5a8 8 0 01-11.5 7.2L4 20l1.3-5A8 8 0 1121 11.5z" /></svg>;
const LockOpen = ({ s = 15 }) => <svg {...box(s)} {...SP}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V7a4 4 0 017.9-.9" /></svg>;
const Heart = ({ s = 13, filled }) => <svg {...box(s)} {...SP} fill={filled ? "currentColor" : "none"}><path d="M12 20S4 15 4 9a4 4 0 018-1 4 4 0 018 1c0 6-8 11-8 11z" /></svg>;
const HandsHeart = ({ s = 18 }) => <svg {...box(s)} {...SP}><path d="M12 10s-3-2.2-3-4.2A2 2 0 0112 4a2 2 0 013 1.8C15 7.8 12 10 12 10z" /><path d="M4 13l4 4 4-1 4 1 4-4" /><path d="M2 12l3 3M22 12l-3 3" /></svg>;
const Bulb = ({ s = 15 }) => <svg {...box(s)} {...SP}><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 00-3.5 10.9c.6.5.9 1.2.9 1.9v.2h5.2v-.2c0-.7.3-1.4.9-1.9A6 6 0 0012 3z" /></svg>;
const Hourglass = ({ s = 17 }) => <svg {...box(s)} {...SP}><path d="M6 3h12M6 21h12" /><path d="M8 3c0 4 8 5 8 9s-8 5-8 9M16 3c0 4-8 5-8 9s8 5 8 9" /></svg>;
const Chevron = ({ open }) => <svg {...box(16)} {...SP} style={{ color: "#C6BACD", transition: "transform .18s ease", transform: open ? "rotate(90deg)" : "none", flex: "none" }}><path d="M9 6l6 6-6 6" /></svg>;

// The four gentle buckets, in reading order.
const GROUPS = [
  { state: "shared",  label: "Growing together",     dot: "#8FA87E", tint: "#EDF2E4", iconInk: "#6E8158", labelInk: "#7C8A6C", icon: (p) => <Check {...p} />,    accent: null },
  { state: "talk",    label: "Worth a conversation", dot: "#7FA05A", tint: "#EDF3E2", iconInk: "#5E7B39", labelInk: "#6E8355", icon: (p) => <Sprout {...p} />,   accent: "#8CB064" },
  { state: "slow",    label: "Ease into gently",     dot: "#D6A0B3", tint: "#FBECF0", iconInk: "#B06C85", labelInk: "#B07E90", icon: (p) => <Feather {...p} />,  accent: "#D6A0B3" },
  { state: "waiting", label: "Waiting on you",       dot: "#A98BC0", tint: "#EFE8F5", iconInk: "#8E73A8", labelInk: "#9781AB", icon: (p) => <LockOpen {...p} />, accent: null },
];

// A gentle horizon, not a paywall. Sits below the one active space to preview
// where Tethra is heading — additional Shared Spaces for other relationships —
// without any "coming soon" urgency. Non-interactive by design.
const FUTURE_SPACES = [
  { label: "Partner", icon: (p) => <svg {...box(p)} {...SP}><path d="M12 20S4 15 4 9a4 4 0 018-1 4 4 0 018 1c0 6-8 11-8 11z" /></svg> },
  { label: "Best friend", icon: (p) => <svg {...box(p)} {...SP}><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.3" /><path d="M4 19a5 5 0 0110 0M14.5 19a4.5 4.5 0 016 0" /></svg> },
  { label: "Family", icon: (p) => <svg {...box(p)} {...SP}><path d="M4 11l8-6 8 6" /><path d="M6 10.5V19h12v-8.5" /><path d="M12 19v-4a1.7 1.7 0 013.3 0V19" /></svg> },
  { label: "Mentor", icon: (p) => <svg {...box(p)} {...SP}><circle cx="12" cy="12" r="8" /><path d="M12 7.2l1.6 4.4 4.4 1.6-4.4 1.6L12 19l-1.6-4.2L6 13.2l4.4-1.6z" /></svg> },
  { label: "Close friend", icon: (p) => <svg {...box(p)} {...SP}><path d="M12 10s-3-2.2-3-4.2A2 2 0 0112 4a2 2 0 013 1.8C15 7.8 12 10 12 10z" /><path d="M4 13l4 4 4-1 4 1 4-4" /><path d="M2 12l3 3M22 12l-3 3" /></svg> },
];

function LookingAhead() {
  const card = {
    border: "1.5px dashed #DDD0E8", borderRadius: 14, padding: "14px 12px",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: 0.62,
  };
  return (
    <div style={{ marginTop: 22 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
        <span style={{ width: 28, height: 28, borderRadius: "50%", background: "#EDF2E4", color: "#6E8158", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Sprout s={16} /></span>
        <span style={{ fontSize: 15, fontWeight: 600, color: "#4B2E59" }}>Looking ahead</span>
      </div>
      <p style={{ fontSize: 12.5, color: "#7A6E86", lineHeight: 1.6, margin: 0 }}>
        Tethra begins with one relationship because understanding takes time. As Tethra grows, you&rsquo;ll be
        able to create Shared Spaces for other meaningful relationships &mdash; friends, family, mentors, and more.
      </p>
      <p style={{ fontSize: 12.5, color: "#7A6E86", lineHeight: 1.6, margin: "10px 0 0" }}>
        For now, we&rsquo;re focused on helping you build one relationship well.
      </p>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", margin: "20px 2px 11px" }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: "#9585A2" }}>Future Shared Spaces</span>
        <span style={{ fontSize: 10.5, color: "#B4A9BE", fontStyle: "italic" }}>Coming in a future update</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
        {FUTURE_SPACES.map((s, i) => (
          <div key={s.label} aria-hidden="true" style={{ ...card, gridColumn: i === FUTURE_SPACES.length - 1 && FUTURE_SPACES.length % 2 ? "1 / -1" : "auto" }}>
            <span style={{ width: 38, height: 38, borderRadius: "50%", background: "#F1E9F6", color: "#9375B4", display: "flex", alignItems: "center", justifyContent: "center" }}>{s.icon(19)}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#5A4472" }}>{s.label}</span>
          </div>
        ))}
      </div>
      <p style={{ textAlign: "center", fontSize: 11, color: "#9585A2", fontStyle: "italic", lineHeight: 1.55, margin: "18px 8px 0" }}>
        Every relationship deserves its own story.
      </p>
    </div>
  );
}

export default function SharedSpace() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [ready, setReady] = useState(false);
  const [space, setSpace] = useState(null);
  const [spaceId, setSpaceId] = useState(null);
  const [codeInput, setCodeInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [openKey, setOpenKey] = useState(null);
  const [saved, setSaved] = useState([]);
  const [myIdentity, setMyIdentity] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);

  function copyLine(key, text) {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey((c) => (c === key ? null : c)), 1600);
    }).catch(() => {});
  }

  const firstName = (user?.displayName || "").split(" ")[0] || "You";

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const u = await getDoc(doc(db, "users", user.uid));
        setSaved(u.exists() ? (u.data().savedConversations || []) : []);
        setMyIdentity(u.exists() ? (u.data().identity || null) : null);
        setRevealed(u.exists() ? !!u.data().profileRevealed : false);
        const id = u.exists() ? (u.data().sharedSpaceId || null) : null;
        setSpaceId(id);
        if (id) {
          const snap = await getDoc(doc(db, "sharedSpaces", id));
          if (snap.exists()) {
            let s = snap.data();
            const amMember = s.createdBy === user.uid || s.invitedUserId === user.uid;
            if (amMember) {
              const name = (user.displayName || "").split(" ")[0] || "You";
              const mine = await buildSnapshot(user.uid, name);
              try {
                await updateDoc(doc(db, "sharedSpaces", id), { [`members.${user.uid}`]: mine, updatedAt: serverTimestamp() });
                s = { ...s, members: { ...(s.members || {}), [user.uid]: mine } };
              } catch { /* keep stored snapshot if the sync write fails */ }
            }
            setSpace(s);
          } else setSpaceId(null);
        }
      } catch { /* leave unconnected */ }
      setReady(true);
    })();
  }, [user]);

  async function createInvite() {
    setBusy(true); setErr("");
    try {
      const code = makeCode();
      const mine = await buildSnapshot(user.uid, firstName);
      const data = {
        code, createdBy: user.uid, invitedUserId: null, status: "pending",
        members: { [user.uid]: mine },
        createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
      };
      await setDoc(doc(db, "sharedSpaces", code), data);
      await setDoc(doc(db, "users", user.uid), { sharedSpaceId: code }, { merge: true });
      setSpaceId(code); setSpace(data);
    } catch { setErr("Couldn\u2019t create an invite. Please try again."); }
    finally { setBusy(false); }
  }

  async function joinWithCode() {
    const code = codeInput.trim().toUpperCase();
    if (!code) return;
    setBusy(true); setErr("");
    try {
      const ref = doc(db, "sharedSpaces", code);
      const snap = await getDoc(ref);
      if (!snap.exists()) { setErr("We couldn\u2019t find that code. Double-check it with your partner."); setBusy(false); return; }
      const s = snap.data();
      if (s.createdBy === user.uid) { setErr("That\u2019s your own code \u2014 share it with someone else to connect."); setBusy(false); return; }
      if (s.invitedUserId || s.status === "active") { setErr("That space is already connected with someone."); setBusy(false); return; }
      const mine = await buildSnapshot(user.uid, firstName);
      await updateDoc(ref, {
        invitedUserId: user.uid, status: "active",
        [`members.${user.uid}`]: mine, updatedAt: serverTimestamp(),
      });
      await setDoc(doc(db, "users", user.uid), { sharedSpaceId: code }, { merge: true });
      const updated = { ...s, invitedUserId: user.uid, status: "active", members: { ...(s.members || {}), [user.uid]: mine } };
      setSpaceId(code); setSpace(updated); setCodeInput("");
    } catch { setErr("Couldn\u2019t join that space. Please try again."); }
    finally { setBusy(false); }
  }

  async function refreshMyShare() {
    if (!spaceId || !space) return;
    setBusy(true); setErr("");
    try {
      const mine = await buildSnapshot(user.uid, firstName);
      await updateDoc(doc(db, "sharedSpaces", spaceId), { [`members.${user.uid}`]: mine, updatedAt: serverTimestamp() });
      setSpace({ ...space, members: { ...(space.members || {}), [user.uid]: mine } });
    } catch { setErr("Couldn\u2019t update what you share. Please try again."); }
    finally { setBusy(false); }
  }

  // For "only after I choose to share" identity: reveal/hide the symbol to this
  // partner. Flips the stored flag, then rebuilds the snapshot so the change
  // reaches (or leaves) their view immediately.
  async function toggleReveal() {
    if (!spaceId) return;
    const next = !revealed;
    setRevealed(next); setBusy(true); setErr("");
    try {
      await setDoc(doc(db, "users", user.uid), { profileRevealed: next }, { merge: true });
      const mine = await buildSnapshot(user.uid, firstName);
      await updateDoc(doc(db, "sharedSpaces", spaceId), { [`members.${user.uid}`]: mine, updatedAt: serverTimestamp() });
      setSpace((s) => (s ? { ...s, members: { ...(s.members || {}), [user.uid]: mine } } : s));
    } catch { setRevealed(!next); setErr("Couldn\u2019t update that. Please try again."); }
    finally { setBusy(false); }
  }

  async function disconnect() {
    setBusy(true); setErr("");
    try {
      if (space && space.createdBy === user.uid && !space.invitedUserId && spaceId) {
        await deleteDoc(doc(db, "sharedSpaces", spaceId));
      }
      await setDoc(doc(db, "users", user.uid), { sharedSpaceId: null, profileRevealed: false }, { merge: true });
      setSpace(null); setSpaceId(null); setCodeInput(""); setRevealed(false);
    } catch { setErr("Couldn\u2019t disconnect. Please try again."); }
    finally { setBusy(false); }
  }

  function toggleSaved(k) {
    setSaved((cur) => {
      const next = cur.includes(k) ? cur.filter((x) => x !== k) : [...cur, k];
      if (user) setDoc(doc(db, "users", user.uid), { savedConversations: next }, { merge: true }).catch(() => {});
      return next;
    });
  }

  const inputStyle = {
    width: "100%", marginTop: 10, height: 40, boxSizing: "border-box",
    border: "0.5px solid var(--line)", borderRadius: 12, padding: "0 12px",
    fontFamily: "var(--body)", fontSize: 15, letterSpacing: 2, color: "var(--ink)",
    textTransform: "uppercase", background: "#FFFFFF",
  };

  const connected = space && space.status === "active" && space.invitedUserId;
  const pending = space && space.status === "pending" && space.createdBy === user?.uid && !space.invitedUserId;

  let rows = [], partnerName = "Your partner", iShareNothing = false, partnerIdentity = null;
  if (connected && user) {
    const partnerUid = space.createdBy === user.uid ? space.invitedUserId : space.createdBy;
    const me = space.members?.[user.uid] || { comfort: [], intimacy: [] };
    const them = space.members?.[partnerUid] || { comfort: [], intimacy: [], name: "Your partner" };
    partnerName = them.name || "Your partner";
    partnerIdentity = them.identity || null;
    iShareNothing = (me.comfort || []).length === 0 && (me.intimacy || []).length === 0;

    const cKeys = new Set([...(me.comfort || []).map(keyOf), ...(them.comfort || []).map(keyOf)]);
    const comfortRows = [...cKeys].map((k) => {
      const [cat, item] = splitKey(k);
      const mine = (me.comfort || []).find((x) => keyOf(x) === k);
      const theirs = (them.comfort || []).find((x) => keyOf(x) === k);
      if (mine && theirs) {
        return { domain: "comfort", item, cat, state: compareLevels(mine.level, theirs.level).state, you: mine.level || "", them: theirs.level || "" };
      }
      const note = theirs ? `${partnerName} shared this \u2014 switch yours on to compare.` : `You shared this \u2014 waiting on ${partnerName}.`;
      return { domain: "comfort", item, cat, state: "waiting", note };
    });

    const iBoth = (me.intimacy || []).filter((x) => (them.intimacy || []).some((y) => keyOf(y) === keyOf(x)));
    const intimacyRows = iBoth.map((x) => {
      const theirs = (them.intimacy || []).find((y) => keyOf(y) === keyOf(x));
      const same = x.state && theirs.state && x.state === theirs.state;
      return { domain: "intimacy", item: x.item, cat: x.cat, state: same ? "shared" : "talk", you: x.state || "", them: theirs.state || "" };
    });

    rows = [...comfortRows, ...intimacyRows].sort((a, b) => a.item.localeCompare(b.item));
  }

  const counts = GROUPS.reduce((m, g) => (m[g.state] = rows.filter((r) => r.state === g.state).length, m), {});
  const nothingToCompare = connected && rows.length === 0;

  const collapsedHint = (r) => {
    if (r.state === "waiting") return r.note;
    if (r.state === "shared") {
      const base = `Both ${short(r.you)}`;
      return isCautiousAligned(r) ? `${base} \u00b7 aligned, just cautious` : base;
    }
    return `You: ${short(r.you)} \u00b7 ${partnerName}: ${short(r.them)}`;
  };

  const Callout = ({ talk, children, sub, ink, tint, icon }) => (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start", background: tint, borderRadius: 11, padding: "11px 12px" }}>
      <span style={{ flex: "none", marginTop: 1, color: ink }}>{icon}</span>
      <span style={{ flex: 1 }}>
        <span style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: ink, lineHeight: 1.4 }}>{children}</span>
        <span style={{ display: "block", fontSize: 11, color: talk ? "#7E6E8C" : "#A67388", marginTop: 2, lineHeight: 1.4 }}>{sub}</span>
      </span>
    </div>
  );

  const Panel = ({ r, g, k }) => {
    if (g.state === "shared") {
      const caution = isCautiousAligned(r);
      return (
        <div style={{ padding: "0 14px 13px 57px" }}>
          <p style={{ fontSize: 12, color: "#8A7C93", lineHeight: 1.5, margin: 0 }}>
            {caution
              ? <>You and {partnerName} are both at &ldquo;{short(r.you)}&rdquo; here &mdash; aligned, even if it&rsquo;s a cautious spot. No gap to bridge; revisit whenever you like.</>
              : <>You and {partnerName} both feel easy here &mdash; nothing to work out. Let yourself enjoy it.</>}
          </p>
        </div>
      );
    }
    if (g.state === "waiting") {
      return (
        <div style={{ padding: "0 14px 13px 57px" }}>
          <button className="btn btn-outline" onClick={() => nav("/app/sharing")}>Choose what to share</button>
        </div>
      );
    }
    const talk = g.state === "talk";
    const lines = r.domain === "comfort" ? approachLines(r.you, r.them, partnerName) : null;
    const starter = r.domain === "comfort" ? sharedStarter(r.item, r.you, r.them) : intimacyStarter(r.item);
    const isSaved = saved.includes(k);
    return (
      <div>
        <div style={{ padding: "0 14px 12px 57px" }}>
          <p style={{ fontSize: 12, color: "#8A7C93", lineHeight: 1.5, margin: "0 0 11px" }}>
            {talk ? "Different, not wrong. A chance to understand each other." : "There\u2019s a real difference here \u2014 and that\u2019s completely okay."}
          </p>
          <div style={{ display: "flex", alignItems: "stretch", background: talk ? "#F3EDF6" : "#FAEFF3", borderRadius: 11, position: "relative" }}>
            <div style={{ flex: 1, padding: "10px 12px" }}>
              <span style={{ display: "inline-block", fontSize: 10.5, fontWeight: 600, color: talk ? "#6C5A7C" : "#9C5F77", background: talk ? "#E7DCF0" : "#F4DBE4", borderRadius: 12, padding: "2px 9px" }}>You</span>
              <div style={{ fontSize: 12.5, fontWeight: 600, marginTop: 6, color: "#3F2A4C" }}>{short(r.you)}</div>
            </div>
            <div style={{ width: 1, background: talk ? "#E2D7EA" : "#F0DBE3" }} />
            <div style={{ flex: 1, padding: "10px 12px" }}>
              <span style={{ display: "inline-block", fontSize: 10.5, fontWeight: 600, color: talk ? "#6C5A7C" : "#9C5F77", background: talk ? "#E7DCF0" : "#F4DBE4", borderRadius: 12, padding: "2px 9px" }}>{partnerName}</span>
              <div style={{ fontSize: 12.5, fontWeight: 600, marginTop: 6, color: "#3F2A4C" }}>{short(r.them)}</div>
            </div>
            <span style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: 26, height: 26, borderRadius: "50%", background: "#FFFFFF", border: `1px solid ${talk ? "#E2D7EA" : "#F0DBE3"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9.5, fontWeight: 600, color: talk ? "#9585A2" : "#C08DA0" }}>vs</span>
          </div>
        </div>

        {talk && lines && (
          <div style={{ background: "#EFF4E7", padding: "12px 14px 12px 57px", display: "flex", flexDirection: "column", gap: 11 }}>
            {lines.map((ln) => (
              <div key={ln.kind} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ width: 26, height: 26, borderRadius: "50%", background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", color: "#5E7B39", flex: "none" }}>
                  {ln.kind === "ease" ? <Sprout s={14} /> : <Msg s={14} />}
                </span>
                <span style={{ flex: 1 }}>
                  <span style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#3F2A4C" }}>{ln.line}</span>
                  <span style={{ display: "block", fontSize: 11, color: "#78846A", marginTop: 1, lineHeight: 1.4 }}>{ln.sub}</span>
                </span>
              </div>
            ))}
          </div>
        )}

        <div style={{ padding: talk ? "12px 14px 0 57px" : "0 14px 0 57px" }}>
          {talk ? (
            <Callout talk tint="#F0E9F6" ink="#5A4472" icon={<HandsHeart />} sub="When you understand each other, connection grows.">
              A conversation here could help you understand each other&rsquo;s pace.
            </Callout>
          ) : (
            <Callout tint="#FBECF0" ink="#8C5570" icon={<Hourglass />} sub="A shared map isn&rsquo;t permission &mdash; consent is still asked for in the moment.">
              No timeline. Let the more cautious pace lead.
            </Callout>
          )}
        </div>

        {starter && (
          <div style={{ padding: "12px 14px 0 57px" }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: "#9A8AA6", marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 7h4v6H7c0 1.9 1 3 3 3v1.8c-3 0-5-2-5-4.8V7zm8 0h4v6h-4c0 1.9 1 3 3 3v1.8c-3 0-5-2-5-4.8V7z" /></svg>
              A way to open it
            </div>
            <div style={{ background: "#F6F1F9", border: "1px solid #E9DFF0", borderRadius: 12, padding: "12px 13px" }}>
              <p style={{ margin: 0, fontSize: 13, color: "#4B2E59", lineHeight: 1.5, fontStyle: "italic" }}>{starter}</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginTop: 10 }}>
                <span style={{ fontSize: 10.5, color: "#9A8AA6", flex: 1, lineHeight: 1.35 }}>Yours to change &mdash; or say in your own words.</span>
                <button onClick={() => copyLine(k, starter)} aria-label={copiedKey === k ? "Copied" : "Copy starter"}
                  style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 600, cursor: "pointer", flex: "none", borderRadius: 20, padding: "6px 12px", background: "#FFFFFF", color: copiedKey === k ? "#5E7B39" : "#7B5E96", border: `1px solid ${copiedKey === k ? "#BFD3A6" : "#DFD2EA"}` }}>
                  {copiedKey === k ? (
                    <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12.5l5 5 11-11" /></svg>Copied</>
                  ) : (
                    <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 012-2h10" /></svg>Copy</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "12px 14px 14px 57px" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#8A7C93", flex: 1, lineHeight: 1.4 }}>
            <span style={{ color: talk ? "#C9A24B" : "#CDA0B1", flex: "none" }}>{talk ? <Bulb /> : <Heart s={14} />}</span>
            {talk ? "Start with curiosity. No rush." : "When you\u2019re both ready. No rush at all."}
          </span>
          <button
            onClick={() => toggleSaved(k)}
            aria-pressed={isSaved}
            aria-label={isSaved ? "Saved for later" : "Save for later"}
            style={{
              display: "inline-flex", alignItems: "center", gap: 5, cursor: "pointer",
              fontSize: 11.5, fontWeight: 600, flex: "none",
              color: isSaved ? "#FFFFFF" : (talk ? "#7B5E96" : "#9C5F77"),
              background: isSaved ? (talk ? "#8B6BA6" : "#C07E93") : "transparent",
              border: `1px solid ${isSaved ? "transparent" : (talk ? "#DFD2EA" : "#F0D8E1")}`,
              borderRadius: 20, padding: "6px 11px",
            }}
          >
            <Heart s={13} filled={isSaved} /> {isSaved ? "Saved" : "Save"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="screen">
      <BackBar />
      <div className="head">
        <h1 className="display">Shared space</h1>
        <p className="small muted" style={{ marginTop: 6 }}>
          Different, not wrong &mdash; just places to understand each other. No matches or scores here.
        </p>
      </div>

      <button className="card entry-card" style={{ marginBottom: 12, width: "100%" }} onClick={() => nav("/app/snapshot")}>
        <Icon name="privacy" size={40} />
        <span className="grow">
          <span className="t">Preview my snapshot</span>
          <span className="s">See exactly what a partner would see</span>
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--tethra-lavender)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}><path d="M9 6l6 6-6 6" /></svg>
      </button>

      <button className="card entry-card" style={{ marginBottom: 12, width: "100%" }} onClick={() => nav("/app/saved")}>
        <span style={{ width: 40, height: 40, borderRadius: "50%", background: "#F0E9F6", color: "#8B6BA6", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Heart s={20} filled /></span>
        <span className="grow">
          <span className="t">Saved conversations</span>
          <span className="s">{saved.length > 0 ? `${saved.length} kept to come back to` : "Tap the heart on any difference to keep it here"}</span>
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--tethra-lavender)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}><path d="M9 6l6 6-6 6" /></svg>
      </button>

      {!ready ? null : connected ? (
        <>
          <div className="card" style={{ marginBottom: 14 }}>
            <div className="rowico" style={{ marginBottom: 4 }}>
              <IdentityAvatar identity={partnerIdentity} name={partnerName} size={30} />
              <span className="small" style={{ fontWeight: 500 }}>Connected with {partnerName}</span>
            </div>
            <p className="tiny muted" style={{ marginTop: 2, lineHeight: 1.5 }}>
              You each see only what the other chose to share. Update yours anytime.
            </p>
            <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
              <button className="link" disabled={busy} onClick={refreshMyShare}>Update what I share</button>
              <button className="link" disabled={busy} onClick={disconnect}>Disconnect</button>
            </div>

            {myIdentity?.type === "symbol" && myIdentity.symbol && (
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 12, paddingTop: 11, borderTop: "1px solid #F1EAE4" }}>
                <IdentityAvatar identity={myIdentity} name={firstName} size={26} />
                {myIdentity.visibility === "onshare" ? (
                  <>
                    <span className="tiny muted" style={{ flex: 1, lineHeight: 1.4 }}>
                      Your symbol is {revealed ? `visible to ${partnerName}` : "hidden for now"}.
                    </span>
                    <button className="link" disabled={busy} onClick={toggleReveal} style={{ flex: "none" }}>
                      {revealed ? "Hide" : "Show " + partnerName}
                    </button>
                  </>
                ) : myIdentity.visibility === "private" ? (
                  <span className="tiny muted" style={{ flex: 1, lineHeight: 1.4 }}>
                    Your symbol stays private &mdash; {partnerName} sees your initials.
                  </span>
                ) : (
                  <span className="tiny muted" style={{ flex: 1, lineHeight: 1.4 }}>
                    {partnerName} can see your symbol.
                  </span>
                )}
              </div>
            )}
          </div>

          {iShareNothing && (
            <div className="card" style={{ marginBottom: 14, borderLeft: "4px solid #A98BC0" }}>
              <p className="small" style={{ fontWeight: 500, marginTop: 0 }}>You haven&rsquo;t shared anything yet</p>
              <p className="tiny muted" style={{ marginTop: 5, lineHeight: 1.5 }}>
                {partnerName} has shared some areas. Switch on what you&rsquo;d like them to see, and it&rsquo;ll compare here.
              </p>
              <button className="btn btn-outline" style={{ marginTop: 10 }} onClick={() => nav("/app/sharing")}>
                Choose what to share
              </button>
            </div>
          )}

          {rows.length > 0 && (
            <div style={{ display: "flex", gap: 6, margin: "0 2px 4px", flexWrap: "wrap" }}>
              {counts.shared > 0 && <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 500, color: "#52603F", background: "#EDF2E4", borderRadius: 20, padding: "5px 10px" }}><Check s={13} />{counts.shared} growing together</span>}
              {counts.talk > 0 && <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 500, color: "#4C5F33", background: "#EDF3E2", borderRadius: 20, padding: "5px 10px" }}><Sprout s={13} />{counts.talk} to talk about</span>}
              {counts.slow > 0 && <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 500, color: "#9C5F77", background: "#FBECF0", borderRadius: 20, padding: "5px 10px" }}><Feather s={13} />{counts.slow} to ease into</span>}
            </div>
          )}

          {GROUPS.map((g) => {
            const grp = rows.filter((r) => r.state === g.state);
            if (!grp.length) return null;
            return (
              <div key={g.state} style={{ marginTop: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, margin: "0 2px 8px" }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: g.dot }} />
                  <span style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: g.labelInk }}>{g.label}</span>
                </div>
                <div style={{ background: g.state === "waiting" ? "#FBF9FC" : "#FFFFFF", border: g.state === "waiting" ? "1px dashed #DDD0E8" : "1px solid #ECE4DE", borderRadius: 14, overflow: "hidden" }}>
                  {grp.map((r, i) => {
                    const k = `${r.domain}:${r.cat}:${r.item}`;
                    const open = openKey === k;
                    const caution = isCautiousAligned(r);
                    return (
                      <div key={k}>
                        {i > 0 && <div style={{ height: 1, background: "#F1EAE4", margin: "0 13px" }} />}
                        <button
                          onClick={() => setOpenKey(open ? null : k)}
                          aria-expanded={open}
                          style={{ display: "flex", alignItems: "center", gap: 11, width: "100%", background: "none", border: "none", cursor: "pointer", padding: "11px 13px", borderLeft: g.accent ? `4px solid ${g.accent}` : "4px solid transparent" }}
                        >
                          <span style={{ width: 30, height: 30, borderRadius: "50%", background: caution ? "#F3EDE2" : g.tint, color: caution ? "#A98444" : g.iconInk, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{g.icon({ s: 16 })}</span>
                          <span style={{ flex: 1, textAlign: "left" }}>
                            <span style={{ display: "block", fontSize: 13.5, fontWeight: 600, color: "#3F2A4C" }}>{r.item}</span>
                            <span style={{ display: "block", fontSize: 11, color: g.state === "waiting" ? g.labelInk : "#8A7C93", marginTop: 1, lineHeight: 1.4 }}>{collapsedHint(r)}</span>
                          </span>
                          <Chevron open={open} />
                        </button>
                        {open && <Panel r={r} g={g} k={k} />}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {nothingToCompare && !iShareNothing && (
            <p className="small muted" style={{ marginBottom: 14 }}>
              Nothing to compare yet. As you each switch on items to share, they&rsquo;ll appear here.
            </p>
          )}

          <LookingAhead />
        </>
      ) : pending ? (
        <div className="card">
          <p className="small" style={{ fontWeight: 500, marginTop: 0 }}>Waiting for someone to join</p>
          <p className="tiny muted" style={{ marginTop: 6, lineHeight: 1.5 }}>
            Share this code with the person you want to connect with. They enter it under &ldquo;Join with a code.&rdquo;
          </p>
          <p style={{ marginTop: 12, fontSize: 26, letterSpacing: 5, color: "var(--plum-700)", fontFamily: "var(--display)", textAlign: "center" }}>
            {space.code}
          </p>
          <button className="link" style={{ display: "block", margin: "12px auto 0" }} disabled={busy} onClick={disconnect}>
            Cancel invite
          </button>
        </div>
      ) : (
        <>
          <div className="card" style={{ marginBottom: 12 }}>
            <p className="small" style={{ fontWeight: 500, marginTop: 0 }}>Invite someone to share</p>
            <p className="tiny muted" style={{ marginTop: 4, lineHeight: 1.5 }}>
              They&rsquo;ll only ever see what you&rsquo;ve chosen to share. Your private notes and raw map never leave your account.
            </p>
            <button className="btn btn-outline" style={{ marginTop: 12 }} disabled={busy} onClick={createInvite}>
              {busy ? "Creating\u2026" : "Create an invite code"}
            </button>
          </div>

          <div className="card">
            <p className="small" style={{ fontWeight: 500, marginTop: 0 }}>Join with a code</p>
            <p className="tiny muted" style={{ marginTop: 4, lineHeight: 1.5 }}>
              Enter the code someone shared with you.
            </p>
            <input value={codeInput} onChange={(e) => setCodeInput(e.target.value)} placeholder="ABC1234"
              maxLength={12} style={inputStyle} aria-label="Invite code" />
            <button className="btn btn-primary" style={{ marginTop: 12 }} disabled={busy || !codeInput.trim()} onClick={joinWithCode}>
              {busy ? "Connecting\u2026" : "Connect"}
            </button>
          </div>
        </>
      )}

      {err && <p className="tiny center" style={{ marginTop: 12, color: "var(--tethra-plum, #4B2E59)" }}>{err}</p>}

      <div className="safety-note" style={{ justifyContent: "flex-start", textAlign: "left", marginTop: 18 }}>
        <IconShield width={13} height={13} />
        A shared map isn&rsquo;t permission. Consent is still asked for in the moment &mdash; and anyone can
        change their mind anytime.
      </div>
    </div>
  );
}
