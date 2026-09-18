import type { Metadata } from "next";
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
    default: "Updates – Social Platform to Connect with Friends & Family | Facebook Alternative",
    template: "%s | Updates Social Network",
  },
  description:
    "Updates is the modern social platform to connect and meet your friends and family. Share posts, photos, videos, and stories, join groups, chat in real-time, and discover communities — the open, privacy-friendly Facebook alternative.",
  applicationName: "Updates",
  keywords: [
    "Updates",
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
    siteName: "Updates",
    title: "Updates – Social Platform to Connect with Friends & Family | Facebook Alternative",
    description:
      "Join Updates, the modern social network to connect with friends and family, share updates, photos, videos, join groups, and discover inspiring communities.",
    images: [
      {
        url: "/images/logo.png",
        width: 512,
        height: 512,
        alt: "Updates – Connect with Friends & Family | Facebook Alternative",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Updates – Social Platform to Connect with Friends & Family | Facebook Alternative",
    description:
      "Join Updates, the modern social network to connect with friends and family, share updates, photos, videos, join groups, and discover inspiring communities.",
    images: ["/images/logo.png"],
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
        <link rel="stylesheet" href="/css/main.min.css" />
        <link rel="stylesheet" href="/css/style.css" />
        <link rel="stylesheet" href="/css/color.css" />
        <link rel="stylesheet" href="/css/responsive.css" />
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

