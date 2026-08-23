import type { ReactNode } from "react";
import { Inline, Section, Surface } from "@/components/ui";

const GITHUB_URL = "https://github.com/MarioMunPeq";
const LINKEDIN_URL = "https://es.linkedin.com/in/mario-mu%C3%B1oz-peque%C3%B1o";

interface LinkButtonProps {
  readonly href: string;
  readonly children: ReactNode;
}

function LinkButton({ href, children }: LinkButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="touch-comfortable inline-flex items-center justify-center gap-2 rounded-control border border-border px-4 py-2 text-sm font-medium text-foreground transition-all duration-150 hover:bg-accent active:scale-95 active:bg-accent/80"
    >
      {children}
    </a>
  );
}

export function HelpPage() {
  return (
    <div className="flex flex-col gap-6 px-4 py-6">
      <Section title="Quick help">
        <Surface>
          <div className="flex flex-col gap-2">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Press and hold any stat, ability score, or item to see what it means.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              The Rules tab in the Archive has a Beginner tips toggle that shows small ? helpers
              next to rules as you play.
            </p>
          </div>
        </Surface>
      </Section>

      <Section title="About this project">
        <Surface>
          <div className="flex flex-col gap-3">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Dungeon Archive is a personal project: a mobile-first companion for tabletop RPG
              players, designed to sit next to the table and answer rules questions in seconds.
              Every screen is checked against a written Design DNA before it ships.
            </p>
            <Inline>
              <LinkButton href={GITHUB_URL}>GitHub</LinkButton>
              <LinkButton href={LINKEDIN_URL}>LinkedIn</LinkButton>
            </Inline>
          </div>
        </Surface>
      </Section>
    </div>
  );
}
