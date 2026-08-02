import { fakeFirebaseState } from "./_fake-firebase-state";

export interface FakeApp {
  name: string;
}

export function getApps(): unknown[] {
  return fakeFirebaseState.apps;
}

export function getApp(): FakeApp {
  const app = fakeFirebaseState.apps[0] as FakeApp | undefined;
  if (!app) throw new Error("No Firebase App has been created");
  return app;
}

export function initializeApp(): FakeApp {
  const app: FakeApp = { name: "fake-app" };
  fakeFirebaseState.apps.push(app);
  return app;
}
