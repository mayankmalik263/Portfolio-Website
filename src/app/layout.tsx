import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Providers from "@/components/Providers";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import Script from "next/script";
const Analytics = dynamic(
  () => import("@vercel/analytics/next").then((mod) => mod.Analytics),
  { ssr: false },
);
import type { Metadata, Viewport } from "next";
import { Calistoga, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});
const calistoga = Calistoga({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400"],
});

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  metadataBase: new URL("https://mayankmalik.vercel.app"),
  title: {
    default: "Mayank Malik - AI/ML Engineer & Developer",
    template: "%s | Mayank Malik",
  },
  description:
    "Mayank Malik is a B.Tech CSE (AI/ML) student at UPES, AI engineer, developer, and community leader building intelligent applications, machine learning systems, and modern web experiences.",
  keywords: [
    "Mayank Malik",
    "Mayank Malik portfolio",
    "Mayank Malik UPES",
    "Mayank Malik AI Engineer",
    "AI Engineer",
    "Machine Learning Engineer",
    "ML student",
    "LLM developer",
    "AI/ML engineer India",
    "UPES CSE AI ML",
    "full stack developer",
    "community leader",
    "tech community lead",
    "student developer portfolio",
  ],
  authors: [{ name: "Mayank Malik", url: "https://mayankmalik.vercel.app" }],
  creator: "Mayank Malik",
  verification: {
    google: "fvoEB6O0oSAEz2jPwfejvSKEGoePW9IK9M5yBnGgO_8",
  },
  alternates: {
    canonical: "https://mayankmalik.vercel.app",
  },
  openGraph: {
    title: "Mayank Malik - AI/ML Engineer & Developer",
    description:
      "AI Engineering student and builder focused on intelligent applications, machine learning, and modern web experiences.",
    url: "https://mayankmalik.vercel.app",
    siteName: "Mayank Malik",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mayank Malik - AI/ML Engineer & Developer",
    description:
      "AI Engineering student and builder focused on intelligent applications, machine learning, and modern web experiences.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Mayank Malik",
              url: "https://mayankmalik.vercel.app",
              image: "https://mayankmalik.vercel.app/img/me-1.webp",
              jobTitle: "AI/ML Engineer",
              description:
                "B.Tech CSE (AI/ML) student at UPES, AI engineer, developer, and community leader building intelligent applications and modern web experiences.",
              alumniOf: {
                "@type": "CollegeOrUniversity",
                name: "UPES (University of Petroleum and Energy Studies)",
              },
              knowsAbout: [
                "Artificial Intelligence",
                "Machine Learning",
                "Large Language Models",
                "Full Stack Development",
                "Web Development",
                "Community Leadership",
              ],
              sameAs: [
                "https://www.linkedin.com/in/mayankmalik263/",
                "https://github.com/mayankmalik263",
              ],
            }),
          }}
        />
        {GTM_ID ? (
          <Script id="gtm-base" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
        ) : null}
        {GA_ID ? (
          <>
            <Script
              id="ga4-src"
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${GA_ID}');`}
            </Script>
          </>
        ) : null}
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
          calistoga.variable,
        )}
      >
        {GTM_ID ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        ) : null}
        <Providers>
          <Header />
          <div className="mx-auto flex max-w-3xl flex-col px-8">
            <main className="grow">{children}</main>
          </div>
          <Footer />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
