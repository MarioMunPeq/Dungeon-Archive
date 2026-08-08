import { Link } from "react-router-dom";
import { referenceToUrl, referenceLabel } from "@/compendium";

interface ReferenceBlockProps {
  readonly target: string;
  readonly label?: string;
}

export function ReferenceBlock({ target, label }: ReferenceBlockProps) {
  return (
    <Link
      to={referenceToUrl(target)}
      className="text-primary-muted underline underline-offset-2 transition-colors hover:text-foreground active:text-foreground"
    >
      {label ?? referenceLabel(target)}
    </Link>
  );
}
