import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppRouter } from "@/app/router";
import { AppLayout } from "@/app/layouts/app-layout";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { SnackbarProvider } from "@/components/ui";
import { AuthProvider } from "@/features/auth/auth-provider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}
