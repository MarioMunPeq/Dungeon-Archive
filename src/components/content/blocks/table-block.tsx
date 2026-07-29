import type { TableCell } from "@/types/content-block";

interface TableBlockProps {
  readonly headers: readonly TableCell[];
  readonly rows: readonly (readonly TableCell[])[];
  readonly caption?: string;
}

function cellAlign(align?: string): string {
  switch (align) {
    case "center":
      return "text-center";
    case "right":
      return "text-right";
    default:
      return "text-left";
  }
}

export function TableBlock({ headers, rows, caption }: TableBlockProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        {caption && (
          <caption className="text-xs text-muted-foreground pb-1 text-left">{caption}</caption>
        )}
        <thead>
          <tr className="border-b border-border">
            {headers.map((header, i) => (
              <th
                key={i}
                className={`px-3 py-2 font-semibold text-foreground ${cellAlign(header.align)}`}
              >
                {header.text}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-border last:border-b-0">
              {row.map((cell, j) => (
                <td key={j} className={`px-3 py-2 text-foreground ${cellAlign(cell.align)}`}>
                  {cell.text}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
