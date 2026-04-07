import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import PageLoader from "@/components/layout/PageLoader";
import GlobalShellScripts from "@/components/layout/GlobalShellScripts";
import { getSiteUrl } from "@/lib/utils/getSiteUrl";

const gaMeasurementId = String(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-JKXRLTXSG5").trim();
const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Extremis | Social Media Network Template",
    template: "%s | Extremis",
  },
  description: "Extremis is a research-focused social network for students, educators, and professionals.",
  applicationName: "Extremis",
  keywords: [
    "Extremis",
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
    siteName: "Extremis",
    title: "Extremis | Social Media Network Template",
    description:
      "Extremis is a research-focused social network for students, educators, and professionals.",
    images: [
      {
        url: "/images/logo.png",
        width: 512,
        height: 512,
        alt: "Extremis",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Extremis | Social Media Network Template",
    description:
      "Extremis is a research-focused social network for students, educators, and professionals.",
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
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="7D5GsLCJIj5u-4aD5whqMuZuQK5y5czs2M-JKQ6Qybk"
        />
        {gaMeasurementId ? (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
            ></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaMeasurementId}');
                `,
              }}
            />
          </>
        ) : null}
        <link rel="icon" href="/images/fav.png" type="image/png" sizes="16x16" />
        <link rel="stylesheet" href="/css/main.min.css" />
        <link rel="stylesheet" href="/css/style.css" />
        <link rel="stylesheet" href="/css/color.css" />
        <link rel="stylesheet" href="/css/responsive.css" />
      </head>
      <body>
        <PageLoader />
        <Providers>{children}</Providers>
        <GlobalShellScripts />
      </body>
    </html>
  );
}
