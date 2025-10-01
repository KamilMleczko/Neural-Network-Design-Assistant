"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {/* Add future providers here */}
      {/* <ThemeProvider> */}
      {/* <AuthProvider> */}
      {/* <SocketProvider> */}
      {children}
      {/* </SocketProvider> */}
      {/* </AuthProvider> */}
      {/* </ThemeProvider> */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
