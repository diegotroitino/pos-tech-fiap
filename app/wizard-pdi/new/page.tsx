"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/main-layout"
import { RadarChart } from "@/components/radar-chart"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Check, ChevronLeft, ChevronRight, Code, FileText, Lightbulb, Presentation } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { useCollaborators } from "@/contexts/collaborators-context"

export default function NewCollaboratorWizardPDI() {
  const router = useRouter()
  const { toast } = useToast()
  const { addCollaborator } = useCollaborators()
  const [step, setStep] = useState(1)
  const [date, setDate] = useState<Date>()
  const [newCollaboratorData, setNewCollaboratorData] = useState<any>(null)

  useEffect(() => {
    // Recuperar os dados do localStorage
    const storedData = localStorage.getItem("newCollaborator")
    if (storedData) {
      setNewCollaboratorData(JSON.parse(storedData))
    }
  }, [])

  // Dados iniciais para um novo colaborador
  const skills = [
    { name: "GoLang", score: 3, maxScore: 5 },
    { name: "React", score: 4, maxScore: 5 },
    { name: "SQL", score: 3, maxScore: 5 },
    { name: "Mentoria", score: 2, maxScore: 5 },
    { name: "Arquitetura", score: 2, maxScore: 5 },
  ]

  const gaps = [
    { skill: "Mentoria", score: 2, description: "Precisa desenvolver habilidades de mentoria" },
    { skill: "Arquitetura", score: 2, description: "Pode melhorar conhecimentos em arquitetura de software" },
  ]

  const recommendations = [
    {
      id: 1,
      title: "Curso de Mentoria Técnica",
      description: "Curso online para desenvolver habilidades de mentoria técnica",
      type: "Curso",
      effort: "Médio",
      icon: Presentation,
      selected: true,
    },
    {
      id: 2,
      title: "Workshop de Arquitetura",
      description: "Participar de workshop sobre arquitetura de software",
      type: "Workshop",
      effort: "Alto",
      icon: Code,
      selected: true,
    },
    {
      id: 3,
      title: "Leitura: Clean Architecture",
      description: "Livro sobre princípios de arquitetura limpa",
      type: "Leitura",
      effort: "Médio",
      icon: FileText,
      selected: false,
    },
    {
      id: 4,
      title: "Projeto de Mentoria",
      description: "Mentorar um desenvolvedor júnior em um projeto real",
      type: "Projeto",
      effort: "Alto",
      icon: Lightbulb,
      selected: false,
    },
  ]

  const [selectedRecommendations, setSelectedRecommendations] = useState(
    recommendations.filter((r) => r.selected).map((r) => r.id),
  )

  const toggleRecommendation = (id: number) => {
    setSelectedRecommendations((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      if (newCollaboratorData) {
        // Adicionar o novo colaborador
        addCollaborator({
          nome: newCollaboratorData.nome,
          cargo: newCollaboratorData.cargo,
          pdi: 0, // Inicialmente 0%
          status: "amber", // Status inicial
        })

        // Limpar os dados do localStorage
        localStorage.removeItem("newCollaborator")

        toast({
          title: "Colaborador adicionado com sucesso",
          description: "O novo colaborador e seu PDI foram criados",
        })

        router.push("/dashboard")
      } else {
        toast({
          title: "Erro",
          description: "Dados do colaborador não encontrados",
          variant: "destructive",
        })
      }
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">
            Configurar PDI - {newCollaboratorData ? newCollaboratorData.nome : "Novo Colaborador"}
          </h1>
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="rounded-xl" asChild>
              <Link href="/dashboard">Cancelar</Link>
            </Button>
            <Button variant="outline" className="rounded-xl" onClick={handleBack} disabled={step === 1}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <Button className="rounded-xl" onClick={handleNext}>
              {step === 3 ? "Finalizar" : "Próximo"}
              {step !== 3 && <ChevronRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 1 ? "bg-primary" : "bg-gray-300"} text-white`}
              >
                1
              </div>
              <div className={`h-1 w-16 ${step >= 2 ? "bg-primary" : "bg-gray-300"}`}></div>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 2 ? "bg-primary" : "bg-gray-300"} text-white`}
              >
                2
              </div>
              <div className={`h-1 w-16 ${step >= 3 ? "bg-primary" : "bg-gray-300"}`}></div>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 3 ? "bg-primary" : "bg-gray-300"} text-white`}
              >
                3
              </div>
            </div>
            <span className="text-sm text-muted-foreground">Passo {step}/3</span>
          </div>
        </div>

        {step === 1 && (
          <div className="grid gap-6 md:grid-cols-2">
            <RadarChart skills={skills} />
            <Card className="rounded-2xl shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Gaps Identificados</CardTitle>
                <CardDescription>Áreas que precisam de desenvolvimento</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <ul className="space-y-4">
                  {gaps.map((gap) => (
                    <li key={gap.skill} className="flex items-start space-x-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                        <span className="text-xs font-medium">{gap.score}</span>
                      </div>
                      <div>
                        <h4 className="font-medium">{gap.skill}</h4>
                        <p className="text-sm text-muted-foreground">{gap.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Recomendações</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {recommendations.map((recommendation) => (
                <Card
                  key={recommendation.id}
                  className={`rounded-2xl shadow-md transition-all ${
                    selectedRecommendations.includes(recommendation.id) ? "border-2 border-primary" : ""
                  }`}
                >
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="flex items-start space-x-3">
                      <div className="rounded-lg bg-primary/10 p-2 text-primary">
                        <recommendation.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{recommendation.title}</CardTitle>
                        <CardDescription className="mt-1 text-sm">{recommendation.description}</CardDescription>
                      </div>
                    </div>
                    <Checkbox
                      checked={selectedRecommendations.includes(recommendation.id)}
                      onCheckedChange={() => toggleRecommendation(recommendation.id)}
                      className="h-5 w-5"
                    />
                  </CardHeader>
                  <CardFooter className="flex items-center justify-between pt-0">
                    <Badge variant="outline" className="rounded-full">
                      {recommendation.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">Esforço: {recommendation.effort}</span>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Resumo do PDI</h2>
            <Card className="rounded-2xl shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Configurações do PDI</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Data de Início</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start rounded-xl text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP", { locale: ptBR }) : "Selecione uma data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duração (meses)</Label>
                    <Input id="duration" type="number" defaultValue="3" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Prioridade</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Selecione a prioridade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="low">Baixa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="review-frequency">Frequência de Revisão</Label>
                    <Select defaultValue="biweekly">
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Selecione a frequência" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="biweekly">Quinzenal</SelectItem>
                        <SelectItem value="monthly">Mensal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Atividades Selecionadas</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <ul className="space-y-3">
                  {recommendations
                    .filter((r) => selectedRecommendations.includes(r.id))
                    .map((recommendation) => (
                      <li key={recommendation.id} className="flex items-center space-x-3">
                        <Check className="h-5 w-5 text-success" />
                        <div>
                          <h4 className="font-medium">{recommendation.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {recommendation.type} - Esforço: {recommendation.effort}
                          </p>
                        </div>
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
