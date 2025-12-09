"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import GroupsModal from "@/components/groups-modal"
import { 
  calculateBestThirdPlaces, 
  assignThirdPlacesToMatches, 
  THIRD_PLACE_POOLS 
} from "@/lib/tournament-structure"
import { getFlagUrl, getDynamicCountryCode } from "@/lib/teams-data"
import { Shield, Target } from "lucide-react"

interface KnockoutBracketProps {
  winners: Record<string, [string, string]>
  matches?: Record<string, any[]>
  groups?: Record<string, string[]>
  standings?: Record<string, any[]>
  playoffSelections?: Record<string, string>
}

const ROUND_16_MATCHUPS = [
  { id: 73, pos1: "A-2", pos2: "B-2", stadium: "Los Angeles Stadium", date: "28 Jun" },
  { id: 75, pos1: "F-1", pos2: "C-2", stadium: "Estadio Monterrey", date: "29 Jun" },
  { id: 74, pos1: "E-1", pos2: "ThirdA", stadium: "Boston Stadium", date: "29 Jun" },
  { id: 77, pos1: "I-1", pos2: "ThirdCDFGH", stadium: "New York New Jersey Stadium", date: "30 Jun" },
  { id: 83, pos1: "K-2", pos2: "L-2", stadium: "Toronto Stadium", date: "2 Jul" },
  { id: 84, pos1: "H-1", pos2: "J-2", stadium: "Los Angeles Stadium", date: "2 Jul" },
  { id: 81, pos1: "D-1", pos2: "ThirdBEFIJ", stadium: "San Francisco Bay Area Stadium", date: "1 Jul" },
  { id: 82, pos1: "G-1", pos2: "ThirdAEHIJ", stadium: "Seattle Stadium", date: "1 Jul" },
  { id: 76, pos1: "C-1", pos2: "F-2", stadium: "Houston Stadium", date: "30 Jun" },
  { id: 78, pos1: "E-2", pos2: "I-2", stadium: "Dallas Stadium", date: "30 Jun" },
  { id: 79, pos1: "A-1", pos2: "ThirdCEFHI", stadium: "Estadio Ciudad de México", date: "30 Jun" },
  { id: 80, pos1: "L-1", pos2: "ThirdEHIJK", stadium: "Atlanta Stadium", date: "1 Jul" },
  { id: 86, pos1: "J-1", pos2: "H-2", stadium: "Miami Stadium", date: "3 Jul" },
  { id: 88, pos1: "D-2", pos2: "G-2", stadium: "Dallas Stadium", date: "3 Jul" },
  { id: 85, pos1: "B-1", pos2: "ThirdEFGIJ", stadium: "BC Place Vancouver", date: "2 Jul" },
  { id: 87, pos1: "K-1", pos2: "ThirdDEIJL", stadium: "Kansas City Stadium", date: "3 Jul" },
]

const ROUND_8_MATCHUPS = [
  { id: 90, depends: [73, 75], stadium: "Houston Stadium", date: "4 Jul" },
  { id: 89, depends: [74, 77], stadium: "Philadelphia Stadium", date: "4 Jul" },
  { id: 93, depends: [83, 84], stadium: "Dallas Stadium", date: "6 Jul" },
  { id: 94, depends: [81, 82], stadium: "Seattle Stadium", date: "6 Jul" },
  { id: 91, depends: [76, 78], stadium: "New York New Jersey Stadium", date: "5 Jul" },
  { id: 92, depends: [79, 80], stadium: "Estadio Azteca Ciudad de México", date: "5 Jul" },
  { id: 95, depends: [86, 88], stadium: "Atlanta Stadium", date: "7 Jul" },
  { id: 96, depends: [85, 87], stadium: "BC Place Vancouver", date: "7 Jul" },
]

const ROUND_4_MATCHUPS = [
  { id: 97, depends: [90, 89], stadium: "Boston Stadium", date: "9 Jul" },
  { id: 98, depends: [93, 94], stadium: "Los Angeles Stadium", date: "10 Jul" },
  { id: 99, depends: [91, 92], stadium: "Miami Stadium", date: "11 Jul" },
  { id: 100, depends: [95, 96], stadium: "Kansas City Stadium", date: "11 Jul" },
]

const SEMIFINAL_MATCHUPS = [
  { id: 101, depends: [97, 98], stadium: "Dallas Stadium", date: "14 Jul" },
  { id: 102, depends: [99, 100], stadium: "Atlanta Stadium", date: "15 Jul" },
]

const FINAL_MATCHUP = { id: 104, depends: [101, 102], stadium: "Nueva York Nueva Jersey Stadium", date: "19 Jul" }

const ESPACIOS = {
  COLUMNA_16VOS: {
    espacioInicio: "pt-10",
    espacioEntrePartidos: "space-y-3",
  },
  COLUMNA_8VOS: {
    espacioInicio: "pt-36.5",
    espacioEntrePartidos: "space-y-56.5",
  },
  COLUMNA_4TOS: {
    espacioInicio: "pt-90",
    espacioEntrePartidos: "space-y-163",
  },
  COLUMNA_SEMIS: {
    espacioInicio: "pt-198",
    espacioEntrePartidos: "space-y-375",
  },
  COLUMNA_FINAL: {
    espacioInicio: "pt-406",
    espacioEntrePartidos: "space-y-3",
  },
}

export default function KnockoutBracket({ 
  winners, 
  matches = {}, 
  groups = {}, 
  standings = {},
  playoffSelections = {} 
}: KnockoutBracketProps) {
  const [results, setResults] = useState<Record<number, { goals1: number | null; goals2: number | null }>>({})
  const [matchPositions, setMatchPositions] = useState<
    Record<number, { top: number; height: number; centerY: number }>
  >({})
  const [mode, setMode] = useState<'complete' | 'quick'>('complete') 
  const [quickWinners, setQuickWinners] = useState<Record<number, 1 | 2>>({}) 
  const matchRefs = useRef<Record<number, HTMLDivElement | null>>({})
  const columnRefs = useRef<Record<string, HTMLDivElement | null>>({})
  
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
  
  const thirdPlaceAssignments = useMemo(() => {
    if (standings && Object.keys(standings).length > 0) {
      
      const bestThirds = calculateBestThirdPlaces(standings)
      
      const assignments = assignThirdPlacesToMatches(bestThirds, winners)
      
      console.log("Mejores terceros calculados:", bestThirds)
      console.log("Asignaciones a partidos:", assignments)
      
      return assignments
    }
    return null
  }, [standings, winners])

  useEffect(() => {
    const positions: Record<number, { top: number; height: number; centerY: number }> = {}

    Object.keys(matchRefs.current).forEach((key) => {
      const matchId = Number(key)
      const element = matchRefs.current[matchId]
      if (element) {
        const rect = element.getBoundingClientRect()
        const parentRect = element.closest(".bracket-container")?.getBoundingClientRect()
        if (parentRect) {
          const top = rect.top - parentRect.top
          const height = rect.height
          positions[matchId] = {
            top,
            height,
            centerY: top + height / 2,
          }
        }
      }
    })

    setMatchPositions(positions)
  }, [results])

  const getTeamFlagCode = (teamName: string): string => {
    if (!teamName || teamName === "?" || teamName === "Por definir (3er lugar)") {
      return "XX"
    }
    return getDynamicCountryCode(teamName, playoffSelections)
  }

  const getTeamForPosition = (position: string, matchId?: number): string | undefined => {
    if (position.startsWith("Third")) {
      if (thirdPlaceAssignments && matchId !== undefined) {
        const assignedTeam = thirdPlaceAssignments[matchId]
        if (assignedTeam) {
          return assignedTeam
        }
      }
      return "Por definir (3er lugar)"
    }
    
    const [groupLetter, placement] = position.split("-")
    const posKey = (Number.parseInt(placement) === 1 ? 0 : 1) as 0 | 1
    return winners[groupLetter]?.[posKey]
  }

  const getMatchWinner = (matchId: number): string | undefined => {
    if (mode === 'quick' && quickWinners[matchId]) {
      const matchData = getMatchTeams(matchId)
      if (!matchData.team1 || !matchData.team2) return undefined
      return quickWinners[matchId] === 1 ? matchData.team1 : matchData.team2
    }
    
    const result = results[matchId]
    if (!result || result.goals1 === null || result.goals2 === null) return undefined

    const matchData = getMatchTeams(matchId)
    if (!matchData.team1 || !matchData.team2) return undefined

    // Tie managment
    if (result.goals1 === result.goals2) {
      return undefined // Pending: 0 penalties can be implemented
    }

    return result.goals1 > result.goals2 ? matchData.team1 : matchData.team2
  }

  const getMatchTeams = (matchId: number): { team1?: string; team2?: string } => {
    const round16Match = ROUND_16_MATCHUPS.find((m) => m.id === matchId)
    if (round16Match) {
      return {
        team1: getTeamForPosition(round16Match.pos1, matchId),
        team2: getTeamForPosition(round16Match.pos2, matchId),
      }
    }

    const allLaterMatches = [...ROUND_8_MATCHUPS, ...ROUND_4_MATCHUPS, ...SEMIFINAL_MATCHUPS, FINAL_MATCHUP]
    const laterMatch = allLaterMatches.find((m) => m.id === matchId)
    if (laterMatch) {
      return {
        team1: getMatchWinner(laterMatch.depends[0]),
        team2: getMatchWinner(laterMatch.depends[1]),
      }
    }

    return {}
  }

  const handleGoalsChange = (matchId: number, team: 1 | 2, value: string) => {
    const goals = value === "" ? null : Math.max(0, Number.parseInt(value) || 0)
    setResults((prev) => ({
      ...prev,
      [matchId]: {
        goals1: team === 1 ? goals : (prev[matchId]?.goals1 ?? null),
        goals2: team === 2 ? goals : (prev[matchId]?.goals2 ?? null),
      },
    }))
  }

  const handleQuickWinnerSelect = (matchId: number, team: 1 | 2) => {
    if (mode !== 'quick') return
    
    const matchTeams = getMatchTeams(matchId)
    const hasTeam1 = matchTeams.team1 && matchTeams.team1 !== "Por definir (3er lugar)" && matchTeams.team1 !== "Por definir"
    const hasTeam2 = matchTeams.team2 && matchTeams.team2 !== "Por definir (3er lugar)" && matchTeams.team2 !== "Por definir"
    
    if (!hasTeam1 || !hasTeam2) return
    
    setQuickWinners(prev => ({
      ...prev,
      [matchId]: team
    }))
  }

  const BracketMatch = ({
    matchId,
    stadium,
    date,
    showLeftLine = false,
    showRightLine = false,
    setRef = false,
  }: {
    matchId: number
    stadium: string
    date: string
    showLeftLine?: boolean
    showRightLine?: boolean
    setRef?: boolean
  }) => {
    const matchTeams = getMatchTeams(matchId)
    const result = results[matchId] || { goals1: null, goals2: null }
    const quickWinner = quickWinners[matchId]
    
    const flagCode1 = getTeamFlagCode(matchTeams.team1 || "")
    const flagCode2 = getTeamFlagCode(matchTeams.team2 || "")
    
    const hasTeam1 = matchTeams.team1 && matchTeams.team1 !== "Por definir (3er lugar)" && matchTeams.team1 !== "Por definir"
    const hasTeam2 = matchTeams.team2 && matchTeams.team2 !== "Por definir (3er lugar)" && matchTeams.team2 !== "Por definir"
    const isDisabled = !hasTeam1 || !hasTeam2

    return (
      <div
        ref={
          setRef
            ? (el) => {
                if (el) matchRefs.current[matchId] = el
              }
            : undefined
        }
        className="relative flex items-center justify-center"
      >
        {showLeftLine && (
          <div className="absolute left-0 w-7 h-0.5 bg-gradient-to-r from-gray-400 to-transparent" style={{ left: "-28px" }}></div>
        )}

        <Card className={`
          border-2 transition-all duration-300 relative z-10 shadow-lg hover:shadow-2xl hover:scale-[1.02] w-58 min-h-[130px]
          ${isDisabled 
            ? "border-gray-300/50 bg-gradient-to-br from-gray-50/40 to-gray-100/40 backdrop-blur-sm opacity-80" 
            : mode === 'quick' && quickWinner 
              ? "border-2 border-blue-500 bg-gradient-to-br from-blue-50/30 to-white" 
              : "border-gradient bg-gradient-to-br from-white to-gray-50/80 hover:from-blue-50/30 hover:to-white backdrop-blur-sm"
          }
          border-gradient relative overflow-hidden
        `}>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
          
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          
          <CardContent className="p-0">
            <div className={`
              text-xs px-2.5 pt-1.5 pb-1 border-b relative overflow-hidden min-h-[46px] flex flex-col justify-center
              ${isDisabled 
                ? "text-gray-500/70 bg-gradient-to-r from-gray-100/60 to-gray-200/60" 
                : "text-gray-700 bg-gradient-to-r from-blue-50/80 via-gray-50 to-blue-50/80"
              }
            `}>
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.1)_1px,transparent_0)] bg-[length:10px_10px]"></div>
              </div>
              
              <div className="relative z-10">
                <p className="font-bold text-xs truncate leading-tight flex items-center gap-1">
                  <Target className="w-3 h-3 text-blue-600" />
                  {stadium}
                </p>
                <p className="text-xs leading-tight text-gray-600/80 font-medium mt-0.5">
                  <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-xs font-bold">
                    {date}
                  </span>
                </p>
              </div>
            </div>

            <div 
              onClick={() => mode === 'quick' && handleQuickWinnerSelect(matchId, 1)}
              className={`
                flex items-center justify-between gap-2 p-2.5 border-b transition-all duration-200 cursor-pointer min-h-[58px]
                ${isDisabled 
                  ? "bg-gradient-to-r from-gray-50/30 to-gray-100/30 cursor-not-allowed" 
                  : mode === 'quick' 
                    ? quickWinner === 1 
                      ? "bg-gradient-to-r from-blue-100/80 to-blue-200/60 border-l-4 border-blue-500" 
                      : "bg-gradient-to-r from-white via-blue-50/20 to-white hover:from-blue-50/40 hover:bg-blue-50/30" 
                    : "bg-gradient-to-r from-white via-blue-50/20 to-white hover:from-blue-50/40"
                }
              `}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="w-8 h-5 flex-shrink-0 relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-md opacity-20 group-hover:opacity-30 transition-opacity blur-sm"></div>
                  <div className="relative z-10">
                    {hasTeam1 ? (
                      <img
                        src={getFlagUrl(flagCode1, 'w40')}
                        alt={matchTeams.team1 || "Equipo 1"}
                        className="w-full h-full object-cover rounded border-2 border-white shadow-md group-hover:scale-105 transition-transform duration-200"
                        style={{ objectPosition: 'center' }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded border-2 border-white flex items-center justify-center"><Shield className="w-3 h-3 text-gray-500" /></div>'
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded border-2 border-white flex items-center justify-center shadow-md">
                        <Shield className="w-3 h-3 text-gray-500" />
                      </div>
                    )}
                  </div>
                </div>
                
                <span className={`
                  text-sm font-semibold flex-1 truncate
                  ${isDisabled 
                    ? "text-gray-500/70 italic" 
                    : mode === 'quick' && quickWinner === 1 
                      ? "text-blue-700 font-bold" 
                      : "text-gray-800 group-hover:text-blue-700 transition-colors"
                  }
                `}>
                  {hasTeam1 ? (
                    <span className={mode === 'quick' && quickWinner === 1 ? "bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent" : "bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent"}>
                      {matchTeams.team1}
                    </span>
                  ) : (
                    <span className="text-gray-500">Por definir</span>
                  )}
                </span>
              </div>
              
              <div className="relative w-11 h-8 flex items-center justify-center">
                {mode === 'complete' ? (
                  <input
                    type="number"
                    min="0"
                    value={result.goals1 ?? ""}
                    onChange={(e) => handleGoalsChange(matchId, 1, e.target.value)}
                    disabled={isDisabled}
                    className={`
                      w-full h-full border-2 rounded-lg text-center font-bold text-base transition-all duration-200
                      ${isDisabled 
                        ? "bg-gray-100/50 border-gray-300/50 text-gray-400/70 placeholder:text-gray-300 cursor-not-allowed" 
                        : "bg-white border-blue-200 text-gray-900 placeholder:text-gray-400 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none shadow-sm"
                      }
                    `}
                    placeholder="0"
                  />
                ) : (
                  quickWinner === 1 && (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg animate-pulse">
                      <span className="text-white font-bold text-base">✓</span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div 
              onClick={() => mode === 'quick' && handleQuickWinnerSelect(matchId, 2)}
              className={`
                flex items-center justify-between gap-2 p-2.5 transition-all duration-200 cursor-pointer min-h-[58px]
                ${isDisabled 
                  ? "bg-gradient-to-r from-gray-50/30 to-gray-100/30 cursor-not-allowed" 
                  : mode === 'quick' 
                    ? quickWinner === 2 
                      ? "bg-gradient-to-r from-green-100/80 to-emerald-200/60 border-l-4 border-green-500" 
                      : "bg-gradient-to-r from-white via-red-50/20 to-white hover:from-red-50/40 hover:bg-red-50/30" 
                    : "bg-gradient-to-r from-white via-red-50/20 to-white hover:from-red-50/40"
                }
              `}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="w-8 h-5 flex-shrink-0 relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-red-400 to-orange-400 rounded-md opacity-20 group-hover:opacity-30 transition-opacity blur-sm"></div>
                  <div className="relative z-10">
                    {hasTeam2 ? (
                      <img
                        src={getFlagUrl(flagCode2, 'w40')}
                        alt={matchTeams.team2 || "Equipo 2"}
                        className="w-full h-full object-cover rounded border-2 border-white shadow-md group-hover:scale-105 transition-transform duration-200"
                        style={{ objectPosition: 'center' }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded border-2 border-white flex items-center justify-center"><Shield className="w-3 h-3 text-gray-500" /></div>'
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded border-2 border-white flex items-center justify-center shadow-md">
                        <Shield className="w-3 h-3 text-gray-500" />
                      </div>
                    )}
                  </div>
                </div>
                
                <span className={`
                  text-sm font-semibold flex-1 truncate
                  ${isDisabled 
                    ? "text-gray-500/70 italic" 
                    : mode === 'quick' && quickWinner === 2 
                      ? "text-green-700 font-bold" 
                      : "text-gray-800 group-hover:text-red-700 transition-colors"
                  }
                `}>
                  {hasTeam2 ? (
                    <span className={mode === 'quick' && quickWinner === 2 ? "bg-gradient-to-r from-green-700 to-emerald-900 bg-clip-text text-transparent" : "bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent"}>
                      {matchTeams.team2}
                    </span>
                  ) : (
                    <span className="text-gray-500">Por definir</span>
                  )}
                </span>
              </div>
              
              <div className="relative w-11 h-8 flex items-center justify-center">
                {mode === 'complete' ? (
                  <input
                    type="number"
                    min="0"
                    value={result.goals2 ?? ""}
                    onChange={(e) => handleGoalsChange(matchId, 2, e.target.value)}
                    disabled={isDisabled}
                    className={`
                      w-full h-full border-2 rounded-lg text-center font-bold text-base transition-all duration-200
                      ${isDisabled 
                        ? "bg-gray-100/50 border-gray-300/50 text-gray-400/70 placeholder:text-gray-300 cursor-not-allowed" 
                        : "bg-white border-red-200 text-gray-900 placeholder:text-gray-400 hover:border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:outline-none shadow-sm"
                      }
                    `}
                    placeholder="0"
                  />
                ) : (
                  quickWinner === 2 && (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg animate-pulse">
                      <span className="text-white font-bold text-base">✓</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </CardContent>
          
          {mode === 'quick' && !isDisabled && (
            <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full animate-pulse shadow-lg"></div>
          )}
          
          {!isDisabled && ((mode === 'complete' && result.goals1 !== null && result.goals2 !== null) || (mode === 'quick' && quickWinner)) && (
            <div className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg"></div>
          )}
          
          {isDisabled && (
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] rounded-md pointer-events-none">
            </div>
          )}
        </Card>

        {showRightLine && (
          <div className="absolute right-0 w-7 h-0.5 bg-gradient-to-l from-gray-400 to-transparent" style={{ right: "-28px" }}></div>
        )}
      </div>
    )
  }

  const VerticalConnectors = () => {
    if (Object.keys(matchPositions).length === 0) return null

    return (
      <svg className="absolute inset-0 pointer-events-none" style={{ width: "100%", height: "100%" }}>
        {(() => {
          const lines = []
          for (let i = 0; i < ROUND_16_MATCHUPS.length; i += 2) {
            const match1 = ROUND_16_MATCHUPS[i]
            const match2 = ROUND_16_MATCHUPS[i + 1]

            if (match1 && match2) {
              const pos1 = matchPositions[match1.id]
              const pos2 = matchPositions[match2.id]

              if (pos1 && pos2) {
                const x = 291 
                const y1 = pos1.centerY
                const y2 = pos2.centerY

                lines.push(
                  <line 
                    key={`vert-16-${i}`} 
                    x1={x} 
                    y1={y1} 
                    x2={x} 
                    y2={y2} 
                    stroke="#888" 
                    strokeWidth="2" 
                    fill="none" 
                  />
                )
              }
            }
          }
          return lines
        })()}

        {(() => {
          const lines = []
          for (let i = 0; i < ROUND_8_MATCHUPS.length; i += 2) {
            const match1 = ROUND_8_MATCHUPS[i]
            const match2 = ROUND_8_MATCHUPS[i + 1]

            if (match1 && match2) {
              const pos1 = matchPositions[match1.id]
              const pos2 = matchPositions[match2.id]

              if (pos1 && pos2) {
                const x = 579
                const y1 = pos1.centerY
                const y2 = pos2.centerY

                lines.push(
                  <line 
                    key={`vert-8-${i}`} 
                    x1={x} 
                    y1={y1} 
                    x2={x} 
                    y2={y2} 
                    stroke="#888" 
                    strokeWidth="2" 
                    fill="none" 
                  />
                )
              }
            }
          }
          return lines
        })()}

        {(() => {
          const lines = []
          for (let i = 0; i < ROUND_4_MATCHUPS.length; i += 2) {
            const match1 = ROUND_4_MATCHUPS[i]
            const match2 = ROUND_4_MATCHUPS[i + 1]

            if (match1 && match2) {
              const pos1 = matchPositions[match1.id]
              const pos2 = matchPositions[match2.id]

              if (pos1 && pos2) {
                const x = 867
                const y1 = pos1.centerY
                const y2 = pos2.centerY

                lines.push(
                  <line 
                    key={`vert-4-${i}`} 
                    x1={x} 
                    y1={y1} 
                    x2={x} 
                    y2={y2} 
                    stroke="#888" 
                    strokeWidth="2" 
                    fill="none" 
                  />
                )
              }
            }
          }
          return lines
        })()}

        {(() => {
          const lines = []
          if (SEMIFINAL_MATCHUPS.length >= 2) {
            const match1 = SEMIFINAL_MATCHUPS[0]
            const match2 = SEMIFINAL_MATCHUPS[1]

            if (match1 && match2) {
              const pos1 = matchPositions[match1.id]
              const pos2 = matchPositions[match2.id]

              if (pos1 && pos2) {
                const x = 1155 
                const y1 = pos1.centerY
                const y2 = pos2.centerY

                lines.push(
                  <line 
                    key="vert-semis" 
                    x1={x} 
                    y1={y1} 
                    x2={x} 
                    y2={y2} 
                    stroke="#888" 
                    strokeWidth="2" 
                    fill="none" 
                  />
                )
              }
            }
          }
          return lines
        })()}
        
      </svg>
    )
  }
  return (
    <div className="space-y-5 pb-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-purple-50/10 to-pink-50/20 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.1),transparent_50%)] pointer-events-none"></div>
      
      {Object.keys(standings).length > 0 && (
        <div className="fixed bottom-3 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in duration-300">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-40 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative">
              <GroupsModal 
                matches={matches} 
                groups={groups} 
                standings={standings}
                variant="floating"
              />
            </div>
          </div>
        </div>
      )}
      
      <div className="text-center mb-5 relative z-10">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="relative">
            <h1 className="text-6xl font-black mb-1.5 tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              ELIMINATORIAS
            </h1>
            <p className="text-gray-600/80 font-medium text-base mt-1.5"> 
              Edita los resultados y sigue el camino hacia la gloria
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 mt-2">
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
                    ? '✍️ Edita cada resultado con precisión' 
                    : '⚡ Avanza rápidamente por el bracket'}
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

        </div>
      </div>

      <div className="overflow-x-auto pb-4 relative z-10">
        <div id="bracket-content" className="relative bracket-container" style={{ minWidth: "1620px", minHeight: "1020px" }}> 
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-white/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-2xl"></div>
          
          <div className="inline-flex gap-14 min-w-full px-8"> 
            <div
              ref={(el) => {
                if (el) columnRefs.current["16vos"] = el
              }}
              className={`flex flex-col min-w-max ${ESPACIOS.COLUMNA_16VOS.espacioInicio} relative`}
            >
              <div className="sticky top-0 z-20 mb-3"> 
                <div className="relative group">
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div> 
                  <h3 className="relative text-base font-extrabold text-center bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent py-1.5 px-3 rounded-lg border border-blue-300/30 bg-white/90 backdrop-blur-sm shadow-lg"> 
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="text-lg">⚔️</span> 
                      <span className="text-sm">DIECISEISAVOS</span> 
                      <span className="text-lg">⚔️</span>
                    </div>
                    <div className="text-xs font-semibold text-blue-600 mt-0.5">16 partidos • 32 equipos</div>
                  </h3>
                </div>
              </div>
              <div className={ESPACIOS.COLUMNA_16VOS.espacioEntrePartidos}>
                {ROUND_16_MATCHUPS.map((match) => (
                  <BracketMatch
                    key={match.id}
                    matchId={match.id}
                    stadium={match.stadium}
                    date={match.date}
                    showRightLine={true}
                    setRef={true}
                  />
                ))}
              </div>
            </div>

            <div
              ref={(el) => {
                if (el) columnRefs.current["8vos"] = el
              }}
              className={`flex flex-col min-w-max ${ESPACIOS.COLUMNA_8VOS.espacioInicio} relative`}
            >
              <div className="sticky top-0 z-20 mb-3">
                <div className="relative group">
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                  <h3 className="relative text-base font-extrabold text-center bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent py-1.5 px-3 rounded-lg border border-purple-300/30 bg-white/90 backdrop-blur-sm shadow-lg">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="text-lg">🥊</span>
                      <span className="text-sm">OCTAVOS DE FINAL</span>
                      <span className="text-lg">🥊</span>
                    </div>
                    <div className="text-xs font-semibold text-purple-600 mt-0.5">8 partidos • 16 equipos</div>
                  </h3>
                </div>
              </div>
              <div className={ESPACIOS.COLUMNA_8VOS.espacioEntrePartidos}>
                {ROUND_8_MATCHUPS.map((match) => (
                  <BracketMatch
                    key={match.id}
                    matchId={match.id}
                    stadium={match.stadium}
                    date={match.date}
                    showLeftLine={true}
                    showRightLine={true}
                    setRef={true}
                  />
                ))}
              </div>
            </div>

            <div
              ref={(el) => {
                if (el) columnRefs.current["4tos"] = el
              }}
              className={`flex flex-col min-w-max ${ESPACIOS.COLUMNA_4TOS.espacioInicio} relative`}
            >
              <div className="sticky top-0 z-20 mb-3">
                <div className="relative group">
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-green-500 to-green-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                  <h3 className="relative text-base font-extrabold text-center bg-gradient-to-r from-green-700 to-green-900 bg-clip-text text-transparent py-1.5 px-3 rounded-lg border border-green-300/30 bg-white/90 backdrop-blur-sm shadow-lg">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="text-lg">🎯</span>
                      <span className="text-sm">CUARTOS DE FINAL</span>
                      <span className="text-lg">🎯</span>
                    </div>
                    <div className="text-xs font-semibold text-green-600 mt-0.5">4 partidos • 8 equipos</div>
                  </h3>
                </div>
              </div>
              <div className={ESPACIOS.COLUMNA_4TOS.espacioEntrePartidos}>
                {ROUND_4_MATCHUPS.map((match) => (
                  <BracketMatch
                    key={match.id}
                    matchId={match.id}
                    stadium={match.stadium}
                    date={match.date}
                    showLeftLine={true}
                    showRightLine={true}
                    setRef={true}
                  />
                ))}
              </div>
            </div>

            <div
              ref={(el) => {
                if (el) columnRefs.current["semis"] = el
              }}
              className={`flex flex-col min-w-max ${ESPACIOS.COLUMNA_SEMIS.espacioInicio} relative`}
            >
              <div className="sticky top-0 z-20 mb-3">
                <div className="relative group">
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                  <h3 className="relative text-base font-extrabold text-center bg-gradient-to-r from-orange-700 to-red-900 bg-clip-text text-transparent py-1.5 px-3 rounded-lg border border-orange-300/30 bg-white/90 backdrop-blur-sm shadow-lg">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="text-lg">🔥</span>
                      <span className="text-sm">SEMIFINALES</span>
                      <span className="text-lg">🔥</span>
                    </div>
                    <div className="text-xs font-semibold text-orange-600 mt-0.5">2 partidos • 4 equipos</div>
                  </h3>
                </div>
              </div>
              <div className={ESPACIOS.COLUMNA_SEMIS.espacioEntrePartidos}>
                {SEMIFINAL_MATCHUPS.map((match) => (
                  <BracketMatch
                    key={match.id}
                    matchId={match.id}
                    stadium={match.stadium}
                    date={match.date}
                    showLeftLine={true}
                    showRightLine={true}
                    setRef={true}
                  />
                ))}
              </div>
            </div>

            <div
              ref={(el) => {
                if (el) columnRefs.current["final"] = el
              }}
              className={`flex flex-col min-w-max ${ESPACIOS.COLUMNA_FINAL.espacioInicio} relative pr-2`}             
              >
              <div className="sticky top-0 z-20 mb-3">
                <div className="relative group">
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                  <h3 className="relative text-lg font-black text-center bg-gradient-to-r from-yellow-600 to-amber-800 bg-clip-text text-transparent py-2.5 px-5 rounded-xl border-2 border-yellow-400/40 bg-white/95 backdrop-blur-sm shadow-2xl"> 
                    <div className="flex items-center justify-center gap-2.5">
                      <span className="text-lg">🏆</span>
                      <span className="text-base">GRAN FINAL</span> 
                      <span className="text-lg">🏆</span>
                    </div>
                    <div className="text-xs font-bold text-yellow-600 mt-1.5">1 partido • 1 campeón</div> 
                  </h3>
                </div>
              </div>
              <div className={ESPACIOS.COLUMNA_FINAL.espacioEntrePartidos}>
                <BracketMatch
                  matchId={FINAL_MATCHUP.id}
                  stadium={FINAL_MATCHUP.stadium}
                  date={FINAL_MATCHUP.date}
                  showLeftLine={true}
                  setRef={true}
                />
                
                {(mode === 'complete' ? 
                  (results[FINAL_MATCHUP.id]?.goals1 !== null && 
                   results[FINAL_MATCHUP.id]?.goals2 !== null && 
                   getMatchWinner(FINAL_MATCHUP.id)) 
                  : 
                  (quickWinners[FINAL_MATCHUP.id] !== undefined && 
                   getMatchWinner(FINAL_MATCHUP.id))
                ) && (
                  <div className="relative group mt-5 animate-fade-in">
                    <div className="absolute -inset-3 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 animate-pulse"></div>
                    <Card className="relative bg-gradient-to-br from-yellow-500 via-yellow-600 to-amber-700 text-white border-0 w-58 shadow-2xl overflow-hidden">
                      <CardContent className="pt-5 pb-5 text-center relative z-10">
                        <div className="absolute inset-0 overflow-hidden">
                          {[...Array(15)].map((_, i) => (
                            <div
                              key={i}
                              className="absolute w-1.5 h-1.5 bg-yellow-300 rounded-full animate-confetti"
                              style={{
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${i * 0.2}s`,
                                animationDuration: `${1 + Math.random() * 2}s`,
                              }}
                            />
                          ))}
                        </div>
                        
                        <h3 className="text-2xl font-black mb-3 text-yellow-100 drop-shadow-lg">¡CAMPEÓN!</h3>
                        <p className="text-xl font-bold mt-3 bg-gradient-to-r from-yellow-200 via-white to-yellow-200 bg-clip-text text-transparent py-1.5 px-3 rounded-full border-2 border-yellow-300/50 bg-yellow-500/20 backdrop-blur-sm">
                          {getMatchWinner(FINAL_MATCHUP.id)}
                        </p>
                        <div className="mt-3 text-yellow-200/80 text-xs font-semibold">
                          ¡Consagra su nombre en la historia!
                        </div>
                        
                        <div className="mt-4 flex justify-center">
                          <div className="relative">
                            <div className="absolute -inset-4 bg-yellow-400 rounded-full blur-lg opacity-30"></div>
                            <div className="text-4xl">🏆</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

              </div>
            </div>
          </div>

          <VerticalConnectors />
          
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-30"></div>
        </div>
      </div>
    </div>
  )
}
