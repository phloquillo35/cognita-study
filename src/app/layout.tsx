import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import { Onboarding } from "@/components/layout/Onboarding";
import { AppShell } from "@/components/layout/AppShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Cognita Study — Tu Tutor IA Universitario",
  description:
    "Plataforma de estudio con inteligencia artificial para estudiantes de ingeniería. Tutorías Socráticas, ejercicios adaptativos, y plan de estudios inteligente.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Cognita Study",
  },
  keywords: [
    "tutor IA",
    "universidad",
    "ingeniería",
    "matemática",
    "física",
    "UTN",
    "estudio",
    "ejercicios",
    "ejercitación",
    "aprendizaje adaptativo",
  ],
};

export const viewport: Viewport = {
  themeColor: "#6366F1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <ErrorBoundary>
              <AppShell>{children}</AppShell>
            </ErrorBoundary>
            <Onboarding />
          </ThemeProvider>
        </SessionProvider>
        <Script
          id="sw-register"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function () {
                  navigator.serviceWorker.register('/sw.js').catch(function () {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
