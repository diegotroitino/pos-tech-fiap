"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"

interface Question {
  id: string
  question: string
  options: string[]
}

export default function AspirationsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isNewCollaborator = searchParams.get("newCollaborator") === "true"
  const [collaboratorName, setCollaboratorName] = useState("")
  const [collaboratorRole, setCollaboratorRole] = useState("")

  const questions: Question[] = [
    {
      id: "growth",
      question: "Quero crescer em:",
      options: ["Backend", "Frontend", "Liderança", "Arquitetura"],
    },
    {
      id: "learning",
      question: "Prefiro aprender através de:",
      options: ["Cursos online", "Mentoria", "Projetos práticos", "Livros"],
    },
    {
      id: "timeframe",
      question: "Meu horizonte de desenvolvimento é:",
      options: ["3 meses", "6 meses", "1 ano", "2+ anos"],
    },
    {
      id: "challenge",
      question: "Meu maior desafio atual é:",
      options: ["Técnico", "Comunicação", "Gestão de tempo", "Liderança"],
    },
    {
      id: "goal",
      question: "Meu objetivo de carreira é:",
      options: ["Especialista técnico", "Gestor de equipe", "Arquiteto", "Empreendedor"],
    },
  ]

  const [answers, setAnswers] = useState<Record<string, string>>({})

  const handleChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
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
        }),
      )

      router.push("/wizard-pdi/new")
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col p-4 md:p-6">
      <div className="mb-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success text-white">1</div>
            <div className="h-1 w-16 bg-success"></div>
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">2</div>
          </div>
          <span className="text-sm text-muted-foreground">Passo {isNewCollaborator ? "1/2" : "2/2"}</span>
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
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="rounded-2xl shadow-md">
        <CardContent className="p-4 md:p-6">
          <div className="space-y-6">
            {questions.map((question) => (
              <div key={question.id} className="space-y-3">
                <h3 className="font-medium">{question.question}</h3>
                <RadioGroup
                  value={answers[question.id]}
                  onValueChange={(value) => handleChange(question.id, value)}
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
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" className="rounded-xl" asChild>
          <Link href={isNewCollaborator ? "/dashboard" : "/onboarding/connectors"}>Voltar</Link>
        </Button>
        <Button className="rounded-xl px-8" onClick={handleContinue}>
          {isNewCollaborator ? "Configurar PDI" : "Concluir"}
        </Button>
      </div>
    </div>
  )
}
