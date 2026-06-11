import type { Metadata } from "next";
import { Syne, Figtree } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { cn } from "@/lib/utils";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FirstStep — Plateforme SaaS B2B pour le Maroc",
  description: "Centralisez la gestion de votre entreprise avec FirstStep. Cabinet, restaurant, commerce — un seul outil, zéro friction.",
  icons: {
    icon: "/logo.ico",
  },
  openGraph: {
    title: "FirstStep — Plateforme SaaS B2B pour le Maroc",
    description: "Centralisez la gestion de votre entreprise avec FirstStep.",
    url: "https://firststepco.com",
    siteName: "FirstStep",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FirstStep Platform",
      },
    ],
    locale: "fr_MA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FirstStep — Plateforme SaaS B2B pour le Maroc",
    description: "Centralisez la gestion de votre entreprise avec FirstStep.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={cn(
          syne.variable,
          figtree.variable,
          "min-h-screen bg-[#030712] font-figtree antialiased"
        )}
        suppressHydrationWarning
      >
        <Script
          type="module"
          src="https://unpkg.com/@splinetool/viewer@1.12.69/build/spline-viewer.js"
          strategy="beforeInteractive"
        />
        {children}
      </body>
    </html>
  );
}
