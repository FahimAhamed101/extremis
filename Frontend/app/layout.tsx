import type { Metadata, Viewport } from "next";
import "./globals.css";
import FloatingCartButton from "@/components/cart/FloatingCartButton";
import Providers from "./providers";
import PageLoader from "@/components/layout/PageLoader";
import GlobalShellScripts from "@/components/layout/GlobalShellScripts";
import ApiHealthWarmup from "@/components/layout/ApiHealthWarmup";
import { getSiteUrl } from "@/lib/utils/getSiteUrl";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Updates – The Social Media Network | Connect with Friends & Family",
    template: "%s | Updates – The Social Media Network",
  },
  description:
    "Updates is the modern social media network to connect and meet your friends and family. Share posts, photos, videos, and stories, join groups, chat in real-time, and discover communities — the open, privacy-friendly Facebook alternative.",
  applicationName: "Updates",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Updates",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  keywords: [
    "Updates",
    "Updates the social media network",
    "the social media network",
    "social media network",
    "social platform like facebook",
    "facebook alternative",
    "social platform to meet friends and family",
    "connect with friends and family",
    "social network",
    "meet friends online",
    "social media without tracking",
    "share photos and videos",
    "community groups",
    "social feed",
    "live streaming social platform",
    "friends and family social app",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Updates – The Social Media Network",
    title: "Updates – The Social Media Network | Connect with Friends & Family",
    description:
      "Join Updates, the modern social media network to connect with friends and family, share updates, photos, videos, join groups, and discover inspiring communities.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Updates – The Social Media Network | Connect with Friends & Family",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Updates – The Social Media Network | Connect with Friends & Family",
    description:
      "Join Updates, the modern social media network to connect with friends and family, share updates, photos, videos, join groups, and discover inspiring communities.",
    images: ["/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

/**
 * Mobile viewport. `viewportFit: "cover"` lets the layout extend under the
 * notch/home-indicator on modern phones (pairs with env(safe-area-inset-*)
 * in CSS), and zoom is deliberately left enabled for accessibility.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#075985" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
  ],
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Instant API Health Ping: Wakes up server and DB connection immediately on initial page load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var isLocal=location.hostname==='localhost'||location.hostname==='127.0.0.1';var u=isLocal?'http://localhost:4000/api/health':'/api/health';fetch(u,{method:'GET',keepalive:true}).catch(function(){});}catch(e){}})();`,
          }}
        />
        {/* DOM protection against browser extensions & media player node modifications */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){if(typeof window==='undefined'||typeof Node==='undefined'||!Node.prototype)return;var origRemove=Node.prototype.removeChild;Node.prototype.removeChild=function(child){if(child&&child.parentNode!==this){if(window.console&&console.warn){console.warn('Safely handled removeChild on detached node:',child);}return child;}return origRemove.apply(this,arguments);};var origInsert=Node.prototype.insertBefore;Node.prototype.insertBefore=function(newNode,refNode){if(refNode&&refNode.parentNode!==this){if(window.console&&console.warn){console.warn('Safely handled insertBefore on detached node:',refNode);}return newNode;}return origInsert.apply(this,arguments);};})();`,
          }}
        />
        <meta
          name="google-site-verification"
          content="7D5GsLCJIj5u-4aD5whqMuZuQK5y5czs2M-JKQ6Qybk"
        />
        {/* Google Schema.org JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": `${siteUrl}/#website`,
                  "url": siteUrl,
                  "name": "Updates",
                  "alternateName": [
                    "Updates The Social Media Network",
                    "Updates Social",
                    "Updates Social Platform",
                    "Updates Network",
                  ],
                  "description":
                    "The modern social platform to connect with friends and family. The open, privacy-friendly Facebook alternative.",
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": {
                      "@type": "EntryPoint",
                      "urlTemplate": `${siteUrl}/search-result?q={search_term_string}`,
                    },
                    "query-input": "required name=search_term_string",
                  },
                },
                {
                  "@type": "Organization",
                  "@id": `${siteUrl}/#organization`,
                  "name": "Updates",
                  "url": siteUrl,
                  "logo": {
                    "@type": "ImageObject",
                    "url": `${siteUrl}/images/logo.png`,
                  },
                  "description":
                    "Updates is a modern social platform connecting friends, families, and communities with newsfeeds, groups, messaging, and live streaming.",
                },
                {
                  "@type": "SoftwareApplication",
                  "name": "Updates Social App",
                  "applicationCategory": "SocialNetworkingApplication",
                  "operatingSystem": "All",
                  "url": siteUrl,
                  "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD",
                  },
                },
              ],
            }),
          }}
        />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-JKXRLTXSG5"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-JKXRLTXSG5');
`,
          }}
        />
        <link rel="icon" href="/images/fav.png" type="image/png" sizes="16x16" />
        <link rel="icon" href="/images/favicon-32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        {/* Preload the subset icon font so icon glyphs don't pop in late. */}
        <link
          rel="preload"
          href="/fonts/icofont-subset.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href="/css/main.min.css" />
        {/* Must come after main.min.css: supplies the IcoFont subset that
            replaced the 525KB bundled icon font. */}
        <link rel="stylesheet" href="/css/icofont-subset.css" />
        <link rel="stylesheet" href="/css/style.css" />
        <link rel="stylesheet" href="/css/color.css" />
        <link rel="stylesheet" href="/css/responsive.css" />
        {/* MUST be last: mobile overrides need to beat the legacy stylesheets
            above, which load after Next's own layout.css in <head>. */}
        <link rel="stylesheet" href="/css/mobile-app.css" />
      </head>
      <body suppressHydrationWarning>
        <ApiHealthWarmup />
        <PageLoader />
        <Providers>
          {children}
          <FloatingCartButton />
        </Providers>
        <GlobalShellScripts />
      </body>
    </html>
  );
}

