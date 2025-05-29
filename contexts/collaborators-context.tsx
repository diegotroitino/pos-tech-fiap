"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface Collaborator {
  id: number
  nome: string
  cargo: string
  pdi: number
  status: "green" | "amber" | "red"
}

interface CollaboratorsContextType {
  collaborators: Collaborator[]
  addCollaborator: (collaborator: Omit<Collaborator, "id">) => void
  updateCollaborator: (id: number, data: Partial<Collaborator>) => void
}

const CollaboratorsContext = createContext<CollaboratorsContextType | undefined>(undefined)

export function CollaboratorsProvider({ children }: { children: ReactNode }) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    { id: 101, nome: "João Silva", cargo: "Dev Pleno", pdi: 40, status: "amber" },
    { id: 102, nome: "Carla Dias", cargo: "Dev Sênior", pdi: 80, status: "green" },
    { id: 103, nome: "Pedro Santos", cargo: "Dev Júnior", pdi: 20, status: "red" },
    { id: 104, nome: "Ana Oliveira", cargo: "Tech Lead", pdi: 65, status: "amber" },
    { id: 105, nome: "Lucas Mendes", cargo: "Dev Pleno", pdi: 90, status: "green" },
  ])

  const addCollaborator = (collaborator: Omit<Collaborator, "id">) => {
    const newId = Math.max(...collaborators.map((c) => c.id), 0) + 1
    setCollaborators([...collaborators, { ...collaborator, id: newId }])
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
