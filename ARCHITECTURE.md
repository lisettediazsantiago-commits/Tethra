# Tethra Architecture — Blueprint & Shared Spaces

_Last updated: this reflects the current single-space MVP and the planned path to
multiple Shared Spaces. Nothing here requires changes today; it documents why the
current schema is already a sound foundation and exactly what changes later._

## Guiding principle

**One Personal Blueprint per user → many Shared Spaces.** A person is themselves
across every relationship; each relationship is its own private world. The data is
laid out to honor both, and to never compare one relationship to another.

```
User
 └─ Personal Blueprint   (who you are, in general)
     └─ Shared Space #1   (a private relationship world)
     └─ Shared Space #2
     └─ Shared Space #3   …future
```

## What already exists today (and is already scalable)

The Personal Blueprint and the Shared Space are **already separate** in Firestore.
This is the important part: the hard structural split the future needs is done.

### Personal Blueprint — per user, relationship-independent
These documents belong to the person and are never owned by a space:

| Data | Location |
| --- | --- |
| Comfort map | `comfortMaps/{uid}` |
| Intimacy map | `intimacyMaps/{uid}` |
| Identity (symbol / initials / visibility) | `users/{uid}.identity` |
| Connection preferences | `users/{uid}.connectionPrefs` |
| Blueprint / onboarding | `users/{uid}` |

### Shared Space — already its own document
Each space is a standalone doc, keyed by its invite code:

```
sharedSpaces/{code}
  createdBy:      uid
  invitedUserId:  uid | null
  status:         "pending" | "active"
  members: {
    {uid}: {                     // a SNAPSHOT, copied in by that person
      name, comfort[], intimacy[],
      identity: { type, symbol } | null   // only if visibility allows
    }
  }
```

Only the fields each person **chose to share** are copied into `members`. Raw maps
never leave `comfortMaps/{uid}` / `intimacyMaps/{uid}`. Privacy is enforced at the
point the snapshot is written, not by hiding on read.

## The only things that assume "one space"

Two — and both are small, contained changes, not a redesign:

1. **The user → space link is a single pointer.**
   `users/{uid}.sharedSpaceId` holds one code.

2. **A few per-relationship flags live flat on the user doc** instead of being
   tagged to a space:
   - `users/{uid}.savedConversations` — saved differences
   - `users/{uid}.profileRevealed` — whether the symbol is revealed in the space

Everything else (the blueprint, the space documents themselves) is already
multi-space-ready.

## Migration path to multiple Shared Spaces (future, no redesign)

When multi-space is on the roadmap, the change is mechanical:

1. **Turn the single pointer into a list.** Replace `users/{uid}.sharedSpaceId`
   with a subcollection:
   ```
   users/{uid}/spaces/{code}
     role:         "creator" | "invited"
     label:        "Partner" | "Best friend" | "Family" | …
     savedConversations: [ … ]     // moved here, now per-space
     profileRevealed:    bool       // moved here, now per-space
     joinedAt
   ```
   A back-fill writes the existing single `sharedSpaceId` (and the two flags) into
   one `spaces/{code}` entry. One-time, non-destructive.

2. **Scope per-space state to the space.** `savedConversations` and
   `profileRevealed` move from `users/{uid}` into `users/{uid}/spaces/{code}`.
   Screens that read them take a `spaceId` instead of assuming the single space.

3. **Add a space picker.** The Shared Space screen gains a switcher across the
   user's `spaces` subcollection; each selection loads that one space. The active
   space's id flows down to `SharedSpace`, `Saved`, and the snapshot builder.

4. **Snapshots stay identical.** `sharedSpaces/{code}` and its `members` shape do
   **not** change — a person just belongs to more than one.

Nothing above rewrites the blueprint or the space document. It adds a layer
between the user and their spaces.

## Invariants to preserve (the philosophy, in code terms)

- **No cross-space leakage.** Data from one `sharedSpaces/{code}` must never be
  read into another. The blueprint is the only thing shared across spaces, and
  only because the user chose what to snapshot from it.
- **No comparison across relationships.** There is no aggregate "who understands
  whom better" score, and there should never be. Each space renders only its own
  differences.
- **Privacy stays write-time.** Continue copying only chosen fields into
  `members`; never rely on client-side hiding of raw data.
- **Reuse is opt-in.** When a user creates a new space, nothing from the blueprint
  is shared until they explicitly choose to share it into that space.

## Summary

The `User → Blueprint → many Spaces` shape is already the shape of the data. Going
multi-space later means adding a `users/{uid}/spaces` subcollection, moving two
flags into it, and adding a picker — a contained, additive change. The working
single-space MVP does **not** need to be refactored now to keep that path open.
