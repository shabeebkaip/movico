"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { PropsWithChildren, useState } from "react";
import { usePathname } from "next/navigation";
import SmoothScroll from "@/components/SmoothScroll";

export default function Providers({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      {/* Sonner is the only toast system actually used anywhere in the app
          (see CMSContext + admin pages). The shadcn Radix <Toaster /> had no
          call sites (`useToast()` was never invoked) — pure dead weight
          shipped to every visitor, so it's removed rather than mounted.
          Same for the global <TooltipProvider>: the only Radix Tooltip user
          (admin sidebar) already wraps its own local provider, so the
          app-wide one had no consumers either. */}
      <Sonner />
      {isAdmin ? children : <SmoothScroll>{children}</SmoothScroll>}
    </QueryClientProvider>
  );
}
