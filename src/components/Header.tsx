"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, ChevronDown } from "lucide-react";
import { useCMS } from "@/components/cms/CMSContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Work", href: "/projects" },
  { name: "Showreel", href: "/showreel" },
  { name: "Services", href: "/services" },
  { name: "Studio", href: "/studio" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

// Tablet band (768–1279px): 3 inline links + everything else under "More".
// Home is intentionally excluded from inline — the logo already links home.
const inlineLinkNames = ["Work", "Services", "Studio"];
const inlineLinks = navLinks.filter((l) => inlineLinkNames.includes(l.name));
const moreLinks = navLinks.filter((l) => !inlineLinkNames.includes(l.name));

function NavLinkItem({
  link,
  index,
  active,
  padded = false,
}: {
  link: { name: string; href: string };
  index: number;
  active: boolean;
  /** Adds an invisible >=44px touch target — only for the tablet hybrid nav.
   * The full desktop nav (>=1280px, pointer-driven) stays byte-for-byte
   * unchanged from before this fix, per spec §4. */
  padded?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 + 0.2 }}
    >
      {padded ? (
        // Tablet hybrid nav: padding creates a >=44px touch target without
        // moving the visible text. The underline lives on the inner relative
        // span so it still hugs the text baseline, not the padded hit box.
        <Link
          href={link.href}
          className={`inline-flex items-center px-2 py-3.5 text-xs uppercase tracking-[0.25em] transition-all duration-300 group outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm ${
            active ? "text-primary" : "text-white/70 hover:text-white"
          }`}
        >
          <span className="relative">
            {link.name}
            <span className={`absolute left-0 -bottom-2 h-px bg-primary transition-all duration-400 ${
              active ? "w-full" : "w-0 group-hover:w-full"
            }`} />
          </span>
        </Link>
      ) : (
        <Link
          href={link.href}
          className={`relative text-xs uppercase tracking-[0.25em] transition-all duration-300 group ${
            active ? "text-primary" : "text-white/70 hover:text-white"
          }`}
        >
          {link.name}
          <span className={`absolute left-0 -bottom-2 h-px bg-primary transition-all duration-400 ${
            active ? "w-full" : "w-0 group-hover:w-full"
          }`} />
        </Link>
      )}
    </motion.div>
  );
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const pathname = usePathname();
  const { isAdmin } = useCMS();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Close the "More" dropdown on route change — Radix has no concept of
  // Next.js navigation, so this has to be handled explicitly.
  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "auto";
    document.body.classList.toggle("mobile-menu-open", isMobileOpen);
  }, [isMobileOpen]);

  // Shift header down when admin bar is visible
  const topOffset = isAdmin ? "top-12" : "top-3";
  // Overlay needs top clearance so the header bar (which sits above it) never
  // covers the first nav item; taller when the admin bar pushes the header down.
  const mobileMenuTopClearance = isAdmin ? "pt-32" : "pt-24";

  return (
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed ${topOffset} left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-6xl transition-all duration-300`}
      >
        <div
          className={`
            h-14 md:h-16 px-5 md:px-8
            flex items-center justify-between gap-x-4 lg:gap-x-6
            rounded-full transition-all duration-500
            ${isScrolled
              ? "bg-black/85 backdrop-blur-xl border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
              : "bg-black/40 backdrop-blur-lg border border-white/5"
            }
          `}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/logo.webp"
              alt="Movico Studio"
              width={42}
              height={42}
              priority
              className="object-contain"
            />
          </Link>

          {/* Hybrid Nav — tablet band (768–1279px): 3 inline links + "More" */}
          <nav className="hidden md:flex xl:hidden items-center gap-x-4 lg:gap-x-6">
            {inlineLinks.map((link, i) => (
              <NavLinkItem key={link.name} link={link} index={i} active={isActive(link.href)} padded />
            ))}
            <DropdownMenu open={moreOpen} onOpenChange={setMoreOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={`group inline-flex items-center gap-1 text-xs uppercase tracking-[0.25em] transition-colors duration-300 px-2 py-3.5 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm ${
                    moreLinks.some((l) => isActive(l.href)) ? "text-primary" : "text-white/70 hover:text-white"
                  }`}
                >
                  More
                  <ChevronDown className="w-3 h-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={10}
                collisionPadding={12}
                loop
                className="z-[60] min-w-[180px] overflow-hidden rounded-2xl border border-white/10 bg-black/90 backdrop-blur-xl shadow-[0_16px_50px_rgba(0,0,0,0.6)] p-2 motion-reduce:transition-none motion-reduce:animate-none"
              >
                {moreLinks.map((link) => (
                  <DropdownMenuItem key={link.name} asChild>
                    <Link
                      href={link.href}
                      className={`w-full flex items-center rounded-lg px-4 py-3.5 text-xs uppercase tracking-[0.25em] outline-none cursor-pointer transition-colors duration-200 data-[highlighted]:bg-white/8 data-[highlighted]:text-white ${
                        isActive(link.href) ? "text-primary" : "text-white/70"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Full Nav — desktop (≥1280px), unchanged from before this fix */}
          <nav className="hidden xl:flex items-center gap-12">
            {navLinks.map((link, i) => (
              <NavLinkItem key={link.name} link={link} index={i} active={isActive(link.href)} />
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:block">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-primary text-white text-xs font-bold uppercase tracking-[0.25em] px-6 py-2.5 rounded-full hover:bg-white hover:text-black transition-all duration-300"
            >
              Start a Project
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden text-white"
          >
            {isMobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className={`fixed inset-0 bg-black z-40 flex flex-col items-center gap-8 md:gap-12 overflow-y-auto ${mobileMenuTopClearance} pb-12`}
          >
            {navLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`text-4xl font-display transition-colors duration-300 ${
                    isActive(link.href) ? "text-primary" : "text-white hover:text-primary"
                  }`}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}

            <Link
              href="/contact"
              onClick={() => setIsMobileOpen(false)}
              className="mt-6 inline-flex items-center gap-2 bg-primary text-white text-xs font-bold uppercase tracking-[0.25em] px-10 py-4 rounded-full hover:bg-white hover:text-black transition-all duration-300"
            >
              Start a Project
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
