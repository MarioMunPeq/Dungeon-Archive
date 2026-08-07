import { useMemo } from "react";
import type { ReactNode } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useScrollElementRef } from "./scroll-element-context";

export interface VirtualGridProps<T> {
  readonly items: readonly T[];
  readonly renderItem: (item: T, index: number) => ReactNode;
  readonly getItemKey?: (item: T, index: number) => string;
  readonly columnCount?: number;
  /** Gap in px between columns and rows. */
  readonly gap?: number;
  readonly estimateRowHeight?: number;
  readonly overscan?: number;
  /** Render a 1px top border between rows (replaces divide-y for virtual rows). */
  readonly divide?: boolean;
  readonly role?: string;
  readonly ariaLabel?: string;
  readonly id?: string;
}

function defaultItemKey(_item: unknown, index: number): string {
  return String(index);
}

/**
 * Renders items against the app scroll element, keeping only the visible rows
 * plus an overscan margin in the DOM. When no scroll element is available
 * (SSR, tests, initial boot before `<main>` mounts) it falls back to rendering
 * every item in normal flow, which keeps SSR output and first paint identical
 * to the pre-virtualization layout.
 */
export function VirtualGrid<T>({
  items,
  renderItem,
  getItemKey = defaultItemKey,
  columnCount = 2,
  gap = 8,
  estimateRowHeight = 96,
  overscan = 8,
  divide = false,
  role,
  ariaLabel,
  id,
}: VirtualGridProps<T>) {
  const scrollRef = useScrollElementRef();
  const scrollElement = scrollRef?.current ?? null;

  const rows = useMemo(() => {
    const rowCount = Math.ceil(items.length / columnCount);
    const out: (readonly T[])[] = new Array(rowCount);
    for (let i = 0; i < rowCount; i++) {
      const start = i * columnCount;
      out[i] = items.slice(start, Math.min(start + columnCount, items.length));
    }
    return out;
  }, [items, columnCount]);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollElement,
    estimateSize: () => estimateRowHeight,
    overscan,
    gap: divide ? 0 : gap,
  });

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
    gap,
  } as const;

  const listProps = {
    role,
    "aria-label": ariaLabel,
    id,
  };

  if (!scrollElement) {
    return (
      <div {...listProps}>
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={divide && rowIndex > 0 ? "border-t border-border" : undefined}
            style={rowIndex > 0 && !divide ? { paddingTop: gap } : undefined}
          >
            <div style={gridStyle}>
              {row.map((item, col) => {
                const index = rowIndex * columnCount + col;
                return <div key={getItemKey(item, index)}>{renderItem(item, index)}</div>;
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const virtualRows = virtualizer.getVirtualItems();

  return (
    <div {...listProps}>
      <div style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
        {virtualRows.map((row) => {
          const rowItems = rows[row.index]!;
          return (
            <div
              key={row.key}
              data-index={row.index}
              ref={virtualizer.measureElement}
              className={divide && row.index > 0 ? "border-t border-border" : undefined}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${row.start}px)`,
              }}
            >
              <div style={gridStyle}>
                {rowItems.map((item, col) => {
                  const index = row.index * columnCount + col;
                  return <div key={getItemKey(item, index)}>{renderItem(item, index)}</div>;
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface VirtualListProps<T> extends Omit<VirtualGridProps<T>, "columnCount"> {
  readonly gap?: number;
}

/** Single-column virtualized list. */
export function VirtualList<T>({ gap = 0, ...rest }: VirtualListProps<T>) {
  return <VirtualGrid<T> {...rest} columnCount={1} gap={gap} />;
}
