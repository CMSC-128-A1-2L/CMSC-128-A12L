import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {SessionProviderComponent} from "./providers/session_provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// metadata that contains the
export const metadata: Metadata = {
  title: "ARES",
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
        {/* Created a provider here since SessionProvider can only be used in client components, and layout is a server component (or it can be, but revisions are needed)*/}
        <SessionProviderComponent>
          {children}
        </SessionProviderComponent>
        </body>
    </html>
  );
}
