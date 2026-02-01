import type { Metadata } from "next";
import Providers from "./providers";
import "../index.css";
import { Header } from "@/components/Header";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Movico - Leading Marketing Agency in Riyadh, Saudi Arabia",
  description: "Cinematic production and brand storytelling engineered for impact across the region. Video production, event management, branding, and digital marketing in Riyadh, KSA.",
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
        <link
          rel="preload"
          href="https://res.cloudinary.com/dm5c31z7w/video/upload/v1769938198/0201_loykmi.mp4"
          as="video"
          type="video/mp4"
        />
      </head>
      <body>
        <Providers>
          <Header />
          {children}
          <Footer />
          <WhatsAppFloat />
        </Providers>
      </body>
    </html>
  );
}
