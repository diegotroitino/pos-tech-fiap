"use client"

import { MainLayout } from "@/components/main-layout"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Eye, Edit } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { PdiFilters } from "@/components/pdi-filters"
import { useFilteredCollaborators } from "@/hooks/use-filtered-collaborators"
import { CollaboratorEditModal } from "@/components/collaborator-edit-modal"

export default function DashboardPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [editingCollaboratorId, setEditingCollaboratorId] = useState<number | null>(null)

  const filteredCollaborators = useFilteredCollaborators(searchTerm, statusFilter)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "green":
        return <Badge className="bg-success">Em dia</Badge>
      case "amber":
        return <Badge className="bg-amber-500">Atenção</Badge>
      case "red":
        return <Badge className="bg-red-500">Atrasado</Badge>
      default:
        return null
    }
  }

  const handleRowClick = (collaboratorId: number) => {
    router.push(`/profile/${collaboratorId}`)
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <Button className="rounded-xl" asChild>
            <Link href="/onboarding/aspirations?newCollaborator=true">
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Colaborador
            </Link>
          </Button>
        </div>

        <div className="rounded-2xl border bg-white shadow-md">
          <div className="p-4 md:p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Colaboradores</h2>
              <span className="text-sm text-muted-foreground">{filteredCollaborators.length} colaborador(es)</span>
            </div>

            <div className="mb-6">
              <PdiFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
              />
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Colaborador</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead className="text-center">% PDI</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCollaborators.map((collaborator) => (
                    <TableRow
                      key={collaborator.id}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleRowClick(collaborator.id)}
                    >
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{collaborator.nome}</span>
                          {collaborator.metaPessoal && (
                            <span className="text-xs text-muted-foreground">{collaborator.metaPessoal}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{collaborator.cargo}</span>
                          {collaborator.stack && collaborator.stack.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {collaborator.stack.slice(0, 2).map((tech) => (
                                <Badge key={tech} variant="outline" className="text-xs">
                                  {tech}
                                </Badge>
                              ))}
                              {collaborator.stack.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{collaborator.stack.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{collaborator.pdi}%</TableCell>
                      <TableCell className="text-center">{getStatusBadge(collaborator.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl"
                            onClick={(e) => {
                              e.stopPropagation()
                              router.push(`/profile/${collaborator.id}`)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                            Ver
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl"
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditingCollaboratorId(collaborator.id)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl"
                            onClick={(e) => {
                              e.stopPropagation()
                              router.push(`/wizard-pdi/${collaborator.id}`)
                            }}
                          >
                            {collaborator.pdi > 0 ? "Editar PDI" : "Gerar PDI"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        <CollaboratorEditModal
          collaboratorId={editingCollaboratorId}
          isOpen={editingCollaboratorId !== null}
          onClose={() => setEditingCollaboratorId(null)}
        />
      </div>
    </MainLayout>
  )
}
