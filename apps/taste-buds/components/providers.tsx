'use client'

import { SessionProvider } from "next-auth/react"
import { Toaster } from "@/components/toaster"
import { ToastProvider } from "@/hooks/use-toast"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>
        {children}
        <Toaster />
      </ToastProvider>
    </SessionProvider>
  )
}
