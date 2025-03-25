"use client"

import { SessionProvider } from "next-auth/react";

// session provider
export function SessionProviderComponent({ children }: { children: React.ReactNode }) {
    return <SessionProvider>{children}</SessionProvider>
}
