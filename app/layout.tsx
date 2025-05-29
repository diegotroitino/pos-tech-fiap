import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { CollaboratorsProvider } from "@/contexts/collaborators-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PDI Personalizado",
  description: "Plataforma de Desenvolvimento Individual Personalizado",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <CollaboratorsProvider>
          {children}
          <Toaster />
        </CollaboratorsProvider>
      </body>
    </html>
  )
}
