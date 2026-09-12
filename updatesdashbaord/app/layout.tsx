import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "socimo | Dashboard",
  description: "Socimo Social Media Network Dashboard",
  icons: {
    icon: "/images/fav.png",
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
        <link rel="icon" href="/images/fav.png" type="image/png" sizes="16x16" />
        <link rel="stylesheet" href="/css/main.min.css" />
        <link rel="stylesheet" href="/css/style.css" />
        <link rel="stylesheet" href="/css/color.css" />
        <link rel="stylesheet" href="/css/responsive.css" />
        <link rel="stylesheet" href="/plugins/apex/apexcharts.css" />
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
