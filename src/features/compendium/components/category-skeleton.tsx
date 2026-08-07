const SKELETON_CARD_COUNT = 8;

export function CategorySkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading category">
      <div className="sticky top-0 z-30 space-y-3 border-b border-border bg-background/95 px-4 pb-3 pt-4 backdrop-blur-sm">
        <div className="h-10 w-full animate-pulse rounded-md bg-elevated" />
        <div className="flex flex-wrap gap-2">
          <div className="h-8 w-24 animate-pulse rounded-full bg-elevated" />
          <div className="h-8 w-24 animate-pulse rounded-full bg-elevated" />
          <div className="h-8 w-24 animate-pulse rounded-full bg-elevated" />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 px-4 py-4">
        <div className="h-4 w-32 animate-pulse rounded bg-elevated" />
        <div className="h-8 w-28 animate-pulse rounded-md bg-elevated" />
      </div>

      <div className="px-4 pb-4">
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: SKELETON_CARD_COUNT }, (_, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 rounded-card border border-border bg-surface p-3"
            >
              <div className="h-4 w-3/4 animate-pulse rounded bg-elevated" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-elevated" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
