"use client";

import dynamic from "next/dynamic";
import { useCMS } from "./CMSContext";

// The admin editing bar (+ DesignSidebar, framer-motion, Radix Switch) is
// only ever useful to a logged-in CMS admin — a vanishingly small fraction of
// homepage visits. Dynamically importing it means real visitors never fetch
// this chunk at all, instead of shipping it (unused) on every page load.
const CMSAdminBar = dynamic(() =>
  import("./CMSAdminBar").then((m) => m.CMSAdminBar)
);

export function CMSAdminBarGate() {
  const { isAdmin } = useCMS();
  if (!isAdmin) return null;
  return <CMSAdminBar />;
}
