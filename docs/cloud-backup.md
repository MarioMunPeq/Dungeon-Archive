# Cloud Backup

Cloud Backup is an **optional** feature. It is a manual snapshot of local state so a user can
recover their data after losing a device or moving to a new one. It is **not** a sync engine,
an account system, or part of the core architecture.

Everything works with zero internet. The Firebase code lives behind `src/sync/`, is loaded
lazily, and only runs when a build includes Firebase configuration.

This document covers how the feature works and how to configure the backend. No application
code changes are required — everything here is Firebase Console / deployment configuration.

---

## How it works

- The whole app is local-first. Cloud Backup is a manual `Upload` / `Restore` pair on the
  Backup page, reachable from the top bar.
- One document per user in Firestore: `users/{uid}/backup`.
- The app never accepts a UID from the UI or URL; the owning user is always resolved from
  the authenticated session, and the Firestore rules derive access solely from
  `request.auth.uid`.
- Without a signed-in user the Backup page works offline and the upload/restore actions are
  disabled.
- Without Firebase configuration the feature is disabled. The `/backup` route stays mounted,
  but in production builds the top-bar backup entry is hidden and the page shows a
  "Cloud Backup is not available" message; the Firebase SDK is never loaded (it sits behind a
  dynamic import that only executes when Firebase is configured).

---

## Authentication providers

The app only uses **Google Sign-In**, and only via the Firebase `signInWithRedirect` flow in
production builds:

1. `src/features/auth/auth-provider.tsx` mounts `AuthProvider` at the app root. On start it
   calls `resolveRedirectResult()` so a sign-in that redirected back to the app resolves into
   a session, then subscribes to `onAuthStateChanged`.
2. Signing in calls `signInWithGoogle()` from `src/lib/firebase/auth-service.ts`:
   - **Production build** (`import.meta.env.PROD`): full-page redirect to Google and back.
   - **Local development**: popup sign-in, because redirects round-trip badly with Vite HMR.

### Firebase Console setup

1. In [Firebase Console](https://console.firebase.google.com) open your project.
2. Go to **Authentication → Sign-in method** and enable **Google** with a public-facing
   project name and support email.
3. **Authorized domains**: the app is served from GitHub Pages. Add the deployed origin
   (e.g. `<your-user>.github.io` and the project's custom domain, if any) under
   **Authentication → Settings → Authorized domains**. `localhost` is already allowed for
   local development.

No email/password, phone, or anonymous sign-in is enabled.

---

## Firestore structure

One document per user, keyed by the authenticated `uid` (never by a client-supplied value):

```
users/{uid}/backup
```

```ts
interface CloudSnapshot {
  state: UserState;      // full serialized local state
  metadata: {
    createdAt: number;           // ms epoch
    adventureCount: number;
    playerCount: number;
    favoriteCount: number;
    sessionCount: number;
    activeAdventureTitle: string | null;
  };
  updatedAt: number;             // ms epoch of the last upload
  appVersion: string;            // APP_VERSION at upload time
}
```

The metadata still carries the legacy `adventureCount` and `activeAdventureTitle` fields from
the removed Adventure workspace. They are preserved for snapshot shape compatibility and have
no UI; the Backup page surfaces only the player/favorite/session counts.

---

## Required Firestore rules

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Cloud Backup: one document per user. Access is derived exclusively from
    // request.auth.uid — never from a document field or query parameter.
    match /users/{uid}/backup {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }

  }
}
```

Notes:

- The path segment `{uid}` is only used to match the requesting user; the rule compares it
  against `request.auth.uid`.
- Do **not** grant broad `allow read, write` on `/users`.
- There is no server-side validation of payload size/shape. The app serializes a small local
  state document (tens of KB), well within Firestore's 1 MiB document limit.

---

## Environment variables

Create a `.env` file from `.env.example` with the web app values from
**Project settings → Your apps → SDK setup and configuration**:

```text
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

These values are **public by design** (they ship in the client bundle). Restricting access is
the job of the Firestore rules above, never of the keys.

- Build-time: Vite inlines `import.meta.env.VITE_FIREBASE_*`.
- `src/lib/firebase/config.ts` considers Firebase configured when `apiKey`, `authDomain`,
  `projectId`, `appId`, and `messagingSenderId` are all non-empty. `storageBucket` is not part
  of the check. `isFirebaseConfigured()` gates the Firebase gateway, the top-bar backup entry,
  and the Backup page's available state. In development and tests the fake gateway is used so
  the UI can be exercised; production builds without configuration ship a disabled gateway
  (see `src/sync/gateway.ts`).

---

## Hosting notes

The app deploys to GitHub Pages with a base path of `/Dungeon-Archive/` (see the GitHub
Actions workflow and `vite.config.ts`).

- Firebase does **not** host the app. Only Authentication and Firestore are used.
- Authorize the GitHub Pages origin in Firebase Authentication (see above).
- The PWA service worker must be deployed from the same origin as the app so offline caching
  and auth share the same origin.

---

## Deployment checklist

1. Firebase project created, Google sign-in enabled, Firestore rules deployed
   (use the rules above in **Firestore → Rules**).
2. GitHub Pages domain added to **Authorized domains**.
3. `.env` created locally from `.env.example` with real values (never committed).
4. `pnpm build` — the build emits a lazy Firebase chunk, but without configuration it is
   never loaded at runtime (see "Disabling cloud backup" in the README).
5. Deploy the `dist/` folder to GitHub Pages.
6. Verify on the live URL:
   - Sign in with Google (redirect flow) works and lands back on the app signed in.
   - The session survives a page refresh (`onAuthStateChanged` rehydrates it).
   - Upload writes to `users/{uid}/backup` in Firestore.
   - A second device (or incognito) signs in with the same account and restores.
   - The Backup page works offline and disables upload/restore.
   - A fresh build without Firebase env vars hides the top-bar entry and shows the
     "Cloud Backup is not available" state instead.

---

## Failure mapping

Firebase errors are translated by `src/sync/errors.ts` before reaching the UI:

| Condition                                                  | Message shown                    |
| ---------------------------------------------------------- | -------------------------------- |
| `navigator.onLine === false` or a network request failed   | `You're offline.`                |
| Popup closed / cancelled by the user                       | `Sign in was cancelled.`         |
| Firestore `permission-denied`                              | `You don't have access to this backup.` |
| Anything else                                              | `Something went wrong. Try again.` |

Firebase messages and error codes never reach the user.
