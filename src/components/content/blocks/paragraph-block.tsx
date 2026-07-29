interface ParagraphBlockProps {
  readonly text: string;
}

export function ParagraphBlock({ text }: ParagraphBlockProps) {
  return <p className="leading-relaxed text-foreground">{text}</p>;
}
