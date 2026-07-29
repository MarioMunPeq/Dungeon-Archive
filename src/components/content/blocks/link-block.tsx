interface LinkBlockProps {
  readonly href: string;
  readonly text: string;
}

export function LinkBlock({ href, text }: LinkBlockProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent-foreground underline underline-offset-2 hover:text-foreground transition-colors"
    >
      {text}
    </a>
  );
}
