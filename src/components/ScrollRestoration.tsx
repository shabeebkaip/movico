"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function ScrollRestoration() {
  const pathname = usePathname();

  useEffect(() => {
    // ponytail: hash-anchored navigations (e.g. /studio#packages) are handled
    // by the browser/router's native scroll-into-view — forcing scrollTo(0,0)
    // here would stomp on that landing position right after it happens.
    if (window.location.hash) return;
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
