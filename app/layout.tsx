import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import PageLoader from "@/components/layout/PageLoader";
import GlobalShellScripts from "@/components/layout/GlobalShellScripts";

export const metadata: Metadata = {
  title: "Extremis | Social Media Network Template",
  description: "Extremis social media root page",
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
      </head>
      <body>
        <PageLoader />
        <Providers>{children}</Providers>
        <GlobalShellScripts />
      </body>
    </html>
  );
}
