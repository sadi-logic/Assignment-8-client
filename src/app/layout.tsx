import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/toast";
import { Toaster as SonnerToaster } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StudioSpace",
  description: "| approach with art",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try { if (localStorage.getItem("studiospace-theme") === "dark") document.documentElement.classList.add("dark"); } catch { document.documentElement.classList.remove("dark"); }',
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <Suspense fallback={<div className="h-16" aria-hidden="true" />}>
            <Navbar />
          </Suspense>
          {children}
          <Footer />
          <Toaster />
          <SonnerToaster position="top-right" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
