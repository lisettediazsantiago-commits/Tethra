// All product copy and taxonomy lives here so tone stays consistent
// and non-judgmental across every screen. Edit language in one place.

export const TAGLINES = [
  "Move at the pace of trust.",
  "Connection without assumption.",
  "Know your pace. Share your truth. Grow with care.",
];

// Signature quotes — woven gently through the app (v1.1 §12).
export const TETHRA_QUOTES = [
  "Move at the pace of trust.",
  "Your map isn\u2019t meant to define you. It\u2019s meant to help you understand who you are today.",
  "Growth isn\u2019t becoming someone else. Sometimes it\u2019s simply recognizing yourself more clearly.",
  "There is no perfect timeline for connection.",
  "Understanding yourself is the first act of understanding someone else.",
];

// Core philosophy principles threaded through the experience (v1.1 §11).
export const PHILOSOPHY_LINES = [
  "You are allowed to change.",
  "Boundaries can become stronger or softer.",
  "Healing isn\u2019t linear.",
  "Growth isn\u2019t measured by intimacy.",
  "Consent is an ongoing conversation.",
  "Self-awareness is lifelong.",
  "There is no \u201cright\u201d pace.",
];

// Reflection Journal prompts (v1.1 §10). A "Free write" option is added in the UI.
export const JOURNAL_PROMPTS = [
  "What did you learn about yourself today?",
  "Did anything surprise you?",
  "What felt safe?",
  "What felt uncomfortable?",
  "What are you proud of?",
  "What would you like to remember?",
];

// Growth Timeline inspiration prompts (v1.1 §9). One rotates in as a gentle nudge.
export const GROWTH_PROMPTS = [
  "What are you more comfortable with now than you used to be?",
  "A boundary that\u2019s grown stronger or softer lately\u2026",
  "Something you understand about yourself now that you didn\u2019t before\u2026",
  "A fear that feels smaller than it once did\u2026",
  "How has your sense of your own pace changed?",
];

// Gentle Reflection Check-in (v1.1 §2). An invitation, never a task. Each option
// carries a supportive acknowledgment and, where it helps, one gentle next step.
export const REFLECTION_PROMPT = "Has anything changed since your last reflection?";
export const REFLECTION_OPTIONS = [
  {
    key: "open", label: "I\u2019m feeling more open",
    ack: "That\u2019s a lovely thing to notice. Openness has its own pace \u2014 there\u2019s no need to rush it. If you\u2019d like, your Comfort Map is a gentle place to let that show.",
    to: "/app/comfort-map", cta: "Revisit your Comfort Map",
  },
  {
    key: "protective", label: "I\u2019m feeling more protective",
    ack: "Protecting yourself is wisdom, not retreat. Boundaries can grow stronger whenever you need them to \u2014 you can ease back on anything, anytime.",
    to: "/app/comfort-map", cta: "Revisit your Comfort Map",
  },
  {
    key: "exploring", label: "I\u2019m exploring new parts of myself",
    ack: "Exploration deserves room and patience. However this unfolds, it\u2019s yours to move through at your own pace \u2014 your journal can hold whatever you\u2019re discovering.",
    to: "/app/journal", cta: "Open your journal",
  },
  {
    key: "healing", label: "I\u2019m healing from something",
    ack: "Healing isn\u2019t linear, and there\u2019s no pace you\u2019re supposed to be at. Be gentle with yourself today. Writing can help when you\u2019re ready \u2014 and only if you want to.",
    to: "/app/journal", cta: "Open your journal",
  },
  {
    key: "same", label: "I feel about the same",
    ack: "Steady is completely okay. Not every season is a shift, and there\u2019s nothing you need to change. Thank you for taking the moment to check in with yourself.",
    to: null, cta: null,
  },
  {
    key: "again", label: "I\u2019d like to reflect again",
    ack: "Take all the time you need \u2014 there\u2019s no right amount of reflection. Your Growth Timeline is a good place to notice how you\u2019ve been changing.",
    to: "/app/timeline", cta: "Open your Growth Timeline",
  },
];

// Deterministic daily pick: a woven line stays stable across a day and across
// re-renders, but gently rotates from one day to the next.
export function dailyPick(arr) {
  if (!arr || !arr.length) return "";
  const now = new Date();
  const dayNum = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000);
  return arr[dayNum % arr.length];
}

// Onboarding — reasons someone is here. These guide reflection only.
// They are never used to label a person permanently.
export const ONBOARDING = [
  "I have not dated in a long time.",
  "I am healing from a past relationship or trauma.",
  "I want to move slowly.",
  "I want clearer communication around intimacy.",
  "I am neurodivergent and want direct communication.",
  "I am older and dating again.",
  "I am exploring a new connection.",
  "I want to understand my own boundaries.",
  "I am in a relationship and want better transparency.",
  "Other / I prefer not to say.",
];

// Relationship Blueprint — how someone enters connection.
export const BLUEPRINT = [
  {
    key: "needs",
    prompt: "When getting to know someone, I usually need:",
    multi: true,
    options: [
      "Time", "Consistency", "Clear communication", "Emotional safety",
      "Physical space", "Reassurance", "Patience", "Directness", "Friendship first",
    ],
  },
  {
    key: "pace",
    prompt: "My pace is usually:",
    multi: false,
    options: ["Very slow", "Slow", "Moderate", "Flexible", "Fast when I feel safe", "I am still learning"],
  },
  {
    key: "safest",
    prompt: "I feel safest when someone:",
    multi: true,
    options: [
      "Asks before assuming", "Checks in with me", "Respects \u201cnot yet\u201d",
      "Does not rush physical affection", "Communicates clearly", "Follows through",
      "Gives me space to process", "Does not pressure me",
    ],
  },
];

// Turn saved Blueprint answers into an encouraging, shareable narrative (v1.1 §6).
// Deterministic, offline, and tone-controlled — never a raw readout of chips.
// Returns { lines: string[], closing: string[] } or null if nothing is answered.
const BP_NEED_PHRASES = {
  "Time": "time to let things unfold",
  "Consistency": "consistency you can count on",
  "Clear communication": "clear, honest communication",
  "Emotional safety": "a sense of emotional safety",
  "Physical space": "room for your own space",
  "Reassurance": "gentle reassurance along the way",
  "Patience": "patience rather than pressure",
  "Directness": "directness over guessing",
  "Friendship first": "friendship as the foundation",
};
const BP_PACE_LINES = {
  "Very slow": "You move very slowly, letting trust \u2014 not urgency \u2014 set the pace.",
  "Slow": "You prefer a slow, steady pace where nothing feels rushed.",
  "Moderate": "You keep a balanced pace, neither rushing nor holding back.",
  "Flexible": "Your pace is flexible, shaped by how safe a connection feels.",
  "Fast when I feel safe": "Once you feel genuinely safe you can grow close with ease \u2014 and you take your time until then.",
  "I am still learning": "You\u2019re still discovering your own pace, and you\u2019re giving yourself room to learn it.",
};
const BP_SAFE_PHRASES = {
  "Asks before assuming": "asks before assuming",
  "Checks in with me": "checks in with you",
  "Respects \u201cnot yet\u201d": "respects a \u201cnot yet\u201d",
  "Does not rush physical affection": "doesn\u2019t rush physical affection",
  "Communicates clearly": "communicates clearly",
  "Follows through": "follows through on what they say",
  "Gives me space to process": "gives you space to process",
  "Does not pressure me": "never pressures you",
};

function bpJoin(arr) {
  const a = arr.filter(Boolean);
  if (a.length === 0) return "";
  if (a.length === 1) return a[0];
  if (a.length === 2) return `${a[0]} and ${a[1]}`;
  return `${a.slice(0, -1).join(", ")}, and ${a[a.length - 1]}`;
}

export function blueprintNarrative(answers) {
  if (!answers) return null;
  const needs = Array.isArray(answers.needs) ? answers.needs : [];
  const pace = answers.pace || "";
  const safest = Array.isArray(answers.safest) ? answers.safest : [];
  if (!needs.length && !pace && !safest.length) return null;

  const lines = [];

  if (needs.length) {
    const frags = needs.map((n) => BP_NEED_PHRASES[n]).filter(Boolean);
    if (frags.length) lines.push(`When you\u2019re getting to know someone, you tend to look for ${bpJoin(frags)}.`);
  }
  if (pace && BP_PACE_LINES[pace]) lines.push(BP_PACE_LINES[pace]);
  if (safest.length) {
    const frags = safest.map((s) => BP_SAFE_PHRASES[s]).filter(Boolean);
    if (frags.length) lines.push(`You feel safest when someone ${bpJoin(frags)}.`);
  }

  // Gentle interpretive touches so it reads as insight, not a checklist.
  if (needs.includes("Consistency")) lines.push("You value consistency over intensity.");
  if (needs.includes("Clear communication") || needs.includes("Directness") || safest.includes("Communicates clearly"))
    lines.push("You appreciate clarity over guessing.");
  if ((pace === "Slow" || pace === "Very slow") &&
      (safest.includes("Does not rush physical affection") || needs.includes("Friendship first")))
    lines.push("You tend to build trust through conversation before physical affection.");
  if (safest.includes("Respects \u201cnot yet\u201d") || safest.includes("Does not pressure me"))
    lines.push("You honor your own \u201cnot yet,\u201d and you deserve someone who honors it too.");

  return {
    lines,
    closing: ["Your boundaries aren\u2019t walls.", "They\u2019re the foundation of meaningful connection."],
  };
}

// Comfort spectrum. `UNSURE` is a separate state, never a point on the line.
export const COMFORT_LEVELS = [
  "Not comfortable",
  "Maybe later",
  "Open with conversation",
  "Comfortable",
  "Very comfortable",
];
export const UNSURE = "Unsure / still learning";

// The Comfort Map taxonomy.
// NOTE: physical/intimate touch is intentionally NOT here — it lives in the
// dedicated Physical Intimacy Comfort section (see INTIMACY_CATEGORIES below),
// which uses a gentler 7-state scale and per-item privacy. The Comfort Map
// links into it via an entry card so nothing is asked twice.
export const COMFORT_CATEGORIES = [
  {
    key: "emotional",
    title: "Emotional connection",
    items: [
      "Daily texting", "Deep conversations", "Sharing personal history",
      "Talking about past relationships", "Talking about trauma",
      "Discussing future hopes", "Exclusivity conversations",
    ],
  },
  {
    key: "social",
    title: "Social & life integration",
    items: [
      "Going on dates", "Meeting friends", "Meeting family", "Posting online",
      "Attending events together", "Traveling together", "Spending holidays together",
    ],
  },
  {
    key: "communication",
    title: "Communication",
    items: [
      "Phone calls", "Video calls", "Direct conversations about boundaries",
      "Discussing conflict", "Asking for reassurance", "Saying when something feels uncomfortable",
    ],
  },
];

// Check-in prompts.
export const CHECKIN = {
  before: [
    "What am I open to today?",
    "What am I not open to today?",
    "Is there anything I want them to know?",
    "What would help me feel respected?",
  ],
  after: [
    "Did I feel safe?",
    "Did I feel heard?",
    "Did anything feel unclear?",
    "Is there anything I want to update in my Comfort Map?",
  ],
};

// Neutral shared-space states. Never "match" / "mismatch".
export function compareLevels(a, b) {
  if (!a || !b) return { state: "slow", label: "Needs more clarity" };
  if (a === b) return { state: "shared", label: "Shared comfort" };
  const i = COMFORT_LEVELS.indexOf(a);
  const j = COMFORT_LEVELS.indexOf(b);
  if (i === -1 || j === -1) return { state: "slow", label: "Move slowly here" };
  return Math.abs(i - j) <= 1
    ? { state: "talk", label: "Conversation" }
    : { state: "slow", label: "Move slowly here" };
}

// Gentle opening lines to help someone start a conversation about an item.
// Adapts to the comfort level they've marked. Always an offer, never a demand,
// and never scripts the other person. Returns { line, alt } or null.
export function opener(item, level) {
  if (!item || !level) return null;
  const mid = item.charAt(0).toLowerCase() + item.slice(1); // mid-sentence
  const cap = item; // items are already capitalized for sentence starts

  switch (level) {
    case "Not comfortable":
      return {
        line: `\u201cWhen it comes to ${mid}, this isn\u2019t something I\u2019m comfortable with right now \u2014 I\u2019d rather be honest than leave you guessing.\u201d`,
        alt: "\u201cThat might change with time, but today a no is a kind answer, not a rejection.\u201d",
      };
    case "Maybe later":
      return {
        line: `\u201c${cap} is something I\u2019d like to get to eventually \u2014 just not yet. Can we come back to it?\u201d`,
        alt: "\u201cNo timeline in mind. I just wanted you to know it\u2019s a \u2018not yet,\u2019 not a \u2018no.\u2019\u201d",
      };
    case "Open with conversation":
      return {
        line: `\u201cI\u2019m open to ${mid} \u2014 can we talk about what would make it feel easy and welcome for both of us?\u201d`,
        alt: "\u201cNo pressure either way \u2014 I just didn\u2019t want to assume.\u201d",
      };
    case "Comfortable":
      return {
        line: `\u201cI feel good about ${mid}. I wanted to say so out loud so it isn\u2019t a question mark.\u201d`,
        alt: "\u201cAnd if that ever shifts, I\u2019ll tell you \u2014 I\u2019d want the same from you.\u201d",
      };
    case "Very comfortable":
      return {
        line: `\u201c${cap} feels really easy and good for me \u2014 I\u2019m glad to share that with you.\u201d`,
        alt: "\u201cStill always up for a check-in \u2014 comfort now doesn\u2019t skip the ask later.\u201d",
      };
    case UNSURE:
      return {
        line: `\u201cHonestly, I\u2019m still figuring out how I feel about ${mid}. Can we take it slow and check in as we go?\u201d`,
        alt: "\u201cNot knowing yet is okay too \u2014 I\u2019d rather discover it than pretend.\u201d",
      };
    default:
      return null;
  }
}

// Shared-space conversation starter. Tuned to the topic AND to the MORE CAUTIOUS
// of the two comfort levels, which always sets the pace. Invitational: it opens
// the door and offers to match the other's pace, and never scripts them.
const STARTER_BY_LEVEL = {
  "Not comfortable": "I\u2019d love to understand how you feel about {t} \u2014 no pressure, and no wrong answer.",
  "Maybe later": "Where are you with {t} these days? No timeline \u2014 I just want to stay on the same page.",
  "Open with conversation": "What would make {t} feel easy and welcome for you?",
  "Comfortable": "I feel good about {t} \u2014 how\u2019s it sitting with you? I\u2019d love a pace that works for both of us.",
  "Very comfortable": "I\u2019m really at ease with {t} \u2014 I\u2019d love to hear how you\u2019re feeling, and match your pace.",
  [UNSURE]: "No pressure at all \u2014 where are you with {t} right now? I\u2019m still finding my own footing too.",
};
export function sharedStarter(item, a, b) {
  if (!item) return null;
  const t = item.charAt(0).toLowerCase() + item.slice(1);
  const rank = (x) => (x === UNSURE ? -1 : COMFORT_LEVELS.indexOf(x));
  const cautious = rank(a) <= rank(b) ? a : b; // lower / unsure sets the pace
  const tmpl = STARTER_BY_LEVEL[cautious] || STARTER_BY_LEVEL["Open with conversation"];
  return "\u201c" + tmpl.replace("{t}", t) + "\u201d";
}
export function intimacyStarter(item) {
  if (!item) return null;
  const t = item.charAt(0).toLowerCase() + item.slice(1);
  return "\u201cI\u2019d love to hear how you feel about " + t + ", whenever it feels right \u2014 no pressure.\u201d";
}

// ------------------------------------------------------------------
// Physical Intimacy Comfort — a dedicated, consent-first section.
// Framed for self-awareness and clear communication, never as
// "sexual preferences." Every item is private by default.
// NOTE: overlaps with the existing "Physical affection" comfort
// category (Sitting close / Hugging / Kissing…). Reconcile later so
// people don't answer the same items twice.
// ------------------------------------------------------------------

export const INTIMACY_INTRO =
  "Your comfort belongs to you. There are no right or wrong answers. " +
  "Tethra is not here to encourage intimacy. It is here to support " +
  "self-awareness, honest communication, mutual respect, and informed consent.";

// A distinct scale — not the 5-point Comfort spectrum.
export const INTIMACY_STATES = [
  "Not comfortable",
  "Maybe someday",
  "Comfortable with discussion",
  "Comfortable with someone I trust",
  "Comfortable",
  "I\u2019m still discovering this",
  "Prefer not to answer",
];

export const INTIMACY_CONTEXTS = [
  "We\u2019ve built emotional trust",
  "We\u2019ve talked about it beforehand",
  "I\u2019m the one initiating",
  "We\u2019re in a committed relationship",
  "I feel emotionally connected",
  "It depends on the situation",
  "I\u2019d rather discuss this together",
];

// Only `partner` ever exposes an item to a shared space. The other three
// stay fully private and simply record the owner's intent.
export const INTIMACY_VISIBILITY = [
  { key: "only-me", label: "Only me", badge: "DEFAULT", sharesToPartner: false },
  { key: "partner", label: "Share with partner", sharesToPartner: true },
  { key: "discuss", label: "Share after we discuss together", sharesToPartner: false },
  { key: "later", label: "Share later", sharesToPartner: false },
];
export const INTIMACY_DEFAULT_VISIBILITY = "only-me";

export const INTIMACY_SECTION = { title: "Physical Intimacy Comfort", icon: "intimacy" };

export const INTIMACY_CATEGORIES = [
  {
    key: "affection",
    title: "Affection",
    sub: "Everyday closeness",
    icon: "affection",
    items: ["Sitting close", "Holding hands", "Hugging", "Cuddling", "Kissing"],
  },
  {
    key: "romantic",
    title: "Romantic Intimacy",
    sub: "Tender, connected moments",
    icon: "connection",
    items: ["Slow dancing", "Massage", "Sharing a bed", "Falling asleep together", "Bathing together"],
  },
  {
    key: "sexual",
    title: "Sexual Intimacy",
    sub: "At your own pace, only if you choose",
    icon: "consent",
    items: ["Making out", "Mutual touch", "Oral sex", "Penetrative sex", "Trying new activities", "Discussing fantasies"],
  },
];
