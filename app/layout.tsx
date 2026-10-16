import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { omegaAppearance } from "@/components/auth/clerk-ui";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Omega",
    template: "%s · Omega",
  },
  description:
    "Omega is the Quantum Computing Chapter app for Uganda Christian University.",
  applicationName: "Omega",
  appleWebApp: {
    capable: true,
    title: "Omega",
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-192.png", sizes: "192x192" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#003087",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    return (
      <html lang="en" className={`${inter.variable} h-full`}>
        <body className="min-h-full bg-background p-8 text-ink">
          <main className="mx-auto max-w-lg">
            <h1 className="text-3xl font-semibold text-ucu-blue">Omega</h1>
            <p className="mt-3 text-sm leading-6">
              Add your Clerk publishable key to <code>.env.local</code> before
              starting the app. Copy <code>.env.example</code> and follow the
              README.
            </p>
          </main>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full bg-background text-ink antialiased">
        <ClerkProvider appearance={omegaAppearance} publishableKey={publishableKey}>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
