import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import { headers } from "next/headers";
import Providers from "./providers";
import "../index.css";
import { Header } from "@/components/Header";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import Footer from "@/components/Footer";
import CinematicAtmosphere from "@/components/CinematicAtmosphere";
import { ScrollRestoration } from "@/components/ScrollRestoration";
import { readDesign, readSeo } from "@/lib/cms/store";
import { defaultDesign } from "@/lib/cms/types";
import { CMSProvider } from "@/components/cms/CMSContext";
import { CMSAdminBar } from "@/components/cms/CMSAdminBar";
import { JsonLd } from "@/components/seo/JsonLd";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const isAdmin = pathname.startsWith("/admin");

  const [design, seo] = isAdmin
    ? [defaultDesign, null]
    : await Promise.all([readDesign(), readSeo()]);

  const cssVars = {
    "--color-primary": design.colors.primary,
    "--color-primary-dark": design.colors.primaryDark,
  } as React.CSSProperties;

  return (
    <html lang="en" style={cssVars} suppressHydrationWarning>
      <head>
        {!isAdmin && (
          <>
            <link rel="preconnect" href="https://api.fontshare.com" />
            <link
              rel="stylesheet"
              href="https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,400&display=swap"
            />
            <link
              rel="preload"
              href="https://res.cloudinary.com/xzwm4mjt/video/upload/q_auto,f_auto,w_1920,c_limit/movico/videos/6a0eaff5ac6acf2f293bacb8.mp4"
              as="video"
              type="video/mp4"
            />
            {/* Google Tag Manager */}
            {seo?.analytics.gtmId && (
              <script
                dangerouslySetInnerHTML={{
                  __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${seo.analytics.gtmId}');`,
                }}
              />
            )}
            {/* Google Analytics 4 (standalone, without GTM) */}
            {seo?.analytics.ga4Id && !seo?.analytics.gtmId && (
              <>
                <script async src={`https://www.googletagmanager.com/gtag/js?id=${seo.analytics.ga4Id}`} />
                <script
                  dangerouslySetInnerHTML={{
                    __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${seo.analytics.ga4Id}');`,
                  }}
                />
              </>
            )}
            {/* JSON-LD Structured Data */}
            {seo && <JsonLd seo={seo} />}
          </>
        )}
      </head>
      <body className={kanit.variable}>
        {/* GTM noscript fallback */}
        {!isAdmin && seo?.analytics.gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${seo.analytics.gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        <Providers>
          <CMSProvider>
            {!isAdmin && <CMSAdminBar />}
            {!isAdmin && <ScrollRestoration />}
            {!isAdmin && <CinematicAtmosphere />}
            {!isAdmin && <Header />}
            {children}
            {!isAdmin && <Footer />}
            {!isAdmin && <WhatsAppFloat />}
          </CMSProvider>
        </Providers>
      </body>
    </html>
  );
}
