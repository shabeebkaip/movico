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
import { CMSAdminBarGate } from "@/components/cms/CMSAdminBarGate";
import { JsonLd } from "@/components/seo/JsonLd";
import { hasAdminSession } from "@/lib/auth";

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

  const [design, seo, hasAdminCookie] = isAdmin
    ? [defaultDesign, null, false]
    : await Promise.all([readDesign(), readSeo(), hasAdminSession()]);

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
            {/* Non-blocking load of the Satoshi stylesheet (loadCSS pattern): preload
                as style, then swap to stylesheet on load so it never blocks first paint. */}
            <link
              rel="preload"
              as="style"
              href="https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,400&display=swap"
              id="satoshi-font-preload"
            />
            <script
              dangerouslySetInnerHTML={{
                __html:
                  "(function(){var l=document.getElementById('satoshi-font-preload');if(l){l.onload=function(){l.onload=null;l.rel='stylesheet';};}})();",
              }}
            />
            <noscript>
              <link
                rel="stylesheet"
                href="https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,400&display=swap"
              />
            </noscript>
            {/* Removed document-level video preload: it competed with the font
                stylesheet for bandwidth during the critical LCP window. The
                <video preload="metadata" poster=...> element in HeroSection
                already fetches only metadata until playback starts. */}
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
            {!isAdmin && hasAdminCookie && <CMSAdminBarGate />}
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
