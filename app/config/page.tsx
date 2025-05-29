"use client"

import type React from "react"

import { MainLayout } from "@/components/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { FileSpreadsheet, Github, Settings, Users } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Integration {
  id: string
  name: string
  description: string
  icon: React.ElementType
  enabled: boolean
}

interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
}

export default function ConfigPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "jira",
      name: "Jira",
      description: "Importar tarefas e métricas do Jira",
      icon: FileSpreadsheet,
      enabled: true,
    },
    {
      id: "github",
      name: "GitHub",
      description: "Importar commits, PRs e métricas do GitHub",
      icon: Github,
      enabled: true,
    },
    {
      id: "csv",
      name: "CSV RH",
      description: "Importar dados de colaboradores via CSV",
      icon: FileSpreadsheet,
      enabled: false,
    },
  ])

  const [roles, setRoles] = useState<Role[]>([
    {
      id: "admin",
      name: "Administrador",
      description: "Acesso completo a todas as funcionalidades",
      permissions: ["read", "write", "delete", "manage_users"],
    },
    {
      id: "leader",
      name: "Líder",
      description: "Gerenciar PDIs de sua equipe",
      permissions: ["read", "write"],
    },
    {
      id: "member",
      name: "Membro",
      description: "Visualizar e atualizar seu próprio PDI",
      permissions: ["read", "update_own"],
    },
  ])

  const toggleIntegration = (id: string) => {
    setIntegrations(
      integrations.map((integration) =>
        integration.id === id ? { ...integration, enabled: !integration.enabled } : integration,
      ),
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Configurações</h1>
          <Button variant="outline" className="rounded-xl" asChild>
            <Link href="/dashboard">Voltar ao Dashboard</Link>
          </Button>
        </div>

        <Tabs defaultValue="integrations" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 rounded-xl">
            <TabsTrigger value="integrations" className="rounded-xl">
              Integrações
            </TabsTrigger>
            <TabsTrigger value="roles" className="rounded-xl">
              Papéis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="integrations" className="space-y-4">
            <Card className="rounded-2xl shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Integrações</CardTitle>
                <CardDescription>Gerencie as integrações com outras ferramentas</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-6">
                  {integrations.map((integration) => (
                    <div key={integration.id} className="space-y-4 rounded-lg border p-4">
                      <div className="flex items-start justify-between space-x-4">
                        <div className="flex items-start space-x-4">
                          <div className="rounded-lg bg-gray-100 p-2">
                            <integration.icon className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-medium">{integration.name}</h3>
                            <p className="text-sm text-muted-foreground">{integration.description}</p>
                          </div>
                        </div>
                        <Switch
                          checked={integration.enabled}
                          onCheckedChange={() => toggleIntegration(integration.id)}
                          aria-label={`Toggle ${integration.name} integration`}
                        />
                      </div>

                      {integration.enabled && (
                        <div className="space-y-4 rounded-lg bg-gray-50 p-4">
                          <h4 className="text-sm font-medium">Configurações da Integração</h4>

                          {integration.id === "jira" && (
                            <div className="space-y-3">
                              <div className="grid gap-2">
                                <Label htmlFor="jira-url">URL do Jira</Label>
                                <Input
                                  id="jira-url"
                                  placeholder="https://sua-empresa.atlassian.net"
                                  defaultValue="https://pdi-app.atlassian.net"
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="jira-project">Projeto</Label>
                                <Input id="jira-project" placeholder="PDI" defaultValue="PDI-APP" />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="jira-sync">Frequência de Sincronização</Label>
                                <Select defaultValue="daily">
                                  <SelectTrigger className="rounded-xl">
                                    <SelectValue placeholder="Selecione a frequência" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="hourly">A cada hora</SelectItem>
                                    <SelectItem value="daily">Diariamente</SelectItem>
                                    <SelectItem value="weekly">Semanalmente</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          )}

                          {integration.id === "github" && (
                            <div className="space-y-3">
                              <div className="grid gap-2">
                                <Label htmlFor="github-org">Organização/Usuário</Label>
                                <Input id="github-org" placeholder="sua-organizacao" defaultValue="pdi-app" />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="github-repos">Repositórios</Label>
                                <Input
                                  id="github-repos"
                                  placeholder="repo1, repo2, repo3"
                                  defaultValue="frontend, backend, docs"
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="github-metrics">Métricas a Coletar</Label>
                                <div className="flex flex-wrap gap-2 pt-1">
                                  <div className="flex items-center space-x-2">
                                    <Checkbox id="github-commits" defaultChecked />
                                    <Label htmlFor="github-commits" className="text-sm">
                                      Commits
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox id="github-prs" defaultChecked />
                                    <Label htmlFor="github-prs" className="text-sm">
                                      Pull Requests
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox id="github-reviews" defaultChecked />
                                    <Label htmlFor="github-reviews" className="text-sm">
                                      Code Reviews
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox id="github-issues" defaultChecked />
                                    <Label htmlFor="github-issues" className="text-sm">
                                      Issues
                                    </Label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {integration.id === "csv" && (
                            <div className="space-y-3">
                              <div className="grid gap-2">
                                <Label htmlFor="csv-format">Formato do CSV</Label>
                                <Select defaultValue="standard">
                                  <SelectTrigger className="rounded-xl">
                                    <SelectValue placeholder="Selecione o formato" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="standard">Padrão</SelectItem>
                                    <SelectItem value="custom">Personalizado</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="csv-upload">Upload de Arquivo</Label>
                                <div className="flex items-center gap-2">
                                  <Input id="csv-upload" type="file" accept=".csv" className="rounded-xl" />
                                  <Button variant="outline" size="sm" className="rounded-xl">
                                    Upload
                                  </Button>
                                </div>
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="csv-schedule">Agendamento de Importação</Label>
                                <Select defaultValue="manual">
                                  <SelectTrigger className="rounded-xl">
                                    <SelectValue placeholder="Selecione o agendamento" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="manual">Manual</SelectItem>
                                    <SelectItem value="weekly">Semanal</SelectItem>
                                    <SelectItem value="monthly">Mensal</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          )}

                          <div className="flex justify-end">
                            <Button variant="outline" size="sm" className="rounded-xl">
                              Salvar Configurações
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Configurações de Sincronização</CardTitle>
                <CardDescription>Configure como os dados são sincronizados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-4">
                <div className="flex items-center justify-between space-x-4">
                  <div>
                    <Label htmlFor="sync-auto" className="font-medium">
                      Sincronização Automática
                    </Label>
                    <p className="text-sm text-muted-foreground">Sincronizar dados automaticamente a cada 24 horas</p>
                  </div>
                  <Switch id="sync-auto" defaultChecked />
                </div>
                <div className="flex items-center justify-between space-x-4">
                  <div>
                    <Label htmlFor="sync-metrics" className="font-medium">
                      Sincronizar Métricas
                    </Label>
                    <p className="text-sm text-muted-foreground">Importar métricas de desempenho das integrações</p>
                  </div>
                  <Switch id="sync-metrics" defaultChecked />
                </div>
                <div className="flex items-center justify-between space-x-4">
                  <div>
                    <Label htmlFor="sync-feedback" className="font-medium">
                      Sincronizar Feedbacks
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Importar feedbacks de code reviews e outros sistemas
                    </p>
                  </div>
                  <Switch id="sync-feedback" defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles" className="space-y-4">
            <Card className="rounded-2xl shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Papéis e Permissões</CardTitle>
                <CardDescription>Gerencie os papéis e permissões dos usuários</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-6">
                  {roles.map((role) => (
                    <div key={role.id} className="flex items-start justify-between space-x-4">
                      <div className="flex items-start space-x-4">
                        <div className="rounded-lg bg-gray-100 p-2">
                          <Users className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-medium">{role.name}</h3>
                          <p className="text-sm text-muted-foreground">{role.description}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {role.permissions.map((permission) => (
                              <span
                                key={permission}
                                className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium"
                              >
                                {permission}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-xl">
                        <Settings className="mr-2 h-4 w-4" />
                        Editar
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Configurações de Acesso</CardTitle>
                <CardDescription>Configure as políticas de acesso</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-4">
                <div className="flex items-center justify-between space-x-4">
                  <div>
                    <Label htmlFor="access-self" className="font-medium">
                      Acesso ao Próprio PDI
                    </Label>
                    <p className="text-sm text-muted-foreground">Permitir que colaboradores vejam seu próprio PDI</p>
                  </div>
                  <Switch id="access-self" defaultChecked />
                </div>
                <div className="flex items-center justify-between space-x-4">
                  <div>
                    <Label htmlFor="access-metrics" className="font-medium">
                      Métricas Visíveis
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Permitir que colaboradores vejam suas próprias métricas
                    </p>
                  </div>
                  <Switch id="access-metrics" defaultChecked />
                </div>
                <div className="flex items-center justify-between space-x-4">
                  <div>
                    <Label htmlFor="access-team" className="font-medium">
                      Visibilidade da Equipe
                    </Label>
                    <p className="text-sm text-muted-foreground">Permitir que líderes vejam PDIs de toda a equipe</p>
                  </div>
                  <Switch id="access-team" defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
