import type { ReactNode } from "react";
import { Subtitle } from "@/components/ui/Typography";

interface EntityHeaderProps {
  /**
   * The top bar already renders the entity name (see getTopBarState), and Design
   * DNA rule 24 makes that the single page title — repeating it in a large
   * in-page heading was duplicating it on every entity page.
   */
  readonly subtitle: ReactNode;
}

/** Metadata line under the (already present) top-bar title. */
export function EntityHeader({ subtitle }: EntityHeaderProps) {
  return <Subtitle>{subtitle}</Subtitle>;
}
