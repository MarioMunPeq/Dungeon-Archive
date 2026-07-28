import type { EntityVersion, CompendiumEntry } from "@/types/compendium";

const registry = new Map<string, EntityVersion[]>();

export function buildRegistry(entities: readonly CompendiumEntry[]): void {
  for (const entity of entities) {
    const version: EntityVersion = {
      id: entity.id,
      source: entity.source,
      category: entity.category,
    };
    const versions = registry.get(entity.canonicalId);
    if (versions) {
      versions.push(version);
    } else {
      registry.set(entity.canonicalId, [version]);
    }
  }
}

export function getVersions(canonicalId: string): readonly EntityVersion[] | null {
  const versions = registry.get(canonicalId);
  return versions ? versions : null;
}

export function isRegistered(canonicalId: string): boolean {
  return registry.has(canonicalId);
}

export function clearRegistry(): void {
  registry.clear();
}

export function registrySize(): number {
  return registry.size;
}
