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
    key: "physical",
    title: "Physical affection",
    items: [
      "Sitting close", "Hugging", "Holding hands", "Cuddling",
      "Kissing", "Touch in public", "Sleeping next to someone", "Sexual intimacy",
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
