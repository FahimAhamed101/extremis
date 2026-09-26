import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Updates Dashboard – Manage your social network",
    template: "%s | Updates Dashboard",
  },
  description:
    "Administration dashboard for the Updates social platform: analytics, members, content moderation, advertising, products, events and support in one place.",
  applicationName: "Updates Dashboard",
  /* The dashboard is a private, authenticated back office. Nothing here should
     ever appear in a search index. */
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
  icons: {
    icon: [
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

/**
 * `viewportFit: "cover"` plus the safe-area rules in /css/mobile-app.css is what
 * stops the topbar and the bottom of the sidebar from sliding under the notch
 * and the home indicator on modern phones.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0f172a" },
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
    <html lang="en">
      <head>
        <link rel="icon" href="/icons/favicon-32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" sizes="180x180" />
        <link rel="stylesheet" href="/css/main.min.css" />
        <link rel="stylesheet" href="/css/style.css" />
        <link rel="stylesheet" href="/css/color.css" />
        <link rel="stylesheet" href="/css/responsive.css" />
        <link rel="stylesheet" href="/plugins/apex/apexcharts.css" />
        {/* Loaded last so its mobile overrides win the cascade — Next injects
            globals.css (as layout.css) BEFORE these hand-written <link> tags. */}
        <link rel="stylesheet" href="/css/mobile-app.css" />
      </head>
      <body>
        {children}
        <Script src="/js/main.min.js" strategy="afterInteractive" />
        <Script src="/js/vivus.min.js" strategy="afterInteractive" />
        <Script src="/js/script.js" strategy="afterInteractive" />
        <Script src="/plugins/apex/apexcharts.min.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
