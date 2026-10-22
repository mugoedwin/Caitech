import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Newsreader, Source_Sans_3 } from "next/font/google";
import { PublicShell } from "@/components/layout/PublicShell";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { site } from "@/lib/content/stub-copy";
import { getSiteUrl } from "@/lib/seo/site";
import { getCategories } from "@/lib/api/courses";
import type { NavCategory } from "@/types/nav";
import "./globals.css";

const display = Newsreader({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const body = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} · Technical education`,
    template: `%s · ${site.shortName}`,
  },
  description: site.description,
  applicationName: site.shortName,
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.name,
  // CAITECH-only icons — no create-next-app / framework defaults.
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon", type: "image/png", sizes: "32x32" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-icon", type: "image/png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    locale: "en_KE",
    siteName: site.name,
    title: site.name,
    description: site.description,
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
  other: {
    // Suppress generic framework generator hints in document head.
    google: "notranslate",
  },
};

export const viewport: Viewport = {
  themeColor: "#15365B",
  width: "device-width",
  initialScale: 1,
};

async function loadNavCategories(): Promise<NavCategory[]> {
  try {
    const list = await getCategories();
    return (list ?? [])
      .filter(
        (c): c is { id: number; name: string; slug: string } =>
          Boolean(c && typeof c.slug === "string" && c.slug && c.name),
      )
      .map((c) => ({ id: c.id, name: c.name, slug: c.slug }));
  } catch {
    // Mega-menu still offers View all programmes when the API is unavailable.
    return [];
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await loadNavCategories();

  return (
    <html
      lang="en-KE"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col font-sans antialiased">
        <AuthProvider>
          <PublicShell categories={categories}>{children}</PublicShell>
        </AuthProvider>
      </body>
    </html>
  );
}
