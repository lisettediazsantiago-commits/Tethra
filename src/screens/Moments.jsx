import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import Icon from "../components/Icon";
import BackBar from "../components/BackBar";

// Celebrate Healthy Communication (v1.1 §8). NOT achievements, streaks, or scores.
// Each "moment of care" is a gentle affirmation derived from what the person has
// already done, so it grows naturally with no new logging or data model. Growth
// is never measured by intimacy — only by how honestly someone knows themselves.
const Spark = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flex: "none", marginTop: 3 }} aria-hidden="true">
    <path d="M12 3c.4 3.6 1.4 4.6 5 5-3.6.4-4.6 1.4-5 5-.4-3.6-1.4-4.6-5-5 3.6-.4 4.6-1.4 5-5Z"
      fill="var(--tethra-plum, #4B2E59)" opacity="0.85" />
  </svg>
);

export default function Moments() {
  const { user } = useAuth();
  const [ready, setReady] = useState(false);
  const [moments, setMoments] = useState([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [c, i, r, b] = await Promise.all([
        getDoc(doc(db, "comfortMaps", user.uid)),
        getDoc(doc(db, "intimacyMaps", user.uid)),
        getDoc(doc(db, "reflections", user.uid)),
        getDoc(doc(db, "blueprints", user.uid)),
      ]);
      const cVals = Object.values(c.exists() ? (c.data().items || {}) : {});
      const iVals = Object.values(i.exists() ? (i.data().items || {}) : {});
      const refl = r.exists() ? r.data() : {};
      const journal = refl.journal || [];
      const timeline = refl.timeline || [];
      const checkins = refl.checkins || [];
      const bAns = b.exists() ? (b.data().answers || {}) : {};

      const list = [];
      const push = (cond, text) => { if (cond) list.push(text); };

      const blueprintDone = (bAns.needs && bAns.needs.length) || bAns.pace || (bAns.safest && bAns.safest.length);
      push(blueprintDone, "You described how you enter connection. Naming what you need is an act of self-respect.");

      push(cVals.some((e) => e && e.level),
        "You\u2019ve mapped where you are today. Returning to yourself honestly takes courage.");

      const boundaries = cVals.some((e) => e && (e.level === "Not comfortable" || e.level === "Maybe later"))
        || iVals.some((e) => e && (e.state === "Not comfortable" || e.state === "Maybe someday" || e.state === "Prefer not to answer"));
      push(boundaries, "You\u2019ve named clear boundaries. Saying \u201cnot this\u201d or \u201cnot yet\u201d out loud is strength, never refusal.");

      const shared = cVals.some((e) => e && ((e.whatHelps && e.whatHelps.trim()) || e.share))
        || iVals.some((e) => e && e.visibility === "partner");
      push(shared, "You\u2019ve put words to what helps you feel safe, and chosen what to share. Letting yourself be understood is brave.");

      push(iVals.some((e) => e && e.state),
        "You\u2019ve explored your physical comfort at your own pace, privately. That\u2019s self-awareness, not a checklist.");

      push(journal.length > 0 || checkins.length > 0,
        "You\u2019ve taken time to reflect. Checking in with yourself is a quiet, steady kind of care.");

      push(timeline.length > 0,
        "You\u2019ve noticed how you\u2019ve grown. Recognizing your own change is its own gift.");

      setMoments(list);
      setReady(true);
    })();
  }, [user]);

  return (
    <div className="screen">
      <BackBar />
      <div className="head">
        <div className="rowico" style={{ marginBottom: 8 }}>
          <Icon name="appreciation" size={34} />
          <span className="kicker">For you</span>
        </div>
        <h1 className="display">Moments of care</h1>
        <p className="small muted" style={{ marginTop: 6, lineHeight: 1.55 }}>
          Not achievements or streaks &mdash; just quiet acknowledgment of the care you&rsquo;ve shown yourself.
        </p>
      </div>

      {!ready ? null : moments.length === 0 ? (
        <div className="card">
          <p className="small muted" style={{ marginTop: 0, lineHeight: 1.6 }}>
            Every honest thing you do here &mdash; naming a boundary, sharing a need, taking a moment to
            reflect &mdash; is worth celebrating. Your moments of care will gather here as you go.
          </p>
        </div>
      ) : (
        moments.map((m, idx) => (
          <div className="card" key={idx} style={{ marginBottom: 10, display: "flex", gap: 10, alignItems: "flex-start" }}>
            <Spark />
            <p className="small" style={{ margin: 0, lineHeight: 1.6 }}>{m}</p>
          </div>
        ))
      )}

      <p className="tiny faint center" style={{ marginTop: 18, lineHeight: 1.55 }}>
        There&rsquo;s no score here. Growth isn&rsquo;t measured by intimacy &mdash; only by how honestly you know yourself.
      </p>
    </div>
  );
}
