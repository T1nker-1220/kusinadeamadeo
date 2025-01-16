'use client';

import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative flex min-h-screen flex-col">
        <div className="flex-1">{children}</div>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}
