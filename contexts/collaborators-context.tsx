"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface Collaborator {
  id: number
  nome: string
  cargo: string
  pdi: number
  status: "green" | "amber" | "red"
  avatarUrl?: string
  stack?: string[]
  metaPessoal?: string
  aiPersonalization?: string
}

interface CollaboratorsContextType {
  collaborators: Collaborator[]
  addCollaborator: (collaborator: Omit<Collaborator, "id">) => number
  updateCollaborator: (id: number, data: Partial<Collaborator>) => void
}

const CollaboratorsContext = createContext<CollaboratorsContextType | undefined>(undefined)

export function CollaboratorsProvider({ children }: { children: ReactNode }) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    {
      id: 101,
      nome: "João Silva",
      cargo: "Dev Pleno",
      pdi: 40,
      status: "amber",
      stack: ["React", "Node.js", "TypeScript"],
      metaPessoal: "Evoluir para Tech Lead",
      aiPersonalization: "Trabalha principalmente com frontend React, tem interesse em arquitetura de sistemas",
    },
    {
      id: 102,
      nome: "Carla Dias",
      cargo: "Dev Sênior",
      pdi: 80,
      status: "green",
      stack: ["Vue", "Python", "PostgreSQL"],
      metaPessoal: "Especializar em arquitetura",
      aiPersonalization: "Foco em backend e dados, quer evoluir para arquiteta de soluções",
    },
    {
      id: 103,
      nome: "Pedro Santos",
      cargo: "Dev Júnior",
      pdi: 20,
      status: "red",
      stack: ["JavaScript", "HTML", "CSS"],
      metaPessoal: "Dominar React em 6 meses",
      aiPersonalization: "Iniciante, precisa de fundamentos sólidos antes de frameworks avançados",
    },
    {
      id: 104,
      nome: "Ana Oliveira",
      cargo: "Tech Lead",
      pdi: 65,
      status: "amber",
      stack: ["Java", "Spring", "AWS"],
      metaPessoal: "Melhorar gestão de pessoas",
      aiPersonalization: "Líder técnica experiente, quer desenvolver soft skills e gestão de equipes",
    },
    {
      id: 105,
      nome: "Lucas Mendes",
      cargo: "Dev Pleno",
      pdi: 90,
      status: "green",
      stack: ["GoLang", "Docker", "Kubernetes"],
      metaPessoal: "Contribuir com open source",
      aiPersonalization: "DevOps e infraestrutura, interesse em contribuições open source",
    },
    {
      id: 106,
      nome: "Leonardo",
      cargo: "Dev Sênior",
      pdi: 75,
      status: "green",
      stack: ["React", "TypeScript", "GraphQL"],
      metaPessoal: "Liderar projetos complexos",
      aiPersonalization: "Fullstack com foco em frontend, quer liderar projetos de grande escala",
    },
  ])

  const addCollaborator = (collaborator: Omit<Collaborator, "id">) => {
    const newId = Math.max(...collaborators.map((c) => c.id), 0) + 1
    const newCollaborator = { ...collaborator, id: newId }
    console.log("Adicionando colaborador:", newCollaborator)
    setCollaborators([...collaborators, newCollaborator])
    return newId
  }

  const updateCollaborator = (id: number, data: Partial<Collaborator>) => {
    setCollaborators(
      collaborators.map((collaborator) => (collaborator.id === id ? { ...collaborator, ...data } : collaborator)),
    )
  }

  return (
    <CollaboratorsContext.Provider value={{ collaborators, addCollaborator, updateCollaborator }}>
      {children}
    </CollaboratorsContext.Provider>
  )
}

export function useCollaborators() {
  const context = useContext(CollaboratorsContext)
  if (context === undefined) {
    throw new Error("useCollaborators must be used within a CollaboratorsProvider")
  }
  return context
}
