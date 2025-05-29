"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { HelpCircle } from "lucide-react"

interface Question {
  id: string
  question: string
  options: string[]
  tooltip?: string
  type?: "single" | "multiple"
}

export default function AspirationsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isNewCollaborator = searchParams.get("newCollaborator") === "true"
  const [collaboratorName, setCollaboratorName] = useState("")
  const [collaboratorRole, setCollaboratorRole] = useState("")
  const [aiPersonalization, setAiPersonalization] = useState("")

  const questions: Question[] = [
    {
      id: "growth",
      question: "Quero crescer em:",
      options: ["Backend", "Frontend", "Liderança", "Arquitetura"],
      tooltip: "Ex.: considere o próximo ciclo trimestral do seu squad ao responder.",
      type: "multiple",
    },
    {
      id: "learning",
      question: "Prefiro aprender através de:",
      options: ["Cursos online", "Mentoria", "Projetos práticos", "Livros"],
      tooltip: "Pense no método que mais te motiva e gera resultados.",
      type: "multiple",
    },
    {
      id: "timeframe",
      question: "Meu horizonte de desenvolvimento é:",
      options: ["3 meses", "6 meses", "1 ano", "2+ anos"],
      tooltip: "Considere seus objetivos de carreira e disponibilidade.",
      type: "single",
    },
    {
      id: "challenge",
      question: "Meu maior desafio atual é:",
      options: ["Técnico", "Comunicação", "Gestão de tempo", "Liderança"],
      tooltip: "Identifique a área que mais impacta seu crescimento.",
      type: "single",
    },
    {
      id: "goal",
      question: "Meu objetivo de carreira é:",
      options: ["Especialista técnico", "Gestor de equipe", "Arquiteto", "Empreendedor"],
      tooltip: "Pense onde você se vê nos próximos 2-3 anos.",
      type: "single",
    },
  ]

  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})

  const handleSingleChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleMultipleChange = (questionId: string, option: string, checked: boolean) => {
    setAnswers((prev) => {
      const currentAnswers = (prev[questionId] as string[]) || []
      if (checked) {
        return { ...prev, [questionId]: [...currentAnswers, option] }
      } else {
        return { ...prev, [questionId]: currentAnswers.filter((item) => item !== option) }
      }
    })
  }

  const handleContinue = () => {
    if (isNewCollaborator) {
      if (!collaboratorName || !collaboratorRole) {
        alert("Por favor, preencha o nome e o cargo do colaborador.")
        return
      }

      // Armazenar os dados no localStorage para uso posterior
      localStorage.setItem(
        "newCollaborator",
        JSON.stringify({
          nome: collaboratorName,
          cargo: collaboratorRole,
          aspirations: answers,
          aiPersonalization,
        }),
      )

      router.push("/wizard-pdi/new")
    } else {
      router.push("/dashboard")
    }
  }

  const answeredQuestions = Object.keys(answers).length
  const totalQuestions = questions.length

  return (
    <TooltipProvider>
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col p-4 md:p-6">
        <div className="mb-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success text-white">1</div>
              <div className="h-1 w-16 bg-success"></div>
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">2</div>
            </div>
            <span className="text-sm text-muted-foreground">
              Passo {isNewCollaborator ? "1/2" : "2/2"} – Pergunta {answeredQuestions}/{totalQuestions}
            </span>
          </div>
          <h1 className="text-3xl font-semibold">{isNewCollaborator ? "Novo Colaborador" : "Suas aspirações"}</h1>
          <p className="text-muted-foreground">
            {isNewCollaborator
              ? "Preencha as informações do novo colaborador e suas aspirações"
              : "Conte-nos sobre seus objetivos de desenvolvimento"}
          </p>
        </div>

        {isNewCollaborator && (
          <Card className="mb-6 rounded-2xl shadow-md">
            <CardContent className="p-4 md:p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Colaborador</Label>
                  <Input
                    id="name"
                    placeholder="Nome completo"
                    value={collaboratorName}
                    onChange={(e) => setCollaboratorName(e.target.value)}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Cargo</Label>
                  <Input
                    id="role"
                    placeholder="Ex: Dev Pleno, Tech Lead, etc."
                    value={collaboratorRole}
                    onChange={(e) => setCollaboratorRole(e.target.value)}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aiPersonalization">Personalização para IA</Label>
                  <Textarea
                    id="aiPersonalization"
                    placeholder="Descreva contextos específicos, preferências de aprendizado, projetos atuais ou qualquer informação que possa ajudar a IA a personalizar melhor o PDI..."
                    value={aiPersonalization}
                    onChange={(e) => setAiPersonalization(e.target.value)}
                    className="rounded-xl min-h-[100px]"
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground">{aiPersonalization.length}/500 caracteres</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-4 md:p-6">
            <div className="space-y-6">
              {questions.map((question, index) => (
                <div key={question.id} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{question.question}</h3>
                    {question.tooltip && (
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="w-4 h-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{question.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>

                  {question.type === "multiple" ? (
                    <div className="flex flex-wrap gap-2">
                      {question.options.map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${question.id}-${option}`}
                            checked={((answers[question.id] as string[]) || []).includes(option)}
                            onCheckedChange={(checked) => handleMultipleChange(question.id, option, checked as boolean)}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={`${question.id}-${option}`}
                            className="flex cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-normal peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 hover:bg-gray-100"
                          >
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <RadioGroup
                      value={answers[question.id] as string}
                      onValueChange={(value) => handleSingleChange(question.id, value)}
                      className="flex flex-wrap gap-2"
                    >
                      {question.options.map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`${question.id}-${option}`} className="peer sr-only" />
                          <Label
                            htmlFor={`${question.id}-${option}`}
                            className="flex cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-normal peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 hover:bg-gray-100"
                          >
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex justify-between">
          <Button variant="outline" className="rounded-xl" asChild>
            <Link href={isNewCollaborator ? "/dashboard" : "/onboarding/connectors"}>Voltar</Link>
          </Button>
          <Button className="rounded-xl px-8" onClick={handleContinue} disabled={answeredQuestions < totalQuestions}>
            {isNewCollaborator ? "Configurar PDI" : "Concluir"}
          </Button>
        </div>
      </div>
    </TooltipProvider>
  )
}
