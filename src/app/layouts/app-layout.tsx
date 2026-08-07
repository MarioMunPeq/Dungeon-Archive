import type { ReactNode } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { RouteTransition } from "@/components/layout/route-transition";
import { Onboarding } from "@/features/onboarding/onboarding";
import { useApplyTheme } from "@/features/theme/use-apply-theme";
import { useScrollRestoration } from "./use-scroll-restoration";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const mainRef = useScrollRestoration();
  useApplyTheme();
  return (
    <div className="mx-auto flex h-dvh w-full max-w-screen-xl flex-col overflow-hidden">
      <TopBar />
      <main ref={mainRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-4">
        <RouteTransition>{children}</RouteTransition>
      </main>
      <BottomNav />
      <Onboarding />
    </div>
  );
}
