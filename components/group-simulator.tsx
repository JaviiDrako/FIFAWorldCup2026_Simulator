"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GROUPS } from "@/lib/teams-data"

interface Match {
  id: string
  team1: string
  team2: string
  goalsTeam1: number | null
  goalsTeam2: number | null
}

interface GroupStanding {
  team: string
  played: number
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  points: number
  goalDifference: number
}

interface GroupSimulatorProps {
  groups: Record<string, string[]>
  onWinnersSelected: (
    winners: Record<string, [string, string]>,
    matches: Record<string, Match[]>,
    standings: Record<string, GroupStanding[]>,
  ) => void
}

export default function GroupSimulator({ groups, onWinnersSelected }: GroupSimulatorProps) {
  const [matches, setMatches] = useState<Record<string, Match[]>>(() => {
    const initialMatches: Record<string, Match[]> = {}

    Object.entries(groups).forEach(([groupName, teams]) => {
      const groupMatches: Match[] = []
      let matchId = 0

      for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
          groupMatches.push({
            id: `${groupName}-${matchId}`,
            team1: teams[i],
            team2: teams[j],
            goalsTeam1: null,
            goalsTeam2: null,
          })
          matchId++
        }
      }

      initialMatches[groupName] = groupMatches
    })

    return initialMatches
  })

  const standings = useMemo(() => {
    const result: Record<string, GroupStanding[]> = {}

    Object.entries(matches).forEach(([groupName, groupMatches]) => {
      const teamStats: Record<string, GroupStanding> = {}

      groups[groupName].forEach((team) => {
        teamStats[team] = {
          team,
          played: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          points: 0,
          goalDifference: 0,
        }
      })

      groupMatches.forEach((match) => {
        if (match.goalsTeam1 !== null && match.goalsTeam2 !== null) {
          const g1 = match.goalsTeam1
          const g2 = match.goalsTeam2

          teamStats[match.team1].played++
          teamStats[match.team1].goalsFor += g1
          teamStats[match.team1].goalsAgainst += g2
          teamStats[match.team1].goalDifference = teamStats[match.team1].goalsFor - teamStats[match.team1].goalsAgainst

          teamStats[match.team2].played++
          teamStats[match.team2].goalsFor += g2
          teamStats[match.team2].goalsAgainst += g1
          teamStats[match.team2].goalDifference = teamStats[match.team2].goalsFor - teamStats[match.team2].goalsAgainst

          if (g1 > g2) {
            teamStats[match.team1].wins++
            teamStats[match.team1].points += 3
            teamStats[match.team2].losses++
          } else if (g2 > g1) {
            teamStats[match.team2].wins++
            teamStats[match.team2].points += 3
            teamStats[match.team1].losses++
          } else {
            teamStats[match.team1].draws++
            teamStats[match.team1].points += 1
            teamStats[match.team2].draws++
            teamStats[match.team2].points += 1
          }
        }
      })

      const sortedTeams = Object.values(teamStats).sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points

        const diffA = a.goalDifference
        const diffB = b.goalDifference
        if (diffB !== diffA) return diffB - diffA

        return b.goalsFor - a.goalsFor
      })

      result[groupName] = sortedTeams
    })

    return result
  }, [matches, groups])

  const handleGoalChange = (groupName: string, matchIndex: number, team: 1 | 2, value: string) => {
    const goals = value === "" ? null : Math.max(0, Number.parseInt(value) || 0)
    setMatches((prev) => {
      const groupMatches = [...prev[groupName]]
      const match = { ...groupMatches[matchIndex] }

      if (team === 1) {
        match.goalsTeam1 = goals
      } else {
        match.goalsTeam2 = goals
      }

      groupMatches[matchIndex] = match
      return {
        ...prev,
        [groupName]: groupMatches,
      }
    })
  }

  const handleRandomFill = () => {
    setMatches((prev) => {
      const updatedMatches = { ...prev }
      Object.keys(updatedMatches).forEach((groupName) => {
        updatedMatches[groupName] = updatedMatches[groupName].map((match) => ({
          ...match,
          goalsTeam1: Math.floor(Math.random() * 10),
          goalsTeam2: Math.floor(Math.random() * 10),
        }))
      })
      return updatedMatches
    })
  }

  const allMatchesCompleted = Object.values(matches).every((groupMatches) =>
    groupMatches.every((m) => m.goalsTeam1 !== null && m.goalsTeam2 !== null),
  )

  const handleContinue = () => {
    const winners: Record<string, [string, string]> = {}

    Object.entries(standings).forEach(([groupName, groupStandings]) => {
      winners[groupName] = [groupStandings[0].team, groupStandings[1].team]
    })

    onWinnersSelected(winners, matches, standings)
  } 

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Fase de Grupos</h2>
        <p className="text-gray-600">
          Ingresa los resultados de cada partido y el sistema calculará automáticamente los ganadores
        </p>
        <Button onClick={handleRandomFill} variant="outline" className="mt-4 bg-transparent">
          Llenar con Resultados Aleatorios (Testing)
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {GROUPS.map((groupName) => (
          <Card key={groupName} className="border-2">
            <CardHeader className="bg-primary/5">
              <CardTitle>Grupo {groupName}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4 mb-6">
                {matches[groupName]?.map((match, idx) => (
                  <div key={match.id} className="flex items-center gap-2 bg-gray-50 p-3 rounded">
                    <span className="text-sm font-medium flex-1 text-right">{match.team1}</span>
                    <input
                      type="number"
                      min="0"
                      value={match.goalsTeam1 ?? ""}
                      onChange={(e) => handleGoalChange(groupName, idx, 1, e.target.value)}
                      className="w-12 h-10 border rounded text-center font-bold"
                      placeholder="-"
                    />
                    <span className="text-sm font-bold text-gray-400">vs</span>
                    <input
                      type="number"
                      min="0"
                      value={match.goalsTeam2 ?? ""}
                      onChange={(e) => handleGoalChange(groupName, idx, 2, e.target.value)}
                      className="w-12 h-10 border rounded text-center font-bold"
                      placeholder="-"
                    />
                    <span className="text-sm font-medium flex-1">{match.team2}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <h4 className="font-bold mb-3 text-sm">Clasificación</h4>
                <div className="space-y-2 text-sm">
                  {standings[groupName]?.map((team, idx) => (
                    <div key={team.team} className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <span className="font-bold w-6">{idx + 1}.</span>
                        <span
                          className={`flex-1 ${
                            idx < 2 ? "font-bold text-green-600" : idx === 2 ? "text-blue-600" : "text-gray-500"
                          }`}
                        >
                          {team.team}
                        </span>
                      </div>
                      <div className="flex gap-4 text-xs">
                        <span className="font-bold">{team.points}pts</span>
                        <span className="text-gray-600">
                          {team.goalsFor}:{team.goalsAgainst}
                        </span>
                        <span className="font-semibold text-primary">
                          {team.goalDifference > 0 ? "+" : ""}
                          {team.goalDifference}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center pt-8">
        <Button onClick={handleContinue} disabled={!allMatchesCompleted} size="lg" className="px-12">
          {allMatchesCompleted ? "Continuar a Dieciseisavos de Final" : "Completa todos los partidos"}
        </Button>
      </div>
    </div>
  )
}

