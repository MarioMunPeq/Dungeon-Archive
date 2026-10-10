import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "@/app/router";
import { AppLayout } from "@/app/layouts/app-layout";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { SnackbarProvider } from "@/components/ui";
import { AuthProvider } from "@/features/auth/auth-provider";
import { useLanguage } from "@/user-state";
import { startCloudSession } from "@/sync";

// Cloud session boots once with the app: the gateway is resolved and the auth
// listener is subscribed a single time for the whole session, not per route.
startCloudSession();

export function App() {
  // Translation is context-free (see src/i18n/translate.ts): every label is
  // resolved from the store on render. Subscribing to the language here is what
  // makes the switch take effect — this re-renders the whole tree, so all the
  // `t()` calls across pages and pure helpers recompute in one pass.
  useLanguage();

  return (
    <SnackbarProvider>
      <AuthProvider>
        <BrowserRouter basename="/Dungeon-Archive/">
          <AppLayout>
            <ErrorBoundary>
              <AppRouter />
            </ErrorBoundary>
          </AppLayout>
        </BrowserRouter>
      </AuthProvider>
    </SnackbarProvider>
  );
}
