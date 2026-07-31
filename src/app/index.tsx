import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppRouter } from "@/app/router";
import { AppLayout } from "@/app/layouts/app-layout";

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
      <BrowserRouter basename="/dungeon-archive/">
        <AppLayout>
          <AppRouter />
        </AppLayout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
