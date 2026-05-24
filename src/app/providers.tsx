"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
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
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {isAdmin ? children : <SmoothScroll>{children}</SmoothScroll>}
      </TooltipProvider>
    </QueryClientProvider>
  );
}
