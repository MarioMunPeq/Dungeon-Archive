import { initializeApp } from "./_fake-firebase-app";
import type { FakeApp } from "./_fake-firebase-app";

let app: FakeApp | null = null;

export function getFirebaseApp(): FakeApp {
  if (app === null) {
    app = initializeApp();
  }
  return app;
}
