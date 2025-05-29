"use client"

import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, PieChart } from "lucide-react"

export default function ReportsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Relatórios</h1>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 rounded-xl">
            <TabsTrigger value="overview" className="rounded-xl">
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="team" className="rounded-xl">
              Equipe
            </TabsTrigger>
            <TabsTrigger value="individual" className="rounded-xl">
              Individual
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="rounded-2xl shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Progresso Geral</CardTitle>
                  <CardDescription>Progresso médio dos PDIs</CardDescription>
                </CardHeader>
                <CardContent className="flex h-60 items-center justify-center p-4">
                  <div className="flex h-40 w-40 items-center justify-center rounded-full border-8 border-primary text-4xl font-bold">
                    68%
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Status dos PDIs</CardTitle>
                  <CardDescription>Distribuição por status</CardDescription>
                </CardHeader>
                <CardContent className="flex h-60 items-center justify-center p-4">
                  <div className="flex items-center justify-center">
                    <PieChart className="h-40 w-40 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Atividades Concluídas</CardTitle>
                  <CardDescription>Últimos 6 meses</CardDescription>
                </CardHeader>
                <CardContent className="flex h-60 items-center justify-center p-4">
                  <div className="flex items-center justify-center">
                    <BarChart className="h-40 w-40 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="rounded-2xl shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Tendência de Progresso</CardTitle>
                <CardDescription>Evolução ao longo do tempo</CardDescription>
              </CardHeader>
              <CardContent className="h-80 p-4">
                <div className="flex h-full items-center justify-center">
                  <LineChart className="h-60 w-full text-primary" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            <Card className="rounded-2xl shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Relatórios da Equipe</CardTitle>
                <CardDescription>Análise de desempenho da equipe</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-muted-foreground">
                  Os relatórios detalhados da equipe estarão disponíveis em breve.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="individual" className="space-y-4">
            <Card className="rounded-2xl shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Relatórios Individuais</CardTitle>
                <CardDescription>Análise de desempenho individual</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-muted-foreground">
                  Os relatórios individuais detalhados estarão disponíveis em breve.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
