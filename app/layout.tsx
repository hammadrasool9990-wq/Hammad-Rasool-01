import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { site, profile } from "@/content";
import { isTodo } from "@/lib/todo";

// Self-hosted Google Fonts (via Fontsource): no third-party request, preloaded, no layout shift.
const anton = localFont({
  src: "../node_modules/@fontsource/anton/files/anton-latin-400-normal.woff2",
  variable: "--font-anton",
  weight: "400",
  display: "swap",
  adjustFontFallback: "Arial",
});
const manrope = localFont({
  src: "../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2",
  variable: "--font-manrope",
  weight: "200 800",
  display: "swap",
});
const jetbrains = localFont({
  src: [
    { path: "../node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2", weight: "400" },
    { path: "../node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2", weight: "500" },
  ],
  variable: "--font-jetbrains",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s — ${profile.name}` },
  description: site.description,
  applicationName: `${profile.brand} — ${profile.name}`,
  authors: [{ name: profile.name, url: site.url }],
  creator: profile.name,
  keywords: [
    "Hammad Rasool",
    "AureVon",
    "web developer Lahore",
    "React developer Pakistan",
    "digital marketing",
    "portfolio",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: `${profile.name} · ${profile.brand}`,
    title: site.title,
    description: site.description,
    locale: site.locale,
    firstName: profile.firstName,
    lastName: profile.lastName,
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#07070B",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const sameAs = [
  profile.socials.instagram,
  profile.socials.github,
  profile.socials.linkedin,
].filter((u) => u && !isTodo(u));

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  alternateName: profile.brand,
  jobTitle: profile.roles[0],
  description: site.description,
  url: site.url,
  email: `mailto:${profile.email}`,
  image: `${site.url}/images/me/hero.jpg`,
  sameAs,
  address: { "@type": "PostalAddress", addressLocality: "Lahore", addressCountry: "PK" },
  knowsAbout: ["React", "TypeScript", "Tailwind CSS", "SEO", "Performance marketing", "Digital marketing"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${manrope.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <body>
        {/* Skip intro on repeat visits in this tab; runs before paint so nothing flashes. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem('av-intro')||matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('intro-skip')}catch(e){}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
        />
        {children}
      </body>
    </html>
  );
}
