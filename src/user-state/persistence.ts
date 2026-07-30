import type { UserState } from "./types";
import { STORAGE_KEY, createDefaultState } from "./types";
import { migrate } from "./migrations";

export function read(): UserState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return createDefaultState();

    const parsed = JSON.parse(raw) as unknown;
    return migrate(parsed);
  } catch {
    return createDefaultState();
  }
}

export function write(state: UserState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    console.warn("user-state: localStorage write failed, state kept in memory only");
  }
}
