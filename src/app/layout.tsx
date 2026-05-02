import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import Providers from "./providers";
import "../index.css";
import { Header } from "@/components/Header";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import Footer from "@/components/Footer";
import CinematicAtmosphere from "@/components/CinematicAtmosphere";
import { ScrollRestoration } from "@/components/ScrollRestoration";

const kanit = Kanit({
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Movico — Corporate Video Production Company Riyadh, Saudi Arabia",
  description: "Riyadh's leading corporate video production company. Brand films, event coverage, corporate videos & media production across Saudi Arabia and the GCC. Based in Riyadh, KSA.",
  icons: {
    icon: "/logo.webp",
    shortcut: "/logo.webp",
    apple: "/logo.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Satoshi — display/headings (Fontshare, not available via next/font) */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,400&display=swap"
        />
        <link
          rel="preload"
          href="https://res.cloudinary.com/dm5c31z7w/video/upload/v1769938198/0201_loykmi.mp4"
          as="video"
          type="video/mp4"
        />
      </head>
      <body className={kanit.variable}>
        <Providers>
          <ScrollRestoration />
          <CinematicAtmosphere />
          <Header />
          {children}
          <Footer />
          <WhatsAppFloat />
        </Providers>
      </body>
    </html>
  );
}
