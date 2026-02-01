import type { Metadata } from "next";
import Providers from "./providers";
import "../index.css";
import { Header } from "@/components/Header";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "OCX",
  description: "OCX Consultancy",
  icons: {
    icon: "/OCX white.svg",
    shortcut: "/OCX white.svg",
    apple: "/OCX white.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
