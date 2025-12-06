"use client"

import { Button } from "@/components/ui/button"

interface NavigationProps {
  currentStage: "groups" | "winners" | "knockout"
  onReset: () => void
}

export default function Navigation({ currentStage, onReset }: NavigationProps) {
  const stages = ["groups", "winners", "knockout"]
  const stageNames = { groups: "Grupos", winners: "Ganadores", knockout: "Bracket" }

  return (
    <header className="bg-primary/10 border-b border-primary/20">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-primary">Copa del Mundo 2026</h1>
          <Button onClick={onReset} variant="outline" className="hover:bg-primary/10 bg-transparent">
            Reiniciar
          </Button>
        </div>

        <div className="flex gap-4">
          {stages.map((stage, idx) => (
            <div key={stage} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  stages.indexOf(currentStage) >= idx ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
                }`}
              >
                {idx + 1}
              </div>
              <span className="ml-2 font-medium text-gray-700">{stageNames[stage as keyof typeof stageNames]}</span>
              {idx < stages.length - 1 && <div className="w-12 h-1 mx-4 bg-gray-200" />}
            </div>
          ))}
        </div>
      </div>
    </header>
  )
}
