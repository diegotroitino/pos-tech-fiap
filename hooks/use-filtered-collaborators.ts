"use client"

import { useMemo } from "react"
import { useCollaborators } from "@/contexts/collaborators-context"

export function useFilteredCollaborators(searchTerm: string, statusFilter: string) {
  const { collaborators } = useCollaborators()

  return useMemo(() => {
    return collaborators.filter((collaborator) => {
      const matchesSearch =
        collaborator.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collaborator.cargo.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "todos" || collaborator.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [collaborators, searchTerm, statusFilter])
}
