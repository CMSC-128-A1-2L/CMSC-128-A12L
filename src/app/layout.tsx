import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import 'reflect-metadata';
import { container } from "tsyringe";
import { InMemoryUserRepository, UserRepository } from "@/repositories/user_repository";

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
  // TODO: Use environment variables to determine if we need an in-memory repository or a database repository.
  // Doesn't matter right now since we don't have a database repository just yet.
  container.registerSingleton<UserRepository>(InMemoryUserRepository);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
