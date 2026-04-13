"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";

const navLinks = [
  { name: "Work", href: "/#work" },
  { name: "Studio", href: "/#about" },
  { name: "Services", href: "/services" },
  { name: "Showreel", href: "/#showreel" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "auto";
  }, [isMobileOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-6xl"
      >
        <div
          className={`
            h-14 md:h-16
            px-5 md:px-8
            flex items-center justify-between
            rounded-full
            transition-all duration-500
            ${
              isScrolled
                ? "bg-black/85 backdrop-blur-xl border border-white/10 shadow-deep"
                : "bg-black/40 backdrop-blur-lg border border-white/5"
            }
          `}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.webp"
              alt="Movico Studio"
              width={42}
              height={42}
              priority
              className="object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-12">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 + 0.2 }}
              >
                <Link
                  href={link.href}
                  className="relative text-xs uppercase tracking-[0.25em] text-white/70 hover:text-white transition-all duration-300 group"
                >
                  {link.name}
                  <span className="absolute left-0 -bottom-2 w-0 h-px bg-primary transition-all duration-400 group-hover:w-full" />
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:block">
            <Link
              href="/start"
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
            className="fixed inset-0 bg-black z-40 flex flex-col justify-center items-center gap-8 md:gap-12"
          >
            {navLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className="text-4xl font-display text-white hover:text-primary transition-colors duration-300"
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}

            <Link
              href="/start"
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
