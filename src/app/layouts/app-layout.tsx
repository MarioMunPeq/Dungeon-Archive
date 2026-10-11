import type { ReactNode } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { RouteTransition } from "@/components/layout/route-transition";
import { ScrollElementProvider } from "@/components/virtual";
import { Onboarding } from "@/features/onboarding/onboarding";
import { useApplyLanguage } from "@/features/language/use-apply-language";
import { useApplyTheme } from "@/features/theme/use-apply-theme";
import { useScrollRestoration } from "./use-scroll-restoration";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const mainRef = useScrollRestoration();
  useApplyTheme();
  useApplyLanguage();
  return (
    <div className="mx-auto flex h-dvh w-full max-w-screen-xl flex-col overflow-hidden">
      <TopBar />
      <main
        ref={mainRef}
        className="language-content min-h-0 flex flex-1 flex-col overflow-y-auto overscroll-contain pb-4"
      >
        <ScrollElementProvider elementRef={mainRef}>
          <RouteTransition>{children}</RouteTransition>
        </ScrollElementProvider>
      </main>
      <BottomNav />
      <Onboarding />
    </div>
  );
}
