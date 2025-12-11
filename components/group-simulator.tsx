"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GROUPS, getFlagUrl, getDynamicCountryCode, getDynamicAbbreviation } from "@/lib/teams-data"
import { Shield, Check, Target, Award } from "lucide-react"
import { calculateBestThirdPlaces } from "@/lib/tournament-structure"
import ThirdPlacesSelectionModal from "./third-places-modal"

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
    bestThirdPlaces?: string[]
  ) => void
  playoffSelections?: Record<string, string>
}

const GROUP_COLORS: Record<string, { 
  bgGradient: string, 
  borderColor: string,
  lightBg: string,
  borderLight: string,
  textColor: string
}> = {
  A: { 
    bgGradient: "from-blue-600 via-blue-700 to-blue-800", 
    borderColor: "border-blue-500",
    lightBg: "blue-50",
    borderLight: "border-blue-200",
    textColor: "text-blue-700"
  },
  B: { 
    bgGradient: "from-red-600 via-red-700 to-red-800", 
    borderColor: "border-red-500",
    lightBg: "red-50",
    borderLight: "border-red-200",
    textColor: "text-red-700"
  },
  C: { 
    bgGradient: "from-green-600 via-green-700 to-green-800", 
    borderColor: "border-green-500",
    lightBg: "green-50",
    borderLight: "border-green-200",
    textColor: "text-green-700"
  },
  D: { 
    bgGradient: "from-yellow-600 via-yellow-700 to-yellow-800", 
    borderColor: "border-yellow-500",
    lightBg: "yellow-50",
    borderLight: "border-yellow-200",
    textColor: "text-yellow-700"
  },
  E: { 
    bgGradient: "from-purple-600 via-purple-700 to-purple-800", 
    borderColor: "border-purple-500",
    lightBg: "purple-50",
    borderLight: "border-purple-200",
    textColor: "text-purple-700"
  },
  F: { 
    bgGradient: "from-pink-600 via-pink-700 to-pink-800", 
    borderColor: "border-pink-500",
    lightBg: "pink-50",
    borderLight: "border-pink-200",
    textColor: "text-pink-700"
  },
  G: { 
    bgGradient: "from-indigo-600 via-indigo-700 to-indigo-800", 
    borderColor: "border-indigo-500",
    lightBg: "indigo-50",
    borderLight: "border-indigo-200",
    textColor: "text-indigo-700"
  },
  H: { 
    bgGradient: "from-teal-600 via-teal-700 to-teal-800", 
    borderColor: "border-teal-500",
    lightBg: "teal-50",
    borderLight: "border-teal-200",
    textColor: "text-teal-700"
  },
  I: { 
    bgGradient: "from-orange-600 via-orange-700 to-orange-800", 
    borderColor: "border-orange-500",
    lightBg: "orange-50",
    borderLight: "border-orange-200",
    textColor: "text-orange-700"
  },
  J: { 
    bgGradient: "from-cyan-600 via-cyan-700 to-cyan-800", 
    borderColor: "border-cyan-500",
    lightBg: "cyan-50",
    borderLight: "border-cyan-200",
    textColor: "text-cyan-700"
  },
  K: { 
    bgGradient: "from-lime-600 via-lime-700 to-lime-800", 
    borderColor: "border-lime-500",
    lightBg: "lime-50",
    borderLight: "border-lime-200",
    textColor: "text-lime-700"
  },
  L: { 
    bgGradient: "from-violet-600 via-violet-700 to-violet-800", 
    borderColor: "border-violet-500",
    lightBg: "violet-50",
    borderLight: "border-violet-200",
    textColor: "text-violet-700"
  }
}

const getGroupColor = (groupName: string) => {
  return GROUP_COLORS[groupName] || GROUP_COLORS.A
}

export default function GroupSimulator({ 
  groups, 
  onWinnersSelected,
  playoffSelections = {}
}: GroupSimulatorProps) {
  const [mode, setMode] = useState<'complete' | 'quick'>('complete')
  
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

  const [quickWinners, setQuickWinners] = useState<Record<string, [string, string, string]>>({})
  
  const [selectedThirdPlaces, setSelectedThirdPlaces] = useState<string[]>([])
  const [showThirdPlacesModal, setShowThirdPlacesModal] = useState(false)

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

  const getTeamAbbreviation = (teamName: string): string => {
    return getDynamicAbbreviation(teamName, playoffSelections)
  }

  const handleQuickPositionSelect = (groupName: string, position: 1 | 2 | 3, team: string) => {
    setQuickWinners(prev => {
      const current = prev[groupName] || ['', '', '']
      const updated = [...current] as [string, string, string]
      
      if (updated.includes(team) && updated[position - 1] !== team) {
        const index = updated.indexOf(team)
        updated[index] = ''
      }
      
      updated[position - 1] = team
      
      return {
        ...prev,
        [groupName]: updated
      }
    })
  }

  const getQuickThirdPlaces = (): Array<{team: string, group: string}> => {
    const thirdPlaces: Array<{team: string, group: string}> = []
    
    Object.entries(quickWinners).forEach(([groupName, positions]) => {
      if (positions[2]) {
        thirdPlaces.push({
          team: positions[2],
          group: groupName
        })
      }
    })
    
    return thirdPlaces
  }

  const allGroupsQuickSelected = useMemo(() => {
    return Object.keys(groups).every(groupName => {
      const positions = quickWinners[groupName]
      return positions && positions[0] && positions[1] && positions[2]
    })
  }, [groups, quickWinners])

  const hasEightThirdPlacesSelected = selectedThirdPlaces.length === 8

  const standings = useMemo(() => {
    const result: Record<string, GroupStanding[]> = {}

    if (mode === 'complete') {
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
          if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference
          return b.goalsFor - a.goalsFor
        })

        result[groupName] = sortedTeams
      })
    } else {
      Object.entries(groups).forEach(([groupName, teams]) => {
        const positions = quickWinners[groupName] || ['', '', '']
        
        const groupStandings: GroupStanding[] = teams.map(team => ({
          team,
          played: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          points: 0,
          goalDifference: 0,
        }))
        
        const sortedStandings: GroupStanding[] = []
        
        if (positions[0]) {
          sortedStandings.push(groupStandings.find(s => s.team === positions[0])!)
        }
        
        if (positions[1]) {
          sortedStandings.push(groupStandings.find(s => s.team === positions[1])!)
        }
        
        if (positions[2]) {
          sortedStandings.push(groupStandings.find(s => s.team === positions[2])!)
        }
        
        const remainingTeams = teams.filter(team => 
          !positions.includes(team)
        )
        
        remainingTeams.forEach(team => {
          sortedStandings.push(groupStandings.find(s => s.team === team)!)
        })
        
        result[groupName] = sortedStandings
      })
    }

    return result
  }, [matches, groups, mode, quickWinners])

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
    if (mode === 'complete') {
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
    } else {
      const randomWinners: Record<string, [string, string, string]> = {}
      
      Object.entries(groups).forEach(([groupName, teams]) => {
        const shuffled = [...teams].sort(() => Math.random() - 0.5)
        randomWinners[groupName] = [shuffled[0], shuffled[1], shuffled[2]]
      })
      
      setQuickWinners(randomWinners)
      setSelectedThirdPlaces([])
    }
  }

  const handleClearAll = () => {
    if (mode === 'complete') {
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
    } else {
      setQuickWinners({})
      setSelectedThirdPlaces([])
    }
  }

  const allMatchesCompleted = mode === 'complete' 
    ? Object.values(matches).every((groupMatches) =>
        groupMatches.every((m) => m.goalsTeam1 !== null && m.goalsTeam2 !== null),
      )
    : allGroupsQuickSelected

  const handleContinue = () => {
    if (mode === 'complete') {
      const winners: Record<string, [string, string]> = {}
      
      Object.entries(standings).forEach(([groupName, groupStandings]) => {
        winners[groupName] = [groupStandings[0].team, groupStandings[1].team]
      })
      
      const bestThirds = calculateBestThirdPlaces(standings)
      const selectedThirds = bestThirds.slice(0, 8).map(t => t.team)
      
      onWinnersSelected(winners, matches, standings, selectedThirds)
    } else {
      if (!allGroupsQuickSelected) {
        return
      }
      
      if (!hasEightThirdPlacesSelected) {
        setShowThirdPlacesModal(true)
        return
      }
      
      proceedWithQuickSelection()
    }
  }

  const proceedWithQuickSelection = (thirdPlacesToUse?: string[]) => {
    const thirdPlaces = thirdPlacesToUse || selectedThirdPlaces
    console.log("Proceeding with third places:", thirdPlaces)
    
    const winners: Record<string, [string, string]> = {}
    
    Object.entries(quickWinners).forEach(([groupName, positions]) => {
      winners[groupName] = [positions[0], positions[1]]
    })
    
    const emptyMatches: Record<string, Match[]> = {}
    Object.entries(groups).forEach(([groupName, teams]) => {
      emptyMatches[groupName] = []
    })
    
    onWinnersSelected(winners, emptyMatches, standings, thirdPlaces)
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-6xl font-bold text-gray-800 mb-1.5 tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Fase de Grupos
        </h2>
        <p className="text-gray-600 mb-6">
          {mode === 'complete' 
            ? 'Ingresa los resultados de cada partido y el sistema calculará automáticamente los ganadores'
            : 'Selecciona directamente los clasificados de cada grupo sin necesidad de ingresar resultados'
          }
        </p>

        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="relative group">
            <div className="absolute -inset-2 overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-20"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.2),transparent_50%)]"></div>
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-blue-200/30 to-transparent opacity-30 animate-wave"></div>
            </div>
            
            <div className="relative flex bg-white/95 backdrop-blur-xl rounded-xl p-2 border-2 border-white/60 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent opacity-30"></div>
              
              <button
                onClick={() => setMode('complete')}
                className={`
                  relative px-6 py-3 rounded-xl font-bold text-sm transition-all duration-500 flex items-center gap-3 z-10
                  ${mode === 'complete' 
                    ? 'text-white shadow-2xl' 
                    : 'text-gray-800 hover:text-gray-900'
                  } water-ripple
                `}
              >
                <div className={`
                  absolute inset-0 rounded-xl transition-all duration-500
                  ${mode === 'complete' 
                    ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-100' 
                    : 'bg-gradient-to-r from-gray-100 to-gray-200 opacity-100'
                  }
                `}></div>
                
                <div className="relative z-20 flex items-center gap-3">
                  <div className={`
                    p-2 rounded-lg transition-all duration-300
                    ${mode === 'complete' 
                      ? 'bg-white/30 shadow-inner-lg' 
                      : 'bg-gray-300/50'
                    }
                  `}>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="18" 
                      height="18" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className={`
                        transition-all duration-300
                        ${mode === 'complete' 
                          ? 'text-white scale-110' 
                          : 'text-gray-700'
                        }
                      `}
                    >
                      <path d="M12 20h9"/>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                    </svg>
                  </div>
                  <span className="font-black tracking-wide">COMPLETO</span>
                </div>
              </button>
              
              <button
                onClick={() => setMode('quick')}
                className={`
                  relative px-6 py-3 rounded-xl font-bold text-sm transition-all duration-500 flex items-center gap-3 z-10
                  ${mode === 'quick' 
                    ? 'text-white shadow-2xl' 
                    : 'text-gray-800 hover:text-gray-900'
                  } water-ripple
                `}
              >
                <div className={`
                  absolute inset-0 rounded-xl transition-all duration-500
                  ${mode === 'quick' 
                    ? 'bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 opacity-100' 
                    : 'bg-gradient-to-r from-gray-100 to-gray-200 opacity-100'
                  }
                `}></div>
                
                <div className="relative z-20 flex items-center gap-3">
                  <div className={`
                    p-2 rounded-lg transition-all duration-300
                    ${mode === 'quick' 
                      ? 'bg-white/30 shadow-inner-lg' 
                      : 'bg-gray-300/50'
                    }
                  `}>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="18" 
                      height="18" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className={`
                        transition-all duration-300
                        ${mode === 'quick' 
                          ? 'text-white scale-110 rotate-12' 
                          : 'text-gray-700'
                        }
                      `}
                    >
                      <path d="m5 12 7-7 7 7"/>
                      <path d="M12 19V5"/>
                    </svg>
                  </div>
                  <span className="font-black tracking-wide">RÁPIDO</span>
                </div>
              </button>
            </div>
          </div>
          
          <div className={`
            text-sm font-extrabold px-5 py-2.5 rounded-full border-2 shadow-xl transition-all duration-500 animate-slide-in
            ${mode === 'complete' 
              ? 'bg-gradient-to-r from-blue-100/80 to-purple-100/80 text-blue-900 border-blue-300/40' 
              : 'bg-gradient-to-r from-orange-100/80 to-red-100/80 text-orange-900 border-orange-300/40'
            }
          `}>
            <div className="flex items-center gap-3">
              <div className={`
                w-8 h-1 rounded-full transition-all duration-500
                ${mode === 'complete' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                  : 'bg-gradient-to-r from-red-500 to-orange-500'
                }
              `}></div>
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {mode === 'complete' 
                  ? '✍️ Ingresa el resultado de cada partido' 
                  : '⚡ Selecciona directamente los clasificados'}
              </span>
              <div className={`
                w-8 h-1 rounded-full transition-all duration-500
                ${mode === 'complete' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                  : 'bg-gradient-to-r from-orange-500 to-yellow-500'
                }
              `}></div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 justify-center">
          <Button 
            onClick={handleRandomFill} 
            variant="outline" 
            className="bg-transparent border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            {mode === 'complete' ? 'Llenar con Resultados Aleatorios' : 'Seleccionar Aleatoriamente'}
          </Button>
          <Button 
            onClick={handleClearAll} 
            variant="outline" 
            className="bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Limpiar Todos
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {GROUPS.map((groupName) => {
          const groupColor = getGroupColor(groupName)
          const groupTeams = groups[groupName] || []
          const quickPositions = quickWinners[groupName] || ['', '', '']
          
          return (
            <Card key={groupName} className={`border-2 ${groupColor.borderColor} shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden`}>
              <CardHeader className={`bg-gradient-to-r ${groupColor.bgGradient} border-b-4 ${groupColor.borderColor} shadow-xl relative overflow-hidden`}>
                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,rgba(255,255,255,0.1)_5px,rgba(255,255,255,0.1)_10px)]"></div>
                <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 relative">
                  <span className="text-3xl font-['Montserrat'] font-extrabold tracking-wide uppercase text-white mt-2">
                    GRUPO {groupName}
                  </span>
                  <div className="flex gap-2 justify-center sm:justify-end">
                    {groupTeams.map((team) => {
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
                {mode === 'complete' ? (
                  <div className="space-y-3 mb-6">
                    <h4 className="font-bold text-sm text-gray-700 mb-2">Partidos</h4>
                    {matches[groupName]?.map((match, idx) => {
                      const flagCode1 = getTeamFlagCode(match.team1)
                      const flagCode2 = getTeamFlagCode(match.team2)
                      const abbreviation1 = getTeamAbbreviation(match.team1)
                      const abbreviation2 = getTeamAbbreviation(match.team2)
                      
                      return (
                        <div key={match.id} className="flex items-center gap-2 bg-gray-50/70 hover:bg-gray-100/80 p-3 rounded-lg border transition-all">
                          <div className="flex items-center gap-2 flex-1 justify-end">
                            <span className="text-sm font-bold text-gray-800">
                              {abbreviation1}
                            </span>
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
                            <span className="text-sm font-bold text-gray-800">
                              {abbreviation2}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="space-y-4 mb-6">
                    <h4 className="font-bold text-sm text-gray-700 mb-2">Selecciona los clasificados</h4>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 flex items-center justify-center">
                          <span className="text-xs font-bold text-white">1</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-700">Primer Lugar</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {groupTeams.map(team => {
                          const isSelected = quickPositions[0] === team
                          return (
                            <button
                              key={`${groupName}-1-${team}`}
                              onClick={() => handleQuickPositionSelect(groupName, 1, team)}
                              className={`
                                flex items-center gap-2 p-2 rounded-lg border transition-all text-sm
                                ${isSelected 
                                  ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-400 shadow-sm' 
                                  : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }
                              `}
                            >
                              <div className="w-6 h-4 flex-shrink-0">
                                <img
                                  src={getFlagUrl(getTeamFlagCode(team), 'w20')}
                                  alt={team}
                                  className="w-full h-full object-cover rounded border border-gray-300"
                                />
                              </div>
                              <span className="truncate">{getTeamAbbreviation(team)}</span>
                              {isSelected && <Check className="w-3 h-3 text-green-600 ml-auto" />}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 flex items-center justify-center">
                          <span className="text-xs font-bold text-white">2</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-700">Segundo Lugar</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {groupTeams.filter(team => team !== quickPositions[0]).map(team => {
                          const isSelected = quickPositions[1] === team
                          return (
                            <button
                              key={`${groupName}-2-${team}`}
                              onClick={() => handleQuickPositionSelect(groupName, 2, team)}
                              className={`
                                flex items-center gap-2 p-2 rounded-lg border transition-all text-sm
                                ${isSelected 
                                  ? 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-400 shadow-sm' 
                                  : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }
                              `}
                            >
                              <div className="w-6 h-4 flex-shrink-0">
                                <img
                                  src={getFlagUrl(getTeamFlagCode(team), 'w20')}
                                  alt={team}
                                  className="w-full h-full object-cover rounded border border-gray-300"
                                />
                              </div>
                              <span className="truncate">{getTeamAbbreviation(team)}</span>
                              {isSelected && <Check className="w-3 h-3 text-green-600 ml-auto" />}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center">
                          <span className="text-xs font-bold text-white">3</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-700">Tercer Lugar</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {groupTeams.filter(team => !quickPositions.slice(0, 2).includes(team)).map(team => {
                          const isSelected = quickPositions[2] === team
                          return (
                            <button
                              key={`${groupName}-3-${team}`}
                              onClick={() => handleQuickPositionSelect(groupName, 3, team)}
                              className={`
                                flex items-center gap-2 p-2 rounded-lg border transition-all text-sm
                                ${isSelected 
                                  ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-400 shadow-sm' 
                                  : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }
                              `}
                            >
                              <div className="w-6 h-4 flex-shrink-0">
                                <img
                                  src={getFlagUrl(getTeamFlagCode(team), 'w20')}
                                  alt={team}
                                  className="w-full h-full object-cover rounded border border-gray-300"
                                />
                              </div>
                              <span className="truncate">{getTeamAbbreviation(team)}</span>
                              {isSelected && <Check className="w-3 h-3 text-green-600 ml-auto" />}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <h4 className="font-bold mb-3 text-sm text-gray-700">Clasificación</h4>
                  <div className="space-y-2 text-sm">
                    {standings[groupName]?.map((team, idx) => {
                      const flagCode = getTeamFlagCode(team.team)
                      const abbreviation = getTeamAbbreviation(team.team)
                      
                      return (
                        <div 
                          key={team.team} 
                          className={`flex justify-between items-center py-2 px-3 rounded-lg transition-all ${
                            idx < 2 
                              ? `bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200` 
                              : idx === 2 
                                ? `bg-blue-50 border border-blue-200`
                                : `bg-gray-50 border border-gray-200`
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
                            <div className="flex flex-col">
                              <span
                                className={`flex-1 truncate ${
                                  idx < 2 ? "font-bold text-green-700" : 
                                  idx === 2 ? "font-semibold text-blue-700" : 
                                  "text-gray-600"
                                }`}
                              >
                                {team.team}
                              </span>
                              <span className="text-xs text-gray-500 font-mono">
                                {abbreviation}
                              </span>
                            </div>
                          </div>
                          {mode === 'complete' && (
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
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="flex justify-center pt-8">
        <Button 
          onClick={handleContinue} 
          disabled={!allMatchesCompleted} 
          size="lg" 
          className="px-12 py-6 text-lg bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {mode === 'complete' ? (
            allMatchesCompleted ? (
              <span className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Continuar a Dieciseisavos de Final
              </span>
            ) : (
              "Completa todos los partidos para continuar"
            )
          ) : (
            allMatchesCompleted ? (
              <span className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                {hasEightThirdPlacesSelected 
                  ? `Continuar (${selectedThirdPlaces.length}/8 terceros)`
                  : "Seleccionar mejores terceros →"
                }
              </span>
            ) : (
              "Selecciona los 3 primeros de cada grupo"
            )
          )}
        </Button>
      </div>

      {mode === 'quick' && (
        <ThirdPlacesSelectionModal
          open={showThirdPlacesModal}
          onOpenChange={setShowThirdPlacesModal}
          thirdPlaces={getQuickThirdPlaces()}
          selectedThirdPlaces={selectedThirdPlaces}
          onSelectThirdPlaces={setSelectedThirdPlaces}
          onConfirm={(selectedTeams) => {
            setSelectedThirdPlaces(selectedTeams)
            proceedWithQuickSelection(selectedTeams)
          }}
        />
      )}

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
          {mode === 'quick' && selectedThirdPlaces.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-100 border border-purple-300"></div>
              <span className="font-semibold text-purple-700">
                {selectedThirdPlaces.length}/8 terceros seleccionados
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
