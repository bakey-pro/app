import type { Metadata } from "next";
import { ThemeProvider } from "@/providers/themeProvider";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'Bakey',
    template: '%s / Bakey'
  },
  description: 'I am a student working as an engineer, doing web development and app development.',
  metadataBase: new URL('https://bakey.pro'),
  openGraph: {
    title: 'Express yourself in one link',
    description: "Bakey will combine multiple Links that you own int one Link. You can easily create and share stylish designs. Why don't you join us?",
    url: 'https://bakey.pro',
    siteName: 'Bakey',
    images: [
      {
        url: '/ogp.webp',
        width: 1200,
        height: 630,
      }
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  icons: {
    icon: '/favicon.png',
  },
  robots: {
    index: true,
    follow: true,
  },
  publisher: '@bakey_pro',
  creator: '@bakey_pro',
  keywords: ['Bakey', 'bakey', 'Bakey Pro'],
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`h-full overflow-y-scroll scrollbar-none bg-neutral-50 dark:bg-neutral-950 text-black dark:text-white ${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class">
          <NextIntlClientProvider locale={locale}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
