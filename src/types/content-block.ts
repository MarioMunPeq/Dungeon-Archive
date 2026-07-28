export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "reference"; target: string; label?: string }
  | { type: "header"; text: string; level?: number }
  | { type: "entries"; blocks: ContentBlock[] };
