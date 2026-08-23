interface IconProps {
  readonly className?: string;
}

export function HomeIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

export function ArchiveIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <rect x="3" y="8" width="18" height="13" rx="2" />
      <path d="M3 8l1.4-3.5A2 2 0 0 1 6.3 3h11.4a2 2 0 0 1 1.9 1.5L21 8" />
      <path d="M3 8h18" />
      <path d="M9.5 13h5" />
    </svg>
  );
}

export function DiceIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M12 2.5l8.5 5v9l-8.5 5-8.5-5v-9z" />
      <circle cx="12" cy="12" r="0.4" fill="currentColor" stroke="none" />
      <circle cx="8" cy="12" r="0.4" fill="currentColor" stroke="none" />
      <circle cx="16" cy="12" r="0.4" fill="currentColor" stroke="none" />
      <circle cx="12" cy="8" r="0.4" fill="currentColor" stroke="none" />
      <circle cx="12" cy="16" r="0.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function CombatIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M14.5 17.5L3 6V3h3l11.5 11.5" />
      <path d="M13 19l6-6" />
      <path d="M16 16l4 4" />
      <path d="M19 21l2-2" />
      <path d="M3 3l2 2" />
      <path d="M14.5 6.5L18 3l3 3-3.5 3.5" />
    </svg>
  );
}

export function CharacterIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
