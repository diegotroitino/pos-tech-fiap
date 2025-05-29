"use client"

import { MainLayout } from "@/components/main-layout"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { useCollaborators } from "@/contexts/collaborators-context"

export default function DashboardPage() {
  const { collaborators } = useCollaborators()

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
            <h2 className="mb-4 text-xl font-semibold">Colaboradores</h2>
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
                  {collaborators.map((collaborator) => (
                    <TableRow key={collaborator.id}>
                      <TableCell className="font-medium">
                        <Link href={`/profile/${collaborator.id}`} className="hover:underline">
                          {collaborator.nome}
                        </Link>
                      </TableCell>
                      <TableCell>{collaborator.cargo}</TableCell>
                      <TableCell className="text-center">{collaborator.pdi}%</TableCell>
                      <TableCell className="text-center">{getStatusBadge(collaborator.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="outline" size="sm" className="rounded-xl">
                          <Link href={`/wizard-pdi/${collaborator.id}`}>
                            {collaborator.pdi > 0 ? "Editar PDI" : "Gerar PDI"}
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
