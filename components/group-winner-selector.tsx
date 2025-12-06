"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface GroupWinnerSelectorProps {
  groups: Record<string, string[]>
  onWinnersSelected: (winners: any) => void
}

export default function GroupWinnerSelector({ groups, onWinnersSelected }: GroupWinnerSelectorProps) {
  const [winners, setWinners] = useState<Record<string, { first: string; second: string }>>({})

  const handleSelectWinner = (groupName: string, position: "first" | "second", team: string) => {
    setWinners((prev) => ({
      ...prev,
      [groupName]: {
        first: position === "first" ? team : prev[groupName]?.first || "",
        second: position === "second" ? team : prev[groupName]?.second || "",
      },
    }))
  }

  const canContinue =
    Object.keys(groups).length === 12 && Object.keys(groups).every((g) => winners[g]?.first && winners[g]?.second)

  const handleContinue = () => {
    if (canContinue) {
      onWinnersSelected(winners)
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Selecciona Ganadores</h2>
        <p className="text-gray-600">Elige el 1er y 2do lugar de cada grupo</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(groups).map(([groupName, teams]) => (
          <Card key={groupName} className="border-2 border-primary/20">
            <CardHeader className="bg-primary/10">
              <CardTitle className="text-xl">Grupo {groupName}</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">1er Lugar</label>
                <select
                  value={winners[groupName]?.first || ""}
                  onChange={(e) => handleSelectWinner(groupName, "first", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">Selecciona...</option>
                  {teams.map((team, idx) => (
                    <option key={idx} value={team}>
                      {team}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">2do Lugar</label>
                <select
                  value={winners[groupName]?.second || ""}
                  onChange={(e) => handleSelectWinner(groupName, "second", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">Selecciona...</option>
                  {teams.map((team, idx) => (
                    <option key={idx} value={team}>
                      {team}
                    </option>
                  ))}
                </select>
              </div>

              {winners[groupName]?.first && winners[groupName]?.second && (
                <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
                  <p className="text-sm font-medium text-green-800">1º: {winners[groupName].first}</p>
                  <p className="text-sm font-medium text-green-800">2º: {winners[groupName].second}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center pt-8">
        <Button onClick={handleContinue} disabled={!canContinue} size="lg" className="px-12">
          {canContinue ? "Ir al Bracket de Knockout" : "Completa todos los grupos"}
        </Button>
      </div>
    </div>
  )
}
