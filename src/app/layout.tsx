import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteAnalytics } from "@/components/site-analytics";
import { profile } from "@/lib/content";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

const description =
  "Full-stack & Python engineer in Islamabad. Built ToffeeOS, restaurant software two cafés run on daily, and shipped software for 20+ clients. Available for remote roles.";

export const metadata: Metadata = {
  metadataBase: new URL(profile.site),
  title: `${profile.name} | ${profile.role}`,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: profile.site,
    title: `${profile.name} | ${profile.role}`,
    description,
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfbfc" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

// Sets the theme before paint so there's no flash.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='light'}})()`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  url: profile.site,
  image: `${profile.site}${profile.portrait}`,
  address: { "@type": "PostalAddress", addressLocality: "Islamabad", addressCountry: "PK" },
  alumniOf: "COMSATS University Islamabad",
  sameAs: [profile.linkedin, profile.github],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="min-h-dvh overflow-x-clip">
        {children}
        <SiteAnalytics />
      </body>
    </html>
  );
}
