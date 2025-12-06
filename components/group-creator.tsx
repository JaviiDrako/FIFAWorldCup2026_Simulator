"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TEAMS_BY_SEEDING, GROUPS } from "@/lib/teams-data"

interface GroupCreatorProps {
  onGroupsCreated: (groups: any) => void
}

export default function GroupCreator({ onGroupsCreated }: GroupCreatorProps) {
  const [groups, setGroups] = useState<Record<string, string[]>>({})
  const [availableTeams, setAvailableTeams] = useState<Record<string, string[]> | null>(null)

  useEffect(() => {
    const initialGroups: Record<string, string[]> = {}
    GROUPS.forEach((g) => (initialGroups[g] = []))
    setGroups(initialGroups)

    const initialTeams: Record<string, string[]> = {
      seed1: [...TEAMS_BY_SEEDING.seed1],
      seed2: [...TEAMS_BY_SEEDING.seed2],
      seed3: [...TEAMS_BY_SEEDING.seed3],
      seed4: [...TEAMS_BY_SEEDING.seed4],
    }
    setAvailableTeams(initialTeams)
  }, [])

  const handleAddTeamToGroup = (groupName: string, seeding: string, teamIndex: number) => {
    if (!availableTeams) return

    const team = availableTeams[seeding]?.[teamIndex]
    if (!team) return

    setGroups((prev) => ({
      ...prev,
      [groupName]: [...prev[groupName], team],
    }))

    setAvailableTeams((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        [seeding]: prev[seeding].filter((_, i) => i !== teamIndex),
      }
    })
  }

  const handleRemoveTeamFromGroup = (groupName: string, teamIndex: number) => {
    const team = groups[groupName][teamIndex]
    if (!team) return

    let seeding = "seed1"
    if (TEAMS_BY_SEEDING.seed2.includes(team)) seeding = "seed2"
    else if (TEAMS_BY_SEEDING.seed3.includes(team)) seeding = "seed3"
    else if (TEAMS_BY_SEEDING.seed4.includes(team)) seeding = "seed4"

    setGroups((prev) => ({
      ...prev,
      [groupName]: prev[groupName].filter((_, i) => i !== teamIndex),
    }))

    setAvailableTeams((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        [seeding]: [...prev[seeding], team].sort(),
      }
    })
  }

  const canCreate = GROUPS.every((g) => groups[g]?.length === 4)

  const handleCreateGroups = () => {
    if (canCreate) {
      onGroupsCreated(groups)
    }
  }

  const handleAutoFill = () => {
    const newGroups: Record<string, string[]> = {}
    const seed1 = [...TEAMS_BY_SEEDING.seed1]
    const seed2 = [...TEAMS_BY_SEEDING.seed2]
    const seed3 = [...TEAMS_BY_SEEDING.seed3]
    const seed4 = [...TEAMS_BY_SEEDING.seed4]

    GROUPS.forEach((group, idx) => {
      newGroups[group] = [
        seed1[idx % seed1.length],
        seed2[idx % seed2.length],
        seed3[idx % seed3.length],
        seed4[idx % seed4.length],
      ]
    })

    setGroups(newGroups)
    setAvailableTeams({
      seed1: [],
      seed2: [],
      seed3: [],
      seed4: [],
    })
  }

  if (!availableTeams) {
    return <div className="text-center py-8">Cargando...</div>
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Crea los Grupos</h2>
        <p className="text-gray-600">Forma los 12 grupos del mundial utilizando los bombos disponibles</p>
      </div>

      <div className="flex gap-4 justify-center mb-8">
        <Button onClick={handleAutoFill} variant="outline" size="lg">
          Auto Llenar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {GROUPS.map((group) => (
          <Card key={group} className="border-2 border-gray-200">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-xl">Grupo {group}</CardTitle>
              <p className="text-sm text-gray-600">{groups[group]?.length || 0}/4 equipos</p>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2 mb-4">
                {groups[group]?.map((team, idx) => (
                  <div
                    key={`${group}-${idx}`}
                    className="flex justify-between items-center bg-gray-50 p-2 rounded hover:bg-gray-100"
                  >
                    <span className="font-medium">{team}</span>
                    <button
                      onClick={() => handleRemoveTeamFromGroup(group, idx)}
                      className="text-red-500 hover:text-red-700 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {(groups[group]?.length || 0) < 4 && (
                <div className="space-y-2">
                  {["seed1", "seed2", "seed3", "seed4"].map((seeding) => (
                    <div key={seeding}>
                      {availableTeams[seeding] && availableTeams[seeding].length > 0 && (
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              const idx = Number.parseInt(e.target.value)
                              handleAddTeamToGroup(group, seeding, idx)
                              e.target.value = ""
                            }
                          }}
                          className="w-full p-2 border border-gray-300 rounded text-sm"
                        >
                          <option value="">
                            Bombo{" "}
                            {seeding === "seed1" ? "1" : seeding === "seed2" ? "2" : seeding === "seed3" ? "3" : "4"}...
                          </option>
                          {availableTeams[seeding].map((team, idx) => (
                            <option key={idx} value={idx}>
                              {team}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center pt-8">
        <Button onClick={handleCreateGroups} disabled={!canCreate} size="lg" className="px-12">
          {canCreate ? "Continuar a Selección de Ganadores" : "Completa los 12 grupos"}
        </Button>
      </div>
    </div>
  )
}
