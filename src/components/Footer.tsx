"use client";

import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="relative bg-black overflow-hidden">

      {/* Large Background Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h2 className="text-[5rem] md:text-[12rem] xl:text-[18rem] font-display font-bold text-white/2 select-none whitespace-nowrap">
          MOVICO
        </h2>
      </div>

      <div className="relative z-10 container mx-auto px-6 pt-16 md:pt-32 pb-12 md:pb-20">

        {/* Top Grid */}
        <div className="grid md:grid-cols-12 gap-16 border-b border-white/10 pb-20">

          {/* Brand Column */}
          <div className="md:col-span-5 space-y-8">
            <Image
              src="/logo.webp"
              alt="Movico Studio"
              width={130}
              height={40}
              className="brightness-0 invert"
            />

            <p className="text-white/60 leading-relaxed max-w-sm text-base">
              Cinematic production and brand storytelling engineered
              for impact across the region.
            </p>

            <div className="flex flex-wrap gap-6 text-sm text-white/50 uppercase tracking-widest">
              <a href="#" className="hover:text-primary transition-colors">
                Instagram
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                LinkedIn
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                YouTube
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="md:col-span-2">
            <h4 className="text-xs uppercase tracking-[0.4em] text-white/40 mb-8">
              Navigation
            </h4>

            <div className="space-y-5 text-white/70 text-base flex flex-col">
              <Link href="/">Home</Link>
              <Link href="/#about">Studio</Link>
              <Link href="/services">Services</Link>
              <Link href="/#work">Work</Link>
              <Link href="/contact">Contact</Link>
            </div>
          </div>

          {/* Services */}
          <div className="md:col-span-3">
            <h4 className="text-xs uppercase tracking-[0.4em] text-white/40 mb-8">
              Services
            </h4>

            <div className="space-y-5 text-white/70 text-base flex flex-col">
              <Link href="/services/video-production">Video Production</Link>
              <Link href="/services/event-production">Event Production</Link>
              <Link href="/services/brand-identity">Brand Identity</Link>
              <Link href="/services/spatial-booth">Spatial & Booth</Link>
            </div>
          </div>

          {/* Contact */}
          <div className="md:col-span-2">
            <h4 className="text-xs uppercase tracking-[0.4em] text-white/40 mb-8">
              Contact
            </h4>

            <div className="space-y-5 text-white/70 text-base flex flex-col">
              <p>Wadi Laban, Riyadh, KSA</p>

              <Link href="mailto:info@movicoksa.com">info@movicoksa.com</Link>
              <Link href="tel:+966536660125">053 666 0125</Link>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-10 text-white/40 text-sm tracking-wide gap-6">

          <p>
            © {new Date().getFullYear()} Movico Studio. All rights reserved.
          </p>


        </div>

      </div>
    </footer>
  );
};

export default Footer;
