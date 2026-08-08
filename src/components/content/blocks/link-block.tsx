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
      className="text-primary-muted underline underline-offset-2 transition-colors hover:text-foreground active:text-foreground"
    >
      {text}
    </a>
  );
}
