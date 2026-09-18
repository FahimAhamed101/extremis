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
    default: "Updates | Social Media Network Template",
    template: "%s | Updates",
  },
  description: "Updates is a research-focused social network for students, educators, and professionals.",
  applicationName: "Updates",
  keywords: [
    "Updates",
    "research social network",
    "students network",
    "academic community",
    "research collaboration",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Updates",
    title: "Updates | Social Media Network Template",
    description:
      "Updates is a research-focused social network for students, educators, and professionals.",
    images: [
      {
        url: "/images/logo.png",
        width: 512,
        height: 512,
        alt: "Updates",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Updates | Social Media Network Template",
    description:
      "Updates is a research-focused social network for students, educators, and professionals.",
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

