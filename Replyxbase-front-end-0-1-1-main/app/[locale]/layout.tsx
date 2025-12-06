import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import locales from "@/i18n/request";
import "./globals.css";
import { Toaster } from "sonner";

// Font configuration
const cairo = Cairo({
  subsets: ["latin", "arabic"],
  display: "swap",
});

// SEO Configuration
const SITE_CONFIG = {
  title: "Replyxbase - AI Customer Support & Sales Automation",
  description: "Connect WhatsApp, Telegram, and Webchat to a single AI that handles support, sales, and bookings automatically.",
  keywords: "AI, chatbots, automation, CRM, agents, whatsapp, telegram, customer support, sales automation",
  authors: [{ name: "Replyxbase Team" }],
  creator: "Replyxbase",
  publisher: "Replyxbase",
  metadataBase: new URL("https://replyxbase.com"),
};

export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.title,
    template: `%s | ${SITE_CONFIG.title}`,
  },
  description: SITE_CONFIG.description,
  keywords: SITE_CONFIG.keywords,
  authors: SITE_CONFIG.authors,
  creator: SITE_CONFIG.creator,
  publisher: SITE_CONFIG.publisher,
  metadataBase: SITE_CONFIG.metadataBase,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_CONFIG.metadataBase,
    siteName: SITE_CONFIG.title,
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    creator: "@replyxbase",
    images: ["/og-image.jpg"],
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
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
      },
    ],
  },
  manifest: "/manifest.json",
  category: "technology",
};

export function generateStaticParams() {
  // Ensure locales is treated as an array of strings
  const localeArray = Array.isArray(locales) 
    ? locales 
    : typeof locales === 'object' 
      ? Object.values(locales) 
      : ['en']; // fallback to English
  
  return localeArray.map((locale) => ({ locale: String(locale) }));
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

export default async function RootLayout({
  children,
  params,
}: Readonly<RootLayoutProps>) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
  
  // Set the locale for next-intl
  setRequestLocale(locale);
  
  // Load messages for the current locale
  const messages = await getMessages();
  
  // Determine text direction based on locale
  const isRTL = locale === "ar";
  const direction = isRTL ? "rtl" : "ltr";

  return (
    <html 
      lang={locale} 
      dir={direction} 
      data-theme="emailly" 
      data-locale={locale} 
      className={`${cairo.className}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#0064e0" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Replyxbase" />
        
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body 
        className={`${cairo.className} antialiased overflow-x-hidden`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider 
          locale={locale} 
          messages={messages}
          timeZone="UTC"
        >
          {children}
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}