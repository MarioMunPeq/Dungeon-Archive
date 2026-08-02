import type { ReactNode } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { useScrollRestoration } from "./use-scroll-restoration";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const mainRef = useScrollRestoration();
  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col bg-background">
      <TopBar />
      <main ref={mainRef} className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
