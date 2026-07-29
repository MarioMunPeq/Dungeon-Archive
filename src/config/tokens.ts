export const SPACING = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
} as const;

export const RADIUS = {
  sm: "0.25rem",
  md: "0.5rem",
  lg: "0.75rem",
  full: "9999px",
} as const;

export const SHADOW = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
} as const;

export const TRANSITION = {
  fast: "150ms",
  normal: "200ms",
  slow: "300ms",
} as const;

export type SurfaceVariant = "default" | "outlined" | "subtle" | "interactive";
export type SpacingToken = keyof typeof SPACING;
export type RadiusToken = keyof typeof RADIUS;
