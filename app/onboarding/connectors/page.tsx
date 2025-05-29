"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Github, FileSpreadsheet } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface Connector {
  id: string
  name: string
  icon: React.ElementType
  connected: boolean
}

export default function ConnectorsPage() {
  const [connectors, setConnectors] = useState<Connector[]>([
    { id: "jira", name: "Jira", icon: FileSpreadsheet, connected: false },
    { id: "github", name: "GitHub", icon: Github, connected: false },
    { id: "csv", name: "CSV RH", icon: FileSpreadsheet, connected: false },
  ])

  const toggleConnector = (id: string) => {
    setConnectors(
      connectors.map((connector) =>
        connector.id === id ? { ...connector, connected: !connector.connected } : connector,
      ),
    )
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col p-4 md:p-6">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-semibold">Conecte suas ferramentas</h1>
        <p className="text-muted-foreground">Conecte suas ferramentas para importar dados automaticamente</p>
      </div>

      <div className="mx-auto grid w-full max-w-3xl gap-6 md:grid-cols-2 lg:grid-cols-3">
        {connectors.map((connector) => (
          <Card
            key={connector.id}
            className={`rounded-2xl shadow-md transition-all ${connector.connected ? "border-2 border-success" : ""}`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="rounded-full bg-gray-100 p-2">
                <connector.icon className="h-6 w-6" />
              </div>
              {connector.connected && <Check className="h-5 w-5 text-success" />}
            </CardHeader>
            <CardContent>
              <CardTitle className="text-xl">{connector.name}</CardTitle>
              <CardDescription>Conecte seu {connector.name} para importar dados automaticamente</CardDescription>
            </CardContent>
            <CardFooter>
              <Button
                variant={connector.connected ? "outline" : "default"}
                className="w-full rounded-xl"
                onClick={() => toggleConnector(connector.id)}
              >
                {connector.connected ? "Desconectar" : "Conectar"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Button asChild className="rounded-xl px-8">
          <Link href="/onboarding/aspirations">Próximo</Link>
        </Button>
      </div>
    </div>
  )
}
