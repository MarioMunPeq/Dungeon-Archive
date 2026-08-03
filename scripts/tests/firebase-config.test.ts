import { strictEqual } from "node:assert";

const { isFirebaseConfigured, getFirebaseApp } = await import("../../src/lib/firebase/config");
const { getAuthInstance } = await import("../../src/lib/firebase/auth");
const { getFirestoreInstance } = await import("../../src/lib/firebase/firestore");

strictEqual(isFirebaseConfigured(), false);
strictEqual(getFirebaseApp(), null);
strictEqual(getAuthInstance(), null);
strictEqual(getFirestoreInstance(), null);

console.log("✓ firebase modules stay inert without configuration");
