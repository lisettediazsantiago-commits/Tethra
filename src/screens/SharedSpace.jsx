import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { compareLevels, COMFORT_CATEGORIES, INTIMACY_CATEGORIES } from "../data/content";
import { IconShield } from "../components/Icons";
import Icon from "../components/Icon";
import BackBar from "../components/BackBar";

// Two-party shared spaces. The document id IS the invite code. Each person's
// RAW comfort/intimacy maps stay owner-locked forever — the only cross-user data
// is a snapshot of the fields each person explicitly chose to share, copied in by
// that person. So the most anyone can ever see equals their own Snapshot preview.
const CODE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const makeCode = () => Array.from({ length: 7 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join("");
const keyOf = (x) => `${x.cat}:${x.item}`;
const splitKey = (k) => { const i = k.indexOf(":"); return [k.slice(0, i), k.slice(i + 1)]; };
const catTitle = (cats, key) => (cats.find((c) => c.key === key)?.title || "");

async function buildSnapshot(uid, name) {
  const [c, i] = await Promise.all([
    getDoc(doc(db, "comfortMaps", uid)),
    getDoc(doc(db, "intimacyMaps", uid)),
  ]);
  const cItems = c.exists() ? (c.data().items || {}) : {};
  const iItems = i.exists() ? (i.data().items || {}) : {};
  const comfort = Object.entries(cItems).filter(([, e]) => e && e.share)
    .map(([k, e]) => { const [cat, item] = splitKey(k); return { cat, item, level: e.level || "", whatHelps: e.whatHelps || "" }; });
  const intimacy = Object.entries(iItems).filter(([, e]) => e && e.visibility === "partner")
    .map(([k, e]) => { const [cat, item] = splitKey(k); return { cat, item, state: e.state || "" }; });
  return { name: name || "Your partner", comfort, intimacy, sharedAt: Date.now() };
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

  const firstName = (user?.displayName || "").split(" ")[0] || "You";

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const u = await getDoc(doc(db, "users", user.uid));
        const id = u.exists() ? (u.data().sharedSpaceId || null) : null;
        setSpaceId(id);
        if (id) {
          const snap = await getDoc(doc(db, "sharedSpaces", id));
          if (snap.exists()) setSpace(snap.data());
          else setSpaceId(null);
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

  async function disconnect() {
    setBusy(true); setErr("");
    try {
      if (space && space.createdBy === user.uid && !space.invitedUserId && spaceId) {
        await deleteDoc(doc(db, "sharedSpaces", spaceId));
      }
      await setDoc(doc(db, "users", user.uid), { sharedSpaceId: null }, { merge: true });
      setSpace(null); setSpaceId(null); setCodeInput("");
    } catch { setErr("Couldn\u2019t disconnect. Please try again."); }
    finally { setBusy(false); }
  }

  const inputStyle = {
    width: "100%", marginTop: 10, height: 40, boxSizing: "border-box",
    border: "0.5px solid var(--line)", borderRadius: 12, padding: "0 12px",
    fontFamily: "var(--body)", fontSize: 15, letterSpacing: 2, color: "var(--ink)",
    textTransform: "uppercase", background: "#FFFFFF",
  };

  const connected = space && space.status === "active" && space.invitedUserId;
  const pending = space && space.status === "pending" && space.createdBy === user?.uid && !space.invitedUserId;

  let comfortRows = [], intimacyRows = [], partnerName = "Your partner";
  if (connected && user) {
    const partnerUid = space.createdBy === user.uid ? space.invitedUserId : space.createdBy;
    const me = space.members?.[user.uid] || { comfort: [], intimacy: [] };
    const them = space.members?.[partnerUid] || { comfort: [], intimacy: [], name: "Your partner" };
    partnerName = them.name || "Your partner";
    const cKeys = new Set([...(me.comfort || []).map(keyOf), ...(them.comfort || []).map(keyOf)]);
    comfortRows = [...cKeys].map((k) => {
      const [cat, item] = splitKey(k);
      const mine = (me.comfort || []).find((x) => keyOf(x) === k);
      const theirs = (them.comfort || []).find((x) => keyOf(x) === k);
      const cmp = (mine && theirs) ? compareLevels(mine.level, theirs.level) : { state: "talk", label: "Only one of you shared" };
      return { item, cat, mine, theirs, cmp };
    });
    const iBoth = (me.intimacy || []).filter((x) => (them.intimacy || []).some((y) => keyOf(y) === keyOf(x)));
    intimacyRows = iBoth.map((x) => {
      const theirs = (them.intimacy || []).find((y) => keyOf(y) === keyOf(x));
      return { item: x.item, cat: x.cat, mine: x, theirs };
    });
  }

  return (
    <div className="screen">
      <BackBar />
      <div className="head">
        <h1 className="display">Shared space</h1>
        <p className="small muted" style={{ marginTop: 6 }}>
          A place to understand each other. No matches or scores here &mdash; only shared comfort
          and gentle conversation.
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

      {!ready ? null : connected ? (
        <>
          <div className="card" style={{ marginBottom: 14 }}>
            <div className="rowico" style={{ marginBottom: 4 }}>
              <Icon name="shared-space" size={30} />
              <span className="small" style={{ fontWeight: 500 }}>Connected with {partnerName}</span>
            </div>
            <p className="tiny muted" style={{ marginTop: 2, lineHeight: 1.5 }}>
              You each see only what the other chose to share. Update yours anytime.
            </p>
            <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
              <button className="link" disabled={busy} onClick={refreshMyShare}>Update what I share</button>
              <button className="link" disabled={busy} onClick={disconnect}>Disconnect</button>
            </div>
          </div>

          <p className="eyebrow" style={{ marginBottom: 8 }}>Comfort you&rsquo;ve both shared</p>
          {comfortRows.length === 0 ? (
            <p className="small muted" style={{ marginBottom: 14 }}>
              Neither of you has shared comfort items yet. Toggle sharing on items in your Comfort Map to compare them here.
            </p>
          ) : comfortRows.map((r) => (
            <div className="card" key={`c-${r.cat}-${r.item}`} style={{ marginBottom: 10 }}>
              <div className="row-between">
                <span className="small" style={{ fontWeight: 500 }}>{r.item}</span>
                <span className={`state ${r.cmp.state}`}><span className="dot" />{r.cmp.label}</span>
              </div>
              <p className="tiny muted" style={{ marginTop: 7 }}>
                You: {r.mine?.level || "not shared"} &middot; {partnerName}: {r.theirs?.level || "not shared"}
              </p>
              {r.cmp.state === "talk" && (
                <p className="suggestion">
                  A gentle place to begin: &ldquo;What would make this feel easy and welcome for you?&rdquo;
                </p>
              )}
            </div>
          ))}

          {intimacyRows.length > 0 && (
            <>
              <p className="eyebrow" style={{ margin: "16px 0 8px" }}>Physical intimacy you&rsquo;ve both shared</p>
              {intimacyRows.map((r) => (
                <div className="card" key={`i-${r.cat}-${r.item}`} style={{ marginBottom: 10 }}>
                  <div className="row-between">
                    <span className="small" style={{ fontWeight: 500 }}>{r.item}</span>
                    <span className="tiny faint">{catTitle(INTIMACY_CATEGORIES, r.cat)}</span>
                  </div>
                  <p className="tiny muted" style={{ marginTop: 7 }}>
                    You: {r.mine?.state || "\u2014"} &middot; {partnerName}: {r.theirs?.state || "\u2014"}
                  </p>
                </div>
              ))}
            </>
          )}
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
