// SceneDivider — zero layout height, purely decorative atmospheric glow
// rendered centered on the boundary between two sections.
// Uses height:0 + overflow:visible so it takes NO space in the page flow.

type SceneDividerProps = {
  tone?: "amber" | "indigo" | "crimson" | "teal" | "amberIndigo";
  from?: "left" | "right" | "center";
  /** Visual spread in px (default 320). Does NOT affect layout. */
  spread?: number;
  intensity?: number;
};

const gradients: Record<
  NonNullable<SceneDividerProps["tone"]>,
  Record<NonNullable<SceneDividerProps["from"]>, string>
> = {
  amber: {
    left:   "radial-gradient(ellipse 50% 100% at 5% 50%, rgba(217,134,41,0.10) 0%, transparent 70%)",
    right:  "radial-gradient(ellipse 50% 100% at 95% 50%, rgba(217,134,41,0.10) 0%, transparent 70%)",
    center: "radial-gradient(ellipse 75% 100% at 50% 50%, rgba(217,134,41,0.08) 0%, transparent 70%)",
  },
  indigo: {
    left:   "radial-gradient(ellipse 50% 100% at 5% 50%, rgba(55,20,110,0.11) 0%, transparent 70%)",
    right:  "radial-gradient(ellipse 50% 100% at 95% 50%, rgba(55,20,110,0.11) 0%, transparent 70%)",
    center: "radial-gradient(ellipse 75% 100% at 50% 50%, rgba(55,20,110,0.09) 0%, transparent 70%)",
  },
  crimson: {
    left:   "radial-gradient(ellipse 50% 100% at 5% 50%, rgba(100,12,12,0.11) 0%, transparent 70%)",
    right:  "radial-gradient(ellipse 50% 100% at 95% 50%, rgba(100,12,12,0.11) 0%, transparent 70%)",
    center: "radial-gradient(ellipse 75% 100% at 50% 50%, rgba(100,12,12,0.09) 0%, transparent 70%)",
  },
  teal: {
    left:   "radial-gradient(ellipse 50% 100% at 5% 50%, rgba(0,60,65,0.10) 0%, transparent 70%)",
    right:  "radial-gradient(ellipse 50% 100% at 95% 50%, rgba(0,60,65,0.10) 0%, transparent 70%)",
    center: "radial-gradient(ellipse 75% 100% at 50% 50%, rgba(0,60,65,0.08) 0%, transparent 70%)",
  },
  amberIndigo: {
    left:   "radial-gradient(ellipse 40% 100% at 5% 50%, rgba(217,134,41,0.08) 0%, transparent 65%), radial-gradient(ellipse 40% 100% at 95% 50%, rgba(55,20,110,0.08) 0%, transparent 65%)",
    right:  "radial-gradient(ellipse 40% 100% at 95% 50%, rgba(217,134,41,0.08) 0%, transparent 65%), radial-gradient(ellipse 40% 100% at 5% 50%, rgba(55,20,110,0.08) 0%, transparent 65%)",
    center: "radial-gradient(ellipse 40% 100% at 25% 50%, rgba(217,134,41,0.07) 0%, transparent 60%), radial-gradient(ellipse 40% 100% at 75% 50%, rgba(55,20,110,0.07) 0%, transparent 60%)",
  },
};

export default function SceneDivider({
  tone = "amber",
  from = "left",
  spread = 320,
  intensity = 1,
}: SceneDividerProps) {
  const half = spread / 2;

  return (
    // height: 0 — takes ZERO layout space
    // overflow: visible — the child still renders outside
    // pointer-events: none — invisible to mouse
    <div
      aria-hidden="true"
      className="relative w-full pointer-events-none"
      style={{ height: 0, overflow: "visible", zIndex: 2 }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: -half,
          height: spread,
          opacity: intensity,
          background: gradients[tone][from],
        }}
      />
    </div>
  );
}
