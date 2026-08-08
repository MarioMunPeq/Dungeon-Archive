interface ParagraphBlockProps {
  readonly text: string;
}

export function ParagraphBlock({ text }: ParagraphBlockProps) {
  return <p className="text-sm leading-relaxed text-foreground">{text}</p>;
}
