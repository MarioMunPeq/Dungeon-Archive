interface HeaderBlockProps {
  readonly text: string;
  readonly level?: number;
}

export function HeaderBlock({ text, level }: HeaderBlockProps) {
  const size =
    level === 1
      ? "text-xl font-bold"
      : level === 2
        ? "text-base font-semibold"
        : "text-sm font-semibold";
  return <p className={`${size} text-foreground`}>{text}</p>;
}
