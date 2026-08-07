import { useSyncExternalStore } from "react";
import { isCompendiumLoaded, subscribeCompendiumLoaded } from "../compendium/loader";

export function useCompendiumLoaded(): boolean {
  return useSyncExternalStore(subscribeCompendiumLoaded, isCompendiumLoaded, isCompendiumLoaded);
}
