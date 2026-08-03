import { fakeFirebaseState } from "./_fake-firebase-state";

export interface FakeDocRef {
  path: string;
}

export interface FakeDocSnapshot {
  data(): unknown;
}

export function getFirestore(): object {
  return { kind: "fake-firestore" };
}

export function doc(_db: object, ...pathSegments: string[]): FakeDocRef {
  return { path: pathSegments.join("/") };
}

export async function getDoc(ref: FakeDocRef): Promise<FakeDocSnapshot> {
  if (fakeFirebaseState.firestoreError !== null) {
    throw fakeFirebaseState.firestoreError;
  }
  const data = fakeFirebaseState.data.get(ref.path);
  return { data: () => (data === undefined ? undefined : data) };
}

export async function setDoc(ref: FakeDocRef, data: unknown): Promise<void> {
  if (fakeFirebaseState.firestoreError !== null) {
    throw fakeFirebaseState.firestoreError;
  }
  fakeFirebaseState.data.set(ref.path, data);
}
