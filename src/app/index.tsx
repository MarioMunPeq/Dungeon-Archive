import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "@/app/router";
import { AppLayout } from "@/app/layouts/app-layout";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { SnackbarProvider } from "@/components/ui";
import { AuthProvider } from "@/features/auth/auth-provider";

export function App() {
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
