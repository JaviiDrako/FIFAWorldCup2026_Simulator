"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GROUPS, getFlagUrl, getDynamicCountryCode } from "@/lib/teams-data"
import { Shield } from "lucide-react"

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
  playoffSelections?: Record<string, string>
}

export default function GroupSimulator({ 
  groups, 
  onWinnersSelected,
  playoffSelections = {}
}: GroupSimulatorProps) {
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

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    
    const bracketContainer = document.querySelector('.bracket-container')
    if (bracketContainer) {
      bracketContainer.scrollLeft = 0
    }
    
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }, 100)
  }, [])


  const getTeamFlagCode = (teamName: string): string => {
    return getDynamicCountryCode(teamName, playoffSelections)
  }

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
          goalsTeam1: Math.floor(Math.random() * 5),
          goalsTeam2: Math.floor(Math.random() * 5),
        }))
      })
      return updatedMatches
    })
  }

  const handleClearAll = () => {
    setMatches((prev) => {
      const clearedMatches = { ...prev }
      Object.keys(clearedMatches).forEach((groupName) => {
        clearedMatches[groupName] = clearedMatches[groupName].map((match) => ({
          ...match,
          goalsTeam1: null,
          goalsTeam2: null,
        }))
      })
      return clearedMatches
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
        <div className="mt-4 flex gap-2 justify-center">
          <Button onClick={handleRandomFill} variant="outline" className="bg-transparent border-blue-300 text-blue-700 hover:bg-blue-50">
            Llenar con Resultados Aleatorios
          </Button>
          <Button onClick={handleClearAll} variant="outline" className="bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50">
            Limpiar Todos
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {GROUPS.map((groupName) => (
          <Card key={groupName} className="border-2 border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 border-b-4 border-gray-500 shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,rgba(255,255,255,0.1)_5px,rgba(255,255,255,0.1)_10px)]"></div>
              <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 relative">
                <span className="text-3xl font-['Montserrat'] font-extrabold tracking-wide uppercase text-white mt-2">
                  GRUPO {groupName}
                </span>
                <div className="flex gap-2 justify-center sm:justify-end">
                  {groups[groupName]?.map((team) => {
                    const flagCode = getTeamFlagCode(team)
                    return (
                      <div key={team} className="relative group">
                        <img
                          src={getFlagUrl(flagCode, 'w40')}
                          alt={team}
                          className="w-10 h-7 rounded-md border-2 border-white shadow-lg hover:scale-110 transition-all duration-200"
                          title={team}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            const parent = e.currentTarget.parentElement
                            if (parent) {
                              parent.innerHTML = '<div class="w-10 h-7 bg-white/20 rounded-md border-2 border-white flex items-center justify-center backdrop-blur-sm"><Shield className="w-4 h-4 text-white" /></div>'
                            }
                          }}
                        />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                          {team}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3 mb-6">
                <h4 className="font-bold text-sm text-gray-700 mb-2">Partidos</h4>
                {matches[groupName]?.map((match, idx) => {
                  const flagCode1 = getTeamFlagCode(match.team1)
                  const flagCode2 = getTeamFlagCode(match.team2)
                  
                  return (
                    <div key={match.id} className="flex items-center gap-2 bg-gray-50/70 hover:bg-gray-100/80 p-3 rounded-lg border transition-all">
                      <div className="flex items-center gap-2 flex-1 justify-end">
                        <span className="text-sm font-medium text-right truncate">{match.team1}</span>
                        <div className="w-8 h-6 flex-shrink-0">
                          <img
                            src={getFlagUrl(flagCode1, 'w40')}
                            alt={match.team1}
                            className="w-full h-full object-cover rounded border border-gray-300"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                              e.currentTarget.parentElement!.innerHTML = '<div class="w-8 h-6 bg-gray-200 rounded border border-gray-300 flex items-center justify-center"><Shield className="w-4 h-4 text-gray-400" /></div>'
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          value={match.goalsTeam1 ?? ""}
                          onChange={(e) => handleGoalChange(groupName, idx, 1, e.target.value)}
                          className="w-12 h-10 border-2 rounded-lg text-center font-bold text-lg bg-white shadow-sm focus:border-blue-500 focus:outline-none"
                          placeholder="0"
                        />
                        <span className="text-sm font-bold text-gray-500">vs</span>
                        <input
                          type="number"
                          min="0"
                          value={match.goalsTeam2 ?? ""}
                          onChange={(e) => handleGoalChange(groupName, idx, 2, e.target.value)}
                          className="w-12 h-10 border-2 rounded-lg text-center font-bold text-lg bg-white shadow-sm focus:border-blue-500 focus:outline-none"
                          placeholder="0"
                        />
                      </div>

                      <div className="flex items-center gap-2 flex-1">
                        <div className="w-8 h-6 flex-shrink-0">
                          <img
                            src={getFlagUrl(flagCode2, 'w40')}
                            alt={match.team2}
                            className="w-full h-full object-cover rounded border border-gray-300"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                              e.currentTarget.parentElement!.innerHTML = '<div class="w-8 h-6 bg-gray-200 rounded border border-gray-300 flex items-center justify-center"><Shield className="w-4 h-4 text-gray-400" /></div>'
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium truncate">{match.team2}</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="border-t pt-4">
                <h4 className="font-bold mb-3 text-sm text-gray-700">Clasificación</h4>
                <div className="space-y-2 text-sm">
                  {standings[groupName]?.map((team, idx) => {
                    const flagCode = getTeamFlagCode(team.team)
                    
                    return (
                      <div 
                        key={team.team} 
                        className={`flex justify-between items-center py-2 px-3 rounded-lg transition-all ${
                          idx < 2 
                            ? "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200" 
                            : idx === 2 
                              ? "bg-blue-50 border border-blue-200"
                              : "bg-gray-50 border border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`font-bold w-6 text-center ${
                              idx < 2 ? "text-green-700" : idx === 2 ? "text-blue-700" : "text-gray-500"
                            }`}>
                              {idx + 1}.
                            </span>
                            <div className="w-8 h-6 flex-shrink-0">
                              <img
                                src={getFlagUrl(flagCode, 'w40')}
                                alt={team.team}
                                className="w-full h-full object-cover rounded border border-gray-300"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                  e.currentTarget.parentElement!.innerHTML = '<div class="w-8 h-6 bg-gray-200 rounded border border-gray-300 flex items-center justify-center"><Shield className="w-4 h-4 text-gray-400" /></div>'
                                }}
                              />
                            </div>
                          </div>
                          <span
                            className={`flex-1 truncate ${
                              idx < 2 ? "font-bold text-green-700" : 
                              idx === 2 ? "font-semibold text-blue-700" : 
                              "text-gray-600"
                            }`}
                          >
                            {team.team}
                          </span>
                        </div>
                        <div className="flex gap-4 text-xs font-medium">
                          <span className={`min-w-[40px] text-center ${
                            idx < 2 ? "text-green-700" : idx === 2 ? "text-blue-700" : "text-gray-600"
                          }`}>
                            {team.points}pts
                          </span>
                          <span className="text-gray-600 min-w-[50px] text-center">
                            {team.goalsFor}:{team.goalsAgainst}
                          </span>
                          <span className={`font-bold min-w-[40px] text-center ${
                            team.goalDifference > 0 ? "text-green-600" : 
                            team.goalDifference < 0 ? "text-red-600" : 
                            "text-gray-600"
                          }`}>
                            {team.goalDifference > 0 ? "+" : ""}
                            {team.goalDifference}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center pt-8">
        <Button 
          onClick={handleContinue} 
          disabled={!allMatchesCompleted} 
          size="lg" 
          className="px-12 py-6 text-lg bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {allMatchesCompleted ? (
            <span className="flex items-center gap-2">
              Continuar a Dieciseisavos de Final
            </span>
          ) : (
            "Completa todos los partidos para continuar"
          )}
        </Button>
      </div>

      <div className="text-center text-sm text-gray-600 pt-4 border-t">
        <div className="inline-flex flex-wrap items-center gap-6 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-100 border border-green-300"></div>
            <span>Clasificados (1° y 2° puesto)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-300"></div>
            <span>Tercer puesto</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-100 border border-gray-300"></div>
            <span>Eliminados</span>
          </div>
        </div>
      </div>
    </div>
  )
}
