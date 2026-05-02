"use client";

import { ReactLenis } from "lenis/react";
import type { PropsWithChildren } from "react";

export default function SmoothScroll({ children }: PropsWithChildren) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 0.8,
        touchMultiplier: 1.5,
      }}
    >
      {children}
    </ReactLenis>
  );
}
