interface ListBlockProps {
  readonly items: readonly string[];
}

export function ListBlock({ items }: ListBlockProps) {
  return (
    <ul className="list-disc space-y-1 pl-5 leading-relaxed text-foreground">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
