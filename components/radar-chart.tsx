"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Skill {
  name: string
  score: number
  maxScore: number
}

interface RadarChartProps {
  skills: Skill[]
}

export function RadarChart({ skills }: RadarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Configurar o canvas
    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(centerX, centerY) * 0.8

    // Limpar o canvas
    ctx.clearRect(0, 0, width, height)

    // Desenhar o background
    ctx.fillStyle = "#f9fafb"
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.fill()

    // Desenhar os círculos concêntricos
    const levels = 5
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 1

    for (let i = 1; i <= levels; i++) {
      const levelRadius = (radius * i) / levels
      ctx.beginPath()
      ctx.arc(centerX, centerY, levelRadius, 0, 2 * Math.PI)
      ctx.stroke()
    }

    // Desenhar as linhas dos eixos
    const numSkills = skills.length
    const angleStep = (2 * Math.PI) / numSkills

    ctx.strokeStyle = "#d1d5db"
    ctx.lineWidth = 1

    for (let i = 0; i < numSkills; i++) {
      const angle = i * angleStep - Math.PI / 2
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle))
      ctx.stroke()

      // Adicionar rótulos
      const labelX = centerX + (radius + 20) * Math.cos(angle)
      const labelY = centerY + (radius + 20) * Math.sin(angle)
      ctx.fillStyle = "#4b5563"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(skills[i].name, labelX, labelY)
    }

    // Desenhar o polígono de dados
    ctx.beginPath()
    for (let i = 0; i < numSkills; i++) {
      const angle = i * angleStep - Math.PI / 2
      const value = skills[i].score / skills[i].maxScore
      const pointRadius = radius * value
      const x = centerX + pointRadius * Math.cos(angle)
      const y = centerY + pointRadius * Math.sin(angle)

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.closePath()
    ctx.fillStyle = "rgba(59, 130, 246, 0.2)"
    ctx.fill()
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 2
    ctx.stroke()

    // Desenhar os pontos
    for (let i = 0; i < numSkills; i++) {
      const angle = i * angleStep - Math.PI / 2
      const value = skills[i].score / skills[i].maxScore
      const pointRadius = radius * value
      const x = centerX + pointRadius * Math.cos(angle)
      const y = centerY + pointRadius * Math.sin(angle)

      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fillStyle = "#3b82f6"
      ctx.fill()
    }
  }, [skills])

  return (
    <Card className="rounded-2xl shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">Radar de Competências</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center p-4">
        <canvas ref={canvasRef} width={300} height={300} className="max-w-full" />
      </CardContent>
    </Card>
  )
}
