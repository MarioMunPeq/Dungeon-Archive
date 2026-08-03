# Firebase Setup and Security

Cloud Backup is an **optional** feature. It is a manual snapshot of local state so a user
can recover a campaign after losing a device or moving to a new one. It is **not** a sync
engine, an account system, or part of the core architecture.

Everything works with zero internet. Firebase code lives behind `src/sync/firebase.ts`,
is loaded lazily, and only runs when a build includes Firebase configuration.

This document covers how to configure the backend for Cloud Backup. No code changes are
required — everything here is Firebase Console / deployment configuration.

---

## Authentication providers

The app only uses Google Sign-In with a popup.

1. In [Firebase Console](https://console.firebase.google.com) open your project.
2. Go to **Authentication → Sign-in method**.
3. Enable **Google** and set a public-facing project name + support email.
4. Authorized domains: the app is served from GitHub Pages. Ensure the deployed domain
   (e.g. `<your-user>.github.io`) is listed under **Authentication → Settings →
   Authorized domains**. `localhost` is already allowed for local development.

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

The app resolves the owning `uid` internally from `auth.currentUser`. No UID is ever
accepted as a parameter, so the Firestore rules must **not** trust any request field.

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

- The path segment `{uid}` is only used to match the requesting user; the rule must
  compare it against `request.auth.uid`.
- Do **not** grant broad `allow read, write` on `/users`.
- There is no server-side validation of payload size/shape. The app serializes a small
  local state document (tens of KB), well within Firestore's 1 MiB document limit.

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

These values are **public by design** (they ship in the client bundle). Restricting access
is the job of the Firestore rules above, never of the keys.

- Build-time: Vite inlines `import.meta.env.VITE_FIREBASE_*`.
- If any variable is empty, `hasCloudConfig()` returns `false`, the Backup route is not
  mounted, and Firebase is never imported.

---

## Hosting notes

The app deploys to GitHub Pages with a base path of `/dungeon-archive/` (see the GitHub
Actions workflow and `vite.config.ts`).

- Firebase itself does **not** host the app. Only Authentication and Firestore are used.
- Authorize the GitHub Pages origin in Firebase Authentication (see above).
- The PWA service worker must be deployed from the same origin as the app so offline
  caching and auth share the same origin.

---

## Deployment checklist

1. Firebase project created, Google sign-in enabled, Firestore rules deployed
   (use the rules above in **Firestore → Rules**).
2. GitHub Pages domain added to **Authorized domains**.
3. `.env` created locally from `.env.example` with real values (never committed).
4. `pnpm build` — confirm the build output contains no Firebase references if you want
   the feature fully disabled (see "Disabling cloud" in the README).
5. Deploy the `dist/` folder to GitHub Pages.
6. Verify on the live URL:
   - Sign in with Google (popup) works.
   - Sign-in survives a page refresh.
   - Upload writes to `users/{uid}/backup` in Firestore.
   - A second device (or incognito) signs in with the same account and restores.
   - The Backup page works offline and disables upload/restore.
   - A fresh build without Firebase env vars ships no backup UI at all.

---

## Failure mapping

Firebase errors are translated by `src/sync/errors.ts` before reaching the UI:

| Condition                                              | Message shown                    |
| ------------------------------------------------------ | -------------------------------- |
| Popup closed by the user / cancelled popup request     | `Sign in was cancelled.`         |
| `navigator.onLine === false` or network unavailable     | `You're offline.`                |
| Firestore `permission-denied`                          | `You don't have access to this backup.` |
| Anything else                                          | `Something went wrong. Try again.` |

Firebase messages and error codes never reach the user.
