export function Loading() {
  return (
    <div
      className="flex items-center justify-center p-8"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-primary" />
    </div>
  );
}