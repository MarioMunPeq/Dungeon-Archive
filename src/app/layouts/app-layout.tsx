import type { ReactNode } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Onboarding } from "@/features/onboarding/onboarding";
import { useScrollRestoration } from "./use-scroll-restoration";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const mainRef = useScrollRestoration();
  return (
    <div className="mx-auto flex h-dvh w-full max-w-screen-xl flex-col bg-background">
      <TopBar />
      <main
        ref={mainRef}
        className="flex-1 overflow-y-auto pb-[calc(5rem_+_env(safe-area-inset-bottom))]"
      >
        {children}
      </main>
      <BottomNav />
      <Onboarding />
    </div>
  );
}
