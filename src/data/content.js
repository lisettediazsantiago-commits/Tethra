// All product copy and taxonomy lives here so tone stays consistent
// and non-judgmental across every screen. Edit language in one place.

export const TAGLINES = [
  "Move at the pace of trust.",
  "Connection without assumption.",
  "Know your pace. Share your truth. Grow with care.",
];

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
