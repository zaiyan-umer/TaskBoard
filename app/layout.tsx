import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner"
import "./globals.css";
import { AuthInitializer } from "@/components/auth/AuthInitializer";
import { AppChrome } from "@/components/auth/AppChrome";
import QueryProvider from "@/components/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Task Manager | Full-Stack App",
  description: "A full-stack task management platform with role-based access, dashboards, and real-time task updates built with Next.js, MongoDB, TailwindCSS, and Zustand.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen p-4 sm:p-6 lg:p-8 pt-16">
          <QueryProvider>
            <AuthInitializer />
            <AppChrome>
              {children}
            </AppChrome>
          </QueryProvider>
        </div>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
