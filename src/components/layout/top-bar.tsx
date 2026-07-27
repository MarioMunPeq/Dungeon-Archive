import { APP_NAME } from "@/config/constants";

interface TopBarProps {
  readonly title?: string;
}

export function TopBar({ title = APP_NAME }: TopBarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center border-b border-border bg-background/95 px-4 backdrop-blur-sm">
      <h1 className="text-lg font-semibold">{title}</h1>
    </header>
  );
}
