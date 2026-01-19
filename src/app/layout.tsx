import type { Metadata, Viewport } from "next";
import { Inter, Goudy_Bookletter_1911 } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { PrivyProvider } from "@/components/auth";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const goudy = Goudy_Bookletter_1911({
  variable: "--font-goudy",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

import { getBaseUrl } from "@/lib/utils";

const BASE_URL = getBaseUrl();

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Think Marketplace - Discover User-Owned AI",
    template: "%s | Think Marketplace",
  },
  description: "Discover apps, tools, and agents built on the Think protocol. A curated showcase of AI you own - autonomous agents, developer tools, and applications built on the open standard for decentralized AI.",
  keywords: [
    "Think Protocol",
    "AI agents",
    "autonomous agents",
    "AI marketplace",
    "decentralized AI",
    "user-owned AI",
    "Think Agent Standard",
    "AI tools",
    "AI apps",
    "Web3 AI",
    "blockchain AI",
  ],
  authors: [{ name: "Think Protocol", url: "https://thinkagents.ai" }],
  creator: "Think Protocol",
  publisher: "Think Protocol",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Think Marketplace - Discover User-Owned AI",
    description: "Discover apps, tools, and agents built on the Think protocol. A curated showcase of AI you own.",
    url: BASE_URL,
    siteName: "Think Marketplace",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Think Marketplace - Discover User-Owned AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Think Marketplace - Discover User-Owned AI",
    description: "Discover apps, tools, and agents built on the Think protocol. A curated showcase of AI you own.",
    site: "@thinkagents",
    creator: "@thinkagents",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FEFCF5" },
    { media: "(prefers-color-scheme: dark)", color: "#0D0D0D" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${goudy.variable} font-body antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PrivyProvider>
            <a href="#main-content" className="skip-to-content">
              Skip to content
            </a>
            {children}
          </PrivyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
