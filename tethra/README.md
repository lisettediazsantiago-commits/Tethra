# Tethra

**A consent-first space for honest connection.**
Move at the pace of trust.

Tethra is not a dating app and not therapy. It is a guided communication tool that helps people
express their pace, comfort levels, and boundaries with dignity — and, if they choose, share that
with someone so both stop guessing.

This repo is an MVP scaffold: React (Vite) on the front end, Firebase Auth + Firestore for data.

---

## Screens in this MVP

- **Landing** — what Tethra is, three entry points
- **Auth** — email/password sign up & log in
- **Onboarding** — reasons for being here (guides reflection, never labels)
- **Relationship Blueprint** — how you enter connection
- **Comfort Map** — the heart: a spectrum (not yes/no) plus a private "why" layer and a
  per-item "share what helps me feel safe" toggle. Autosaves.
- **Dashboard** — progress and quick links
- **Shared Space** — neutral "conversation" states (never match/mismatch), plus an invite stub
- **Consent Check-in** — before / after prompts
- **Safety & Resources** — disclaimers, support resources, and a global **Quick exit** button
- **Settings** — privacy summary + log out

---

## Getting started

```bash
npm install
cp .env.example .env      # then fill in your Firebase values
npm run dev
```

Open http://localhost:5173.

### Firebase setup

1. Create a project at https://console.firebase.google.com.
2. **Build → Authentication → Sign-in method:** enable **Email/Password**.
3. **Build → Firestore Database:** create a database (start in production mode).
4. **Project settings → Your apps → Web app:** copy the config into your `.env`
   (see `.env.example` — every key is prefixed `VITE_`).
5. Deploy the security rules in `firestore.rules`
   (Firebase console → Firestore → Rules, or `firebase deploy --only firestore:rules`).

---

## Data model (Firestore)

| Collection      | Doc id            | Holds                                                        |
|-----------------|-------------------|-------------------------------------------------------------|
| `users`         | `uid`             | profile, email, onboardingSelections, profileVisibility     |
| `comfortMaps`   | `uid`            | `items` map keyed by `category:item` → level, privateNote, whatHelps, share |
| `blueprints`    | `uid`             | pace, needs, safest answers                                 |
| `checkIns`      | auto id           | userId, type (beforeDate/afterDate), answers                |
| `sharedSpaces`  | auto id           | createdBy, invitedUserId, shareCode, status, permissions    |
| `reflections`   | `uid`             | (reserved for freeform private reflections)                 |

**Privacy model:** private notes live only in the owner's `comfortMaps` document. A shared space
compares only fields the owner has toggled to share; it never grants read access to another
person's private map. See `firestore.rules`.

---

## Deploy

Works on Vercel or Firebase Hosting.

- **Vercel:** import the repo, framework preset **Vite**, add the same `VITE_*` env vars, deploy.
- **Firebase Hosting:** `npm run build`, then `firebase deploy` with `dist` as the public dir.

---

## Language & design rules (please keep)

- Use: *comfort, pace, clarity, shared understanding, conversation opportunity, not yet,
  open with conversation, I'm still learning, what helps me feel safe.*
- Avoid: *match, score, failure, rejection, problem area, red flag* (except in safety education).
- Never use red/green "approval" indicators. States are sage (shared), gold (conversation),
  plum (move slowly).
- All product copy lives in `src/data/content.js` so tone stays consistent.

---

## Next steps (post-MVP)

- Partner join flow (redeem invite code → link `sharedSpaces.invitedUserId`, sync shared fields)
- Growth timeline (comfort levels change over time; celebrate change in any direction)
- Notification-free consent check-in reminders before planned time together
- Localized safety resources by region
