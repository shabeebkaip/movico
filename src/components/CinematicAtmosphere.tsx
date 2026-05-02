"use client";

// Global cinematic atmosphere layer:
// — animated film grain (fixed overlay, ~3% opacity)
// — slow-drifting radial glow orbs (amber, indigo, crimson, teal)
// These sit at z-index 1 so they're behind all content but above the black body.

export default function CinematicAtmosphere() {
  return (
    <>
      {/* ─── Film grain ────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="cinema-grain pointer-events-none fixed inset-0 z-[1]"
      />

      {/* ─── Floating atmospheric glow orbs ─────────────────
          Each orb drifts on its own infinite keyframe animation.
          Colours deliberately echo film-set practical lighting:
            amber  = warm key light bleeding in from frame left
            indigo = late-night cool fill
            crimson = dramatic backlight
            teal   = exterior night / moonlight
      ─────────────────────────────────────────────────────── */}

      {/* Orb 1 — amber, upper-left */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed z-[1] orb-amber"
        style={{
          top: "10%",
          left: "-8%",
          width: "55vw",
          height: "55vw",
          maxWidth: 700,
          maxHeight: 700,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(217,134,41,0.038) 0%, transparent 65%)",
          filter: "blur(60px)",
        }}
      />

      {/* Orb 2 — deep indigo, right-center */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed z-[1] orb-indigo"
        style={{
          top: "38%",
          right: "-12%",
          width: "50vw",
          height: "50vw",
          maxWidth: 650,
          maxHeight: 650,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(55,20,110,0.045) 0%, transparent 65%)",
          filter: "blur(70px)",
        }}
      />

      {/* Orb 3 — crimson, lower-left */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed z-[1] orb-crimson"
        style={{
          top: "65%",
          left: "-5%",
          width: "45vw",
          height: "45vw",
          maxWidth: 580,
          maxHeight: 580,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(100,12,12,0.040) 0%, transparent 65%)",
          filter: "blur(60px)",
        }}
      />

      {/* Orb 4 — teal, lower-right */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed z-[1] orb-teal"
        style={{
          bottom: "8%",
          right: "0%",
          width: "45vw",
          height: "45vw",
          maxWidth: 600,
          maxHeight: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,60,65,0.038) 0%, transparent 65%)",
          filter: "blur(65px)",
        }}
      />
    </>
  );
}
