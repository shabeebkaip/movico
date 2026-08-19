import Image from "next/image";
import Link from "next/link";
import { Instagram, Linkedin, Youtube, X, Facebook } from "lucide-react";
import { readContent } from "@/lib/cms/store";

function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

function SnapchatIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.35-1.333.798-.09.24-.061.526.089.857l.015.015c.06.15 1.526 3.475 4.791 4.014.255.044.435.27.42.54 0 .075-.015.135-.03.195-.24.81-1.512 1.354-3.898 1.629-.061.24-.135.51-.195.72-.036.166-.2.315-.365.315l-.019-.001c-.166 0-.317-.017-.481-.06-.427-.09-.899-.164-1.428-.164-.375 0-.762.03-1.157.088-.734.117-1.35.6-2.056 1.155-1.026.813-2.196 1.732-3.94 1.732-.045 0-.076-.001-.106-.001-.03 0-.06.001-.106.001-1.744 0-2.9-.917-3.941-1.732-.704-.556-1.32-1.038-2.054-1.155-.396-.06-.782-.088-1.158-.088-.529 0-1 .074-1.428.164-.164.045-.316.06-.481.06l-.017.001c-.165 0-.328-.15-.365-.315-.06-.21-.135-.48-.195-.72-2.386-.274-3.658-.818-3.899-1.629-.014-.06-.03-.12-.03-.195-.014-.271.165-.496.42-.54 3.267-.539 4.732-3.864 4.792-4.014l.015-.015c.15-.33.18-.617.089-.856-.195-.45-.884-.663-1.334-.799-.135-.045-.255-.09-.345-.119-.629-.24-1.393-.607-1.213-1.169.106-.359.435-.629.734-.629l.015.015c.15 0 .329.017.494.104.374.181.734.286 1.033.301.199 0 .327-.045.401-.09-.008-.166-.017-.331-.028-.51l-.003-.06c-.104-1.628-.23-3.654.299-4.847C7.858 1.07 11.216.793 12.206.793z" />
    </svg>
  );
}

const socialIcons = {
  instagram: Instagram,
  tiktok: TikTokIcon,
  snapchat: SnapchatIcon,
  twitter: X,
  linkedin: Linkedin,
  facebook: Facebook,
  youtube: Youtube,
} as const;

const Footer = async () => {
  const content = await readContent();
  const { global, contact } = content;

  const socialLinks = (Object.keys(socialIcons) as (keyof typeof socialIcons)[])
    .map((key) => ({ key, href: contact.social[key], Icon: socialIcons[key] }))
    .filter(({ href }) => href && href !== "#");

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
              {global.tagline}
            </p>

            {socialLinks.length > 0 && (
              <div className="flex items-center gap-4">
                {socialLinks.map(({ key, href, Icon }) => (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={key}
                    className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-black hover:bg-[#d98629] hover:border-[#d98629] transition-colors duration-300"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="md:col-span-2">
            <h4 className="text-xs uppercase tracking-[0.4em] text-white/40 mb-8">
              Navigation
            </h4>

            <div className="space-y-5 text-white/70 text-base flex flex-col">
              <Link href="/">Home</Link>
              <Link href="/studio">Studio</Link>
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
              <a
                href="https://www.google.com/maps?q=24.635657,46.545608"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors duration-300"
              >
                {global.address}
              </a>

              <Link href={`mailto:${global.email}`}>{global.email}</Link>
              <Link href={`tel:${global.phone.replace(/\s+/g, "")}`}>{global.phone}</Link>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-10 text-white/40 text-sm tracking-wide gap-6">

          <p>
            © {new Date().getFullYear()} {global.siteName} Studio. All rights reserved.
          </p>


        </div>

      </div>
    </footer>
  );
};

export default Footer;
