import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  doc, getDoc, setDoc, collection, addDoc, query, orderBy,
  onSnapshot, serverTimestamp, updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { COMFORT_LEVELS, UNSURE } from "../data/content";
import Icon from "../components/Icon";
import BackBar from "../components/BackBar";

// ── Gentle conversations ─────────────────────────────────────────────────────
// Topic-organized notes over a connected shared space. Delivered async and
// pressure-free: no read receipts, no "typing…", no presence, no unread counts.
// A thread simply shows whether the newest note came from your partner ("a note
// is waiting"). Topics can be seeded from the comfort items you both share, so a
// conversation is always about something real — and cautious topics carry a soft
// "no rush" banner drawn from your actual comfort levels.

const firstNameOf = (u) => (u?.displayName || "").split(" ")[0] || "You";
const CAUTIOUS = new Set(["Not comfortable", "Maybe later"]);
const rank = (x) => (x === UNSURE ? -1 : COMFORT_LEVELS.indexOf(x));

// A topic is "tender" if, across what you've both shared, either person marked a
// cautious level, or your levels differ. Drives the gentle banner. Returns
// { tender:boolean } or null when we can't tell (only one/neither shared it).
function tendernessFor(topic, mine, theirs) {
  const m = mine.get(topic);
  const t = theirs.get(topic);
  if (!m && !t) return null;
  const cautious = (m && CAUTIOUS.has(m)) || (t && CAUTIOUS.has(t));
  const differ = m && t && rank(m) !== rank(t);
  return { tender: Boolean(cautious || differ) };
}

const iso = () => new Date().toISOString();

export default function Conversations() {
  const { user } = useAuth();
  const nav = useNavigate();

  const [ready, setReady] = useState(false);
  const [spaceId, setSpaceId] = useState(null);
  const [space, setSpace] = useState(null);
  const [threads, setThreads] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [starting, setStarting] = useState(false);
  const [newTopic, setNewTopic] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const endRef = useRef(null);

  const me = user?.uid;
  const myName = firstNameOf(user);

  // Resolve the connected space once.
  useEffect(() => {
    if (!user) return;
    let alive = true;
    (async () => {
      try {
        const u = await getDoc(doc(db, "users", user.uid));
        const id = u.exists() ? (u.data().sharedSpaceId || null) : null;
        if (!alive) return;
        if (!id) { setReady(true); return; }
        const s = await getDoc(doc(db, "sharedSpaces", id));
        if (!alive) return;
        if (s.exists()) { setSpaceId(id); setSpace(s.data()); }
      } catch { /* fall through to the connect prompt */ }
      if (alive) setReady(true);
    })();
    return () => { alive = false; };
  }, [user]);

  const connected = space && space.status === "active" && space.invitedUserId;

  // Live thread list for the connected space.
  useEffect(() => {
    if (!connected || !spaceId) return;
    const q = query(collection(db, "sharedSpaces", spaceId, "threads"), orderBy("lastAt", "desc"));
    const stop = onSnapshot(q, (snap) => {
      setThreads(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }, () => { /* keep last-known list on transient errors */ });
    return stop;
  }, [connected, spaceId]);

  // Live messages for the open thread.
  useEffect(() => {
    if (!spaceId || !openId) { setMessages([]); return; }
    const q = query(collection(db, "sharedSpaces", spaceId, "threads", openId, "messages"), orderBy("createdAt", "asc"));
    const stop = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }, () => {});
    return stop;
  }, [spaceId, openId]);

  useEffect(() => {
    if (endRef.current) endRef.current.scrollIntoView({ block: "nearest" });
  }, [messages, openId]);

  // Topics we can suggest: the comfort items you've both shared into the space.
  const { suggestions, mineLevels, theirLevels } = (() => {
    const mineLevels = new Map(), theirLevels = new Map();
    if (!connected || !me) return { suggestions: [], mineLevels, theirLevels };
    const partnerUid = space.createdBy === me ? space.invitedUserId : space.createdBy;
    const mineM = space.members?.[me] || { comfort: [] };
    const theirM = space.members?.[partnerUid] || { comfort: [] };
    (mineM.comfort || []).forEach((c) => c.level && mineLevels.set(c.item, c.level));
    (theirM.comfort || []).forEach((c) => c.level && theirLevels.set(c.item, c.level));
    const all = new Set([...mineLevels.keys(), ...theirLevels.keys()]);
    const existing = new Set(threads.map((t) => (t.topic || "").toLowerCase()));
    const suggestions = [...all].filter((t) => !existing.has(t.toLowerCase())).slice(0, 6);
    return { suggestions, mineLevels, theirLevels };
  })();

  async function startThread(topic) {
    const t = (topic || "").trim();
    if (!t || !spaceId) return;
    setBusy(true); setErr("");
    try {
      const ref = await addDoc(collection(db, "sharedSpaces", spaceId, "threads"), {
        topic: t, createdBy: me, createdAt: serverTimestamp(),
        lastAt: serverTimestamp(), lastSenderUid: null, lastText: "",
      });
      setStarting(false); setNewTopic(""); setOpenId(ref.id);
    } catch { setErr("Couldn\u2019t start that conversation. Please try again."); }
    finally { setBusy(false); }
  }

  async function leaveNote() {
    const text = draft.trim();
    if (!text || !spaceId || !openId) return;
    setBusy(true); setErr("");
    setDraft("");
    try {
      await addDoc(collection(db, "sharedSpaces", spaceId, "threads", openId, "messages"), {
        senderUid: me, senderName: myName, text, createdAt: serverTimestamp(),
      });
      await updateDoc(doc(db, "sharedSpaces", spaceId, "threads", openId), {
        lastAt: serverTimestamp(), lastSenderUid: me, lastText: text.slice(0, 80),
      });
    } catch { setErr("Couldn\u2019t leave that note. Please try again."); setDraft(text); }
    finally { setBusy(false); }
  }

  // ── Not signed in / loading ──────────────────────────────────────────────
  if (!ready) {
    return <div className="screen"><BackBar /><p className="tiny faint" style={{ marginTop: 20 }}>Opening your conversations\u2026</p></div>;
  }

  // ── Not connected yet ────────────────────────────────────────────────────
  if (!connected) {
    return (
      <div className="screen">
        <BackBar />
        <div className="head">
          <p className="eyebrow">Together</p>
          <h1 className="display" style={{ marginTop: 6 }}>Gentle conversations</h1>
        </div>
        <div className="card" style={{ marginTop: 12 }}>
          <div className="rowico" style={{ marginBottom: 6 }}>
            <Icon name="conversations" size={30} />
            <span className="small" style={{ fontWeight: 500 }}>Connect with your partner first</span>
          </div>
          <p className="tiny muted" style={{ lineHeight: 1.6 }}>
            Conversations live inside your shared space. Once you and your partner are connected,
            you can leave each other notes here \u2014 organized by topic, always at your own pace.
          </p>
          <button className="btn" style={{ marginTop: 14 }} onClick={() => nav("/app/shared")}>
            Go to shared space
          </button>
        </div>
      </div>
    );
  }

  // ── Open thread view ─────────────────────────────────────────────────────
  if (openId) {
    const thread = threads.find((t) => t.id === openId);
    const topic = thread?.topic || "This conversation";
    const tender = tendernessFor(topic, mineLevels, theirLevels);

    return (
      <div className="screen">
        <button type="button" onClick={() => setOpenId(null)} aria-label="All conversations"
          style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "none", border: "none",
            padding: "2px 2px 2px 0", marginBottom: 10, cursor: "pointer", color: "var(--tethra-gray)", fontSize: 13, fontFamily: "var(--body)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          All conversations
        </button>

        <div style={{ background: "var(--tethra-plum)", borderRadius: "var(--radius)", padding: "14px 16px", marginBottom: 14 }}>
          <p style={{ color: "var(--tethra-mist)", fontSize: 10, letterSpacing: "0.05em", margin: 0 }}>A GENTLE CONVERSATION ABOUT</p>
          <p style={{ color: "#fff", fontSize: 16, fontWeight: 500, margin: "3px 0 0", textTransform: "capitalize" }}>{topic}</p>
        </div>

        {tender?.tender && (
          <div style={{ background: "var(--gold-soft)", borderRadius: 12, padding: "10px 12px", marginBottom: 14, display: "flex", gap: 8 }}>
            <Icon name="gentle-reminder" size={16} />
            <span style={{ fontSize: 12, color: "#7A5A1E", lineHeight: 1.5 }}>
              One of you sees this more cautiously. No rush here &mdash; take all the time you need.
            </span>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12, minHeight: 120, marginBottom: 14 }}>
          {messages.length === 0 && (
            <p className="tiny faint" style={{ textAlign: "center", padding: "18px 0", lineHeight: 1.6 }}>
              No notes yet. Whenever you\u2019re ready, leave the first one below.
            </p>
          )}
          {messages.map((m) => {
            const mineMsg = m.senderUid === me;
            return (
              <div key={m.id} style={{ alignSelf: mineMsg ? "flex-end" : "flex-start", maxWidth: "82%" }}>
                <div style={{ fontSize: 10, color: "var(--tethra-gray)", margin: mineMsg ? "0 2px 4px 0" : "0 0 4px 2px", textAlign: mineMsg ? "right" : "left" }}>
                  {mineMsg ? "You" : (m.senderName || "Your partner")}
                </div>
                <div style={{
                  background: mineMsg ? "#F5EEF7" : "var(--tethra-mist)",
                  color: "var(--tethra-plum)", padding: "10px 12px", fontSize: 13, lineHeight: 1.55,
                  borderRadius: mineMsg ? "14px 4px 14px 14px" : "4px 14px 14px 14px",
                }}>{m.text}</div>
              </div>
            );
          })}
          <div ref={endRef} />
        </div>

        {err && <p className="tiny" style={{ color: "var(--rose)", marginBottom: 8 }}>{err}</p>}

        <div style={{ background: "var(--card)", borderRadius: 14, border: "0.5px solid var(--line)", padding: 12 }}>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Leave a note whenever you\u2019re ready\u2026"
            rows={2}
            style={{ width: "100%", boxSizing: "border-box", border: "none", resize: "none", background: "transparent",
              fontFamily: "var(--body)", fontSize: 14, color: "var(--ink)", outline: "none", lineHeight: 1.5 }}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
            <button className="btn" disabled={busy || !draft.trim()} onClick={leaveNote}
              style={{ background: "var(--sage)", color: "#22331E", opacity: busy || !draft.trim() ? 0.5 : 1 }}>
              Leave note
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Thread list ──────────────────────────────────────────────────────────
  return (
    <div className="screen">
      <BackBar />
      <div className="head">
        <p className="eyebrow">Together</p>
        <h1 className="display" style={{ marginTop: 6 }}>Gentle conversations</h1>
      </div>
      <p className="tiny muted" style={{ marginTop: 8, lineHeight: 1.6 }}>
        Leave each other notes, organized by topic. No rush and no read receipts &mdash;
        a note simply waits until the moment feels right.
      </p>

      {err && <p className="tiny" style={{ color: "var(--rose)", marginTop: 10 }}>{err}</p>}

      <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        {threads.length === 0 && !starting && (
          <p className="tiny faint" style={{ lineHeight: 1.6 }}>
            No conversations yet. Start one below whenever you\u2019re ready.
          </p>
        )}
        {threads.map((t) => {
          const waiting = t.lastSenderUid && t.lastSenderUid !== me;
          return (
            <button key={t.id} className="card" onClick={() => setOpenId(t.id)}
              style={{ textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                <Icon name="conversations" size={22} />
                <span style={{ minWidth: 0 }}>
                  <span className="small" style={{ fontWeight: 500, display: "block", textTransform: "capitalize", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.topic}</span>
                  {t.lastText && <span className="tiny faint" style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.lastText}</span>}
                </span>
              </span>
              {waiting && (
                <span style={{ display: "flex", alignItems: "center", gap: 6, flex: "none" }}>
                  <span className="tiny" style={{ color: "var(--tethra-gray)" }}>a note waiting</span>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--blush)", display: "inline-block" }} />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Start a new conversation */}
      <div style={{ marginTop: 16 }}>
        {!starting ? (
          <button className="card" onClick={() => setStarting(true)}
            style={{ width: "100%", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, color: "var(--tethra-purple)" }}>
            <Icon name="add-note" size={22} />
            <span className="small" style={{ fontWeight: 500 }}>Start a gentle conversation</span>
          </button>
        ) : (
          <div className="card">
            <span className="small" style={{ fontWeight: 500 }}>What would you like to talk about?</span>
            {suggestions.length > 0 && (
              <>
                <p className="tiny faint" style={{ margin: "10px 0 8px" }}>From what you both share</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {suggestions.map((s) => (
                    <button key={s} onClick={() => startThread(s)} disabled={busy}
                      style={{ border: "0.5px solid var(--line)", background: "var(--tethra-mist)", color: "var(--tethra-plum)",
                        borderRadius: 12, padding: "6px 12px", fontSize: 12, fontFamily: "var(--body)", cursor: "pointer", textTransform: "capitalize" }}>
                      {s}
                    </button>
                  ))}
                </div>
              </>
            )}
            <input
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="Or write your own topic\u2026"
              style={{ width: "100%", boxSizing: "border-box", marginTop: 12, height: 40, border: "0.5px solid var(--line)",
                borderRadius: 12, padding: "0 12px", fontFamily: "var(--body)", fontSize: 14, color: "var(--ink)", background: "#fff" }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
              <button className="link" onClick={() => { setStarting(false); setNewTopic(""); }}>Cancel</button>
              <button className="btn" disabled={busy || !newTopic.trim()} onClick={() => startThread(newTopic)}
                style={{ opacity: busy || !newTopic.trim() ? 0.5 : 1 }}>Start</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
