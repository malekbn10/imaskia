import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Arabic, Amiri, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/context";
import { ThemeProvider } from "@/lib/theme-context";
import { SessionProvider } from "next-auth/react";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import IslamicPattern from "@/components/layout/IslamicPattern";
import ServiceWorkerReg from "@/components/pwa/ServiceWorkerReg";
import InstallPrompt from "@/components/pwa/InstallPrompt";
import NotificationPrompt from "@/components/pwa/NotificationPrompt";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-noto-arabic",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "إمساكية - أوقات الصلاة رمضان تونس | Imsakia.tn",
  description:
    "إمساكية رمضان الرقمية لتونس - أوقات الصلاة، العد التنازلي للإفطار والسحور، تقويم رمضان، اتجاه القبلة. Horaires de prière Ramadan Tunisie.",
  keywords: [
    "إمساكية",
    "رمضان",
    "تونس",
    "أوقات الصلاة",
    "imsakia",
    "ramadan",
    "tunisie",
    "horaires prière",
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "إمساكية",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#D4A843",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${notoArabic.variable} ${amiri.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <SessionProvider>
          <I18nProvider>
          <ThemeProvider>
            <ServiceWorkerReg />
            <InstallPrompt />
            <NotificationPrompt />
            <IslamicPattern />
            <div className="relative z-10 flex min-h-dvh flex-col">
              <Header />
              <main className="mx-auto w-full max-w-lg flex-1 px-4 py-6 pb-safe">
                {children}
              </main>
              <BottomNav />
            </div>
          </ThemeProvider>
          </I18nProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
