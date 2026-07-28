export function referenceToUrl(target: string): string {
  const dot = target.indexOf(".");
  if (dot === -1) return `/${target}`;
  return `/${target.substring(0, dot)}/${target.substring(dot + 1)}`;
}

export function referenceLabel(target: string): string {
  const dot = target.indexOf(".");
  return dot === -1 ? target : target.substring(dot + 1).replace(/-/g, " ");
}
