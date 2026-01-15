import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FirstStep - Modular SaaS Platform",
  description: "All your business systems in one platform.",
  icons: {
    icon: "/logo.ico",
  },
  openGraph: {
    title: "FirstStep - Modular SaaS Platform",
    description: "All your business systems in one platform.",
    url: "https://firststep.com", // Keeping it generic as requested or based on project inference
    siteName: "FirstStep",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FirstStep Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FirstStep - Modular SaaS Platform",
    description: "All your business systems in one platform.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "min-h-screen bg-background font-sans antialiased animate-fade-in")} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
