interface DividerProps {
  readonly className?: string;
}

export function Divider({ className = "" }: DividerProps) {
  return <hr className={`my-4 border-border ${className}`.trim()} />;
}
