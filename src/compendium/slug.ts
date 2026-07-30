export function slugFromCanonicalId(canonicalId: string): string {
  const dot = canonicalId.indexOf(".");
  return dot === -1 ? canonicalId : canonicalId.substring(dot + 1);
}

export function canonicalIdFromSlug(category: string, slug: string): string {
  return `${category}.${slug}`;
}
