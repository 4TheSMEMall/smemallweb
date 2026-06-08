"use client";

/**
 * Client-side providers wrapper.
 *
 * WHY a separate file?
 * The root layout.tsx is a Server Component. React context (AuthProvider,
 * QueryClientProvider) can only run on the client. Next.js requires you to
 * push client code down as far as possible. This file is the boundary —
 * it's marked 'use client' so everything below it can use hooks and context.
 */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AuthProvider } from "@/contexts/AuthContext";

export function Providers({ children }: { children: React.ReactNode }) {
  // useState ensures each user session gets its own QueryClient instance
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: 1, staleTime: 5 * 60 * 1000 },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}
