"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { Calendar, Code, FileText, GitBranch, GitPullRequest, GraduationCap, Presentation } from "lucide-react"
import Link from "next/link"
import { useCollaborators } from "@/contexts/collaborators-context"

interface ProfileProps {
  params: {
    id: string
  }
}

export default function Profile({ params }: ProfileProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("resumo")
  const { collaborators } = useCollaborators()

  // Encontrar o colaborador pelo ID
  const collaboratorId = Number.parseInt(params.id)
  const collaborator = collaborators.find((c) => c.id === collaboratorId)

  // Dados de tarefas específicos para cada colaborador
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Curso de Mentoria Técnica",
      progress: 30,
      status: "em-andamento",
      icon: Presentation,
    },
    {
      id: 2,
      title: "Projeto de React Avançado",
      progress: 0,
      status: "proximo",
      icon: Code,
    },
    {
      id: 3,
      title: "Leitura: Effective Mentoring",
      progress: 100,
      status: "concluido",
      icon: FileText,
    },
  ])

  const handleDragStart = (e: React.DragEvent, taskId: number) => {
    e.dataTransfer.setData("taskId", taskId.toString())
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault()
    const taskId = Number.parseInt(e.dataTransfer.getData("taskId"))

    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status,
              progress: status === "concluido" ? 100 : status === "em-andamento" ? 30 : 0,
            }
          : task,
      ),
    )

    toast({
      title: "Progresso salvo",
      description: "A atividade foi movida com sucesso",
      aria: {
        live: "polite",
      },
    })
  }

  const feedbacks = [
    {
      id: 1,
      date: "10/05/2023",
      tag: "Code Review",
      content: "Excelente trabalho na refatoração do módulo de autenticação. Código limpo e bem documentado.",
    },
    {
      id: 2,
      date: "22/04/2023",
      tag: "1:1",
      content:
        "Demonstrou boa capacidade de resolução de problemas no último sprint. Precisa melhorar a comunicação com o time de produto.",
    },
    {
      id: 3,
      date: "15/03/2023",
      tag: "Projeto",
      content:
        "Liderou bem a implementação da nova feature. O time destacou sua ajuda nas sessões de pair programming.",
    },
  ]

  const metrics = [
    { id: 1, title: "Commits", value: 127, icon: GitBranch, change: "+12% vs. último mês" },
    { id: 2, title: "Pull Requests", value: 24, icon: GitPullRequest, change: "+5% vs. último mês" },
    { id: 3, title: "Cursos Concluídos", value: 3, icon: GraduationCap, change: "+1 vs. último mês" },
    { id: 4, title: "Reuniões 1:1", value: 8, icon: Calendar, change: "Mensal" },
  ]

  useEffect(() => {
    // Verificar se há um hash na URL e ativar a tab correspondente
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "")
      if (hash && ["resumo", "roadmap", "feedbacks", "metricas"].includes(hash)) {
        setActiveTab(hash)
      }
    }
  }, [])

  // Se o colaborador não for encontrado, exibir mensagem
  if (!collaborator) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-full p-8">
          <h1 className="text-2xl font-semibold mb-4">Colaborador não encontrado</h1>
          <p className="text-muted-foreground mb-6">O colaborador com ID {params.id} não foi encontrado.</p>
          <Button asChild className="rounded-xl">
            <Link href="/dashboard">Voltar para o Dashboard</Link>
          </Button>
        </div>
      </MainLayout>
    )
  }

  // Gerar iniciais para o avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Calcular progresso do PDI
  const pdiProgress = collaborator.pdi || 0

  // Determinar contagens baseadas nas tarefas
  const pendingCount = tasks.filter((t) => t.status === "proximo").length
  const inProgressCount = tasks.filter((t) => t.status === "em-andamento").length
  const completedCount = tasks.filter((t) => t.status === "concluido").length

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Perfil - {collaborator.nome}</h1>
          <Button className="rounded-xl" asChild>
            <Link href={`/wizard-pdi/${collaborator.id}`}>Editar PDI</Link>
          </Button>
        </div>

        <Tabs defaultValue="resumo" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 rounded-xl">
            <TabsTrigger value="resumo" className="rounded-xl">
              Resumo
            </TabsTrigger>
            <TabsTrigger value="roadmap" className="rounded-xl">
              Roadmap
            </TabsTrigger>
            <TabsTrigger value="feedbacks" className="rounded-xl">
              Feedbacks
            </TabsTrigger>
            <TabsTrigger value="metricas" className="rounded-xl">
              Métricas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resumo" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="rounded-2xl shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Informações</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="/placeholder.svg" alt={collaborator.nome} />
                      <AvatarFallback>{getInitials(collaborator.nome)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h3 className="text-xl font-semibold">{collaborator.nome}</h3>
                      <p className="text-muted-foreground">{collaborator.cargo}</p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">GoLang</Badge>
                        <Badge variant="outline">React</Badge>
                        <Badge variant="outline">SQL</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Progresso do PDI</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Progresso Geral</span>
                      <span className="text-sm font-medium">{pdiProgress}%</span>
                    </div>
                    <Progress value={pdiProgress} className="h-2" />
                    <div className="grid grid-cols-3 gap-4 pt-4 text-center">
                      <div>
                        <div className="text-2xl font-bold">{pendingCount}</div>
                        <div className="text-xs text-muted-foreground">Pendente</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{inProgressCount}</div>
                        <div className="text-xs text-muted-foreground">Em Progresso</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{completedCount}</div>
                        <div className="text-xs text-muted-foreground">Concluído</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="rounded-2xl shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Objetivos de Desenvolvimento</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <div className="rounded-full bg-primary/10 p-1 text-primary">
                      <Presentation className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">Desenvolver habilidades de mentoria</h4>
                      <p className="text-sm text-muted-foreground">
                        Aprimorar capacidade de orientar membros juniores da equipe
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="rounded-full bg-primary/10 p-1 text-primary">
                      <Code className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">Aprofundar conhecimentos em React</h4>
                      <p className="text-sm text-muted-foreground">Dominar hooks avançados e padrões de arquitetura</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roadmap" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="space-y-4" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, "proximo")}>
                <h3 className="font-semibold">Próximo</h3>
                {tasks
                  .filter((task) => task.status === "proximo")
                  .map((task) => (
                    <Card
                      key={task.id}
                      className="cursor-move rounded-2xl shadow-md"
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="rounded-lg bg-gray-100 p-2">
                            <task.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-medium">{task.title}</h4>
                            <div className="mt-2 flex items-center justify-between">
                              <Badge variant="outline" className="text-xs">
                                {task.progress}%
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>

              <div className="space-y-4" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, "em-andamento")}>
                <h3 className="font-semibold">Em andamento</h3>
                {tasks
                  .filter((task) => task.status === "em-andamento")
                  .map((task) => (
                    <Card
                      key={task.id}
                      className="cursor-move rounded-2xl shadow-md"
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="rounded-lg bg-primary/10 p-2 text-primary">
                            <task.icon className="h-5 w-5" />
                          </div>
                          <div className="w-full">
                            <h4 className="font-medium">{task.title}</h4>
                            <div className="mt-2 flex items-center justify-between">
                              <Badge variant="outline" className="text-xs">
                                {task.progress}%
                              </Badge>
                              <Progress value={task.progress} className="h-1 w-16" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>

              <div className="space-y-4" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, "concluido")}>
                <h3 className="font-semibold">Concluído</h3>
                {tasks
                  .filter((task) => task.status === "concluido")
                  .map((task) => (
                    <Card
                      key={task.id}
                      className="cursor-move rounded-2xl shadow-md"
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="rounded-lg bg-success/10 p-2 text-success">
                            <task.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-medium">{task.title}</h4>
                            <div className="mt-2 flex items-center justify-between">
                              <Badge variant="outline" className="text-xs">
                                {task.progress}%
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="feedbacks" className="space-y-6">
            <Card className="rounded-2xl shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Histórico de Feedbacks</CardTitle>
                <CardDescription>Feedbacks recebidos ao longo do tempo</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="relative space-y-8 pl-6 before:absolute before:inset-y-0 before:left-2 before:border-l-2 before:border-dashed">
                  {feedbacks.map((feedback) => (
                    <div key={feedback.id} className="relative">
                      <div className="absolute -left-6 flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                        <div className="h-2 w-2 rounded-full bg-white"></div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{feedback.date}</span>
                          <Badge variant="outline" className="rounded-full">
                            {feedback.tag}
                          </Badge>
                        </div>
                        <p className="text-sm">{feedback.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metricas" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {metrics.map((metric) => (
                <Card key={metric.id} className="rounded-2xl shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                        <h3 className="mt-1 text-2xl font-bold">{metric.value}</h3>
                        <p className="mt-1 text-xs text-muted-foreground">{metric.change}</p>
                      </div>
                      <div className="rounded-full bg-primary/10 p-2 text-primary">
                        <metric.icon className="h-5 w-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="rounded-2xl shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Atividade no GitHub</CardTitle>
                <CardDescription>Contribuições nos últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-26 gap-1">
                  {Array.from({ length: 26 * 7 }).map((_, i) => {
                    const intensity = Math.random()
                    let bg

                    if (intensity < 0.2) {
                      bg = "bg-gray-100"
                    } else if (intensity < 0.4) {
                      bg = "bg-primary/20"
                    } else if (intensity < 0.6) {
                      bg = "bg-primary/40"
                    } else if (intensity < 0.8) {
                      bg = "bg-primary/60"
                    } else {
                      bg = "bg-primary/80"
                    }

                    return (
                      <div
                        key={i}
                        className={`h-3 w-3 rounded-sm ${bg}`}
                        title={`${Math.floor(intensity * 10)} contribuições`}
                      />
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
