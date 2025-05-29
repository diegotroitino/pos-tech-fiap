"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { useCollaborators } from "@/contexts/collaborators-context"
import { useToast } from "@/components/ui/use-toast"

interface CollaboratorEditModalProps {
  collaboratorId: number | null
  isOpen: boolean
  onClose: () => void
}

const stackOptions = [
  "React",
  "Vue",
  "Angular",
  "Node.js",
  "Python",
  "Java",
  "C#",
  "GoLang",
  "TypeScript",
  "JavaScript",
  "SQL",
  "MongoDB",
  "PostgreSQL",
  "AWS",
  "Azure",
  "Docker",
]

export function CollaboratorEditModal({ collaboratorId, isOpen, onClose }: CollaboratorEditModalProps) {
  const { collaborators, updateCollaborator } = useCollaborators()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    nome: "",
    cargo: "",
    avatarUrl: "",
    stack: [] as string[],
    metaPessoal: "",
    aiPersonalization: "",
  })

  // Buscar colaborador específico pelo ID
  const collaborator = collaborators.find((c) => c.id === collaboratorId)

  useEffect(() => {
    if (collaborator && isOpen) {
      setFormData({
        nome: collaborator.nome,
        cargo: collaborator.cargo,
        avatarUrl: (collaborator as any).avatarUrl || "",
        stack: (collaborator as any).stack || [],
        metaPessoal: (collaborator as any).metaPessoal || "",
        aiPersonalization: (collaborator as any).aiPersonalization || "",
      })
    }
  }, [collaborator, isOpen])

  const handleStackToggle = (stackItem: string) => {
    setFormData((prev) => ({
      ...prev,
      stack: prev.stack.includes(stackItem) ? prev.stack.filter((s) => s !== stackItem) : [...prev.stack, stackItem],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!collaboratorId || !collaborator) {
      toast({
        title: "Erro",
        description: "Colaborador não encontrado",
        variant: "destructive",
      })
      return
    }

    updateCollaborator(collaboratorId, {
      nome: formData.nome,
      cargo: formData.cargo,
      avatarUrl: formData.avatarUrl,
      stack: formData.stack,
      metaPessoal: formData.metaPessoal,
      aiPersonalization: formData.aiPersonalization,
    } as any)

    toast({
      title: "Sucesso",
      description: `Perfil de ${formData.nome} atualizado com sucesso`,
    })

    onClose()
  }

  if (!collaborator) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Colaborador - {collaborator.nome}</DialogTitle>
          <DialogDescription>Atualize as informações do colaborador (ID: {collaboratorId})</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData((prev) => ({ ...prev, nome: e.target.value }))}
              className="rounded-xl"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cargo">Cargo</Label>
            <Input
              id="cargo"
              value={formData.cargo}
              onChange={(e) => setFormData((prev) => ({ ...prev, cargo: e.target.value }))}
              className="rounded-xl"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatarUrl">Avatar URL (opcional)</Label>
            <Input
              id="avatarUrl"
              type="url"
              value={formData.avatarUrl}
              onChange={(e) => setFormData((prev) => ({ ...prev, avatarUrl: e.target.value }))}
              className="rounded-xl"
              placeholder="https://exemplo.com/avatar.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label>Stack Principal</Label>
            <div className="flex flex-wrap gap-2 p-3 border rounded-xl min-h-[60px]">
              {stackOptions.map((stack) => (
                <Badge
                  key={stack}
                  variant={formData.stack.includes(stack) ? "default" : "outline"}
                  className="cursor-pointer rounded-full"
                  onClick={() => handleStackToggle(stack)}
                >
                  {stack}
                  {formData.stack.includes(stack) && <X className="w-3 h-3 ml-1" />}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="metaPessoal">Meta Pessoal (opcional)</Label>
            <Input
              id="metaPessoal"
              value={formData.metaPessoal}
              onChange={(e) => setFormData((prev) => ({ ...prev, metaPessoal: e.target.value }))}
              className="rounded-xl"
              maxLength={60}
              placeholder="Ex: Tornar-me tech lead em 2024"
            />
            <p className="text-xs text-muted-foreground">{formData.metaPessoal.length}/60 caracteres</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="aiPersonalization">Personalização para IA</Label>
            <Textarea
              id="aiPersonalization"
              value={formData.aiPersonalization}
              onChange={(e) => setFormData((prev) => ({ ...prev, aiPersonalization: e.target.value }))}
              className="rounded-xl min-h-[100px]"
              maxLength={500}
              placeholder="Contextos específicos, preferências de aprendizado, projetos atuais..."
            />
            <p className="text-xs text-muted-foreground">{formData.aiPersonalization.length}/500 caracteres</p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">
              Cancelar
            </Button>
            <Button type="submit" className="rounded-xl">
              Salvar Alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
