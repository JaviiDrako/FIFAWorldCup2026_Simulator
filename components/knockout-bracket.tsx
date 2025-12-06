"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import GroupsModal from "@/components/groups-modal"

interface KnockoutBracketProps {
  winners: Record<string, [string, string]>
  matches?: Record<string, any[]>
  groups?: Record<string, string[]>
  standings?: Record<string, any[]>
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
  { id: 76, pos1: "E-1", pos2: "F-2", stadium: "Houston Stadium", date: "30 Jun" },
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
    espacioInicio: "pt-0",
    espacioEntrePartidos: "space-y-4",
  },
  COLUMNA_8VOS: {
    espacioInicio: "pt-20",
    espacioEntrePartidos: "space-y-46",
  },
  COLUMNA_4TOS: {
    espacioInicio: "pt-62",
    espacioEntrePartidos: "space-y-130",
  },
  COLUMNA_SEMIS: {
    espacioInicio: "pt-148",
    espacioEntrePartidos: "space-y-298",
  },
  COLUMNA_FINAL: {
    espacioInicio: "pt-315",
    espacioEntrePartidos: "space-y-4",
  },
}

export default function KnockoutBracket({ winners, matches = {}, groups = {}, standings = {} }: KnockoutBracketProps) {
  const [results, setResults] = useState<Record<number, { goals1: number | null; goals2: number | null }>>({})
  const [matchPositions, setMatchPositions] = useState<
    Record<number, { top: number; height: number; centerY: number }>
  >({})
  const matchRefs = useRef<Record<number, HTMLDivElement | null>>({})
  const columnRefs = useRef<Record<string, HTMLDivElement | null>>({})

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

  const getTeamForPosition = (position: string): string | undefined => {
    if (position.startsWith("Third")) {
      return "Por definir (3er lugar)"
    }
    const [groupLetter, placement] = position.split("-")
    const posKey = (Number.parseInt(placement) === 1 ? 0 : 1) as 0 | 1
    return winners[groupLetter]?.[posKey]
  }

  const getMatchWinner = (matchId: number): string | undefined => {
    const result = results[matchId]
    if (!result || result.goals1 === null || result.goals2 === null) return undefined

    const matchData = getMatchTeams(matchId)
    if (!matchData.team1 || !matchData.team2) return undefined

    return result.goals1 > result.goals2 ? matchData.team1 : matchData.team2
  }

  const getMatchTeams = (matchId: number): { team1?: string; team2?: string } => {
    const round16Match = ROUND_16_MATCHUPS.find((m) => m.id === matchId)
    if (round16Match) {
      return {
        team1: getTeamForPosition(round16Match.pos1),
        team2: getTeamForPosition(round16Match.pos2),
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
        {showLeftLine && <div className="absolute left-0 w-8 h-0.5 bg-gray-400" style={{ left: "-32px" }}></div>}

        <Card className="border-2 hover:border-primary transition-colors bg-white w-56 relative z-10">
          <CardContent className="p-0">
            <div className="text-xs text-gray-500 px-1 pt-0 pb-0">
              <p className="font-semibold truncate text-xs leading-none">{stadium}</p>
              <p className="text-xs leading-none text-gray-400">{date}</p>
            </div>

            <div className="space-y-1 px-0 py-1">
              <div className="flex items-center gap-1 bg-gray-50 p-1 rounded h-8 mx-0">
                <span className="text-xs font-medium flex-1 text-right truncate">{matchTeams.team1 || "?"}</span>
                <input
                  type="number"
                  min="0"
                  value={result.goals1 ?? ""}
                  onChange={(e) => handleGoalsChange(matchId, 1, e.target.value)}
                  className="w-8 h-6 border rounded text-center text-xs font-bold"
                  placeholder="-"
                />
              </div>
              <div className="flex items-center gap-1 bg-gray-50 p-1 rounded h-8 mx-0">
                <input
                  type="number"
                  min="0"
                  value={result.goals2 ?? ""}
                  onChange={(e) => handleGoalsChange(matchId, 2, e.target.value)}
                  className="w-8 h-6 border rounded text-center text-xs font-bold"
                  placeholder="-"
                />
                <span className="text-xs font-medium flex-1 text-left truncate">{matchTeams.team2 || "?"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {showRightLine && <div className="absolute right-0 w-8 h-0.5 bg-gray-400" style={{ right: "-32px" }}></div>}
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
                const x = 287
                const y1 = pos1.centerY
                const y2 = pos2.centerY

                lines.push(
                  <line key={`vert-16-${i}`} x1={x} y1={y1} x2={x} y2={y2} stroke="#888" strokeWidth="2" fill="none" />,
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
                const x = 575
                const y1 = pos1.centerY
                const y2 = pos2.centerY

                lines.push(
                  <line key={`vert-8-${i}`} x1={x} y1={y1} x2={x} y2={y2} stroke="#888" strokeWidth="2" fill="none" />,
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
                const x = 863
                const y1 = pos1.centerY
                const y2 = pos2.centerY

                lines.push(
                  <line key={`vert-4-${i}`} x1={x} y1={y1} x2={x} y2={y2} stroke="#888" strokeWidth="2" fill="none" />,
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
                const x = 1151
                const y1 = pos1.centerY
                const y2 = pos2.centerY

                lines.push(
                  <line key="vert-semis" x1={x} y1={y1} x2={x} y2={y2} stroke="#888" strokeWidth="2" fill="none" />,
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
    <div className="space-y-8 pb-12">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-4">
          <div>
            <h2 className="text-4xl font-bold mb-2">Árbol de Knockout</h2>
            <p className="text-gray-600">Edita los resultados y ve avanzar los equipos</p>
          </div>
          {Object.keys(standings).length > 0 && <GroupsModal matches={matches} groups={groups} standings={standings} />}
        </div>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="relative bracket-container" style={{ minWidth: "1400px", minHeight: "1200px" }}>
          <div className="inline-flex gap-16 min-w-full px-8">
            <div
              ref={(el) => {
                if (el) columnRefs.current["16vos"] = el
              }}
              className={`flex flex-col min-w-max ${ESPACIOS.COLUMNA_16VOS.espacioInicio}`}
            >
              <h3 className="text-sm font-bold text-primary text-center mb-4 sticky top-0 bg-white z-20">16vos</h3>
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
              className={`flex flex-col min-w-max ${ESPACIOS.COLUMNA_8VOS.espacioInicio}`}
            >
              <h3 className="text-sm font-bold text-primary text-center mb-4 sticky top-0 bg-white z-20">8vos</h3>
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
              className={`flex flex-col min-w-max ${ESPACIOS.COLUMNA_4TOS.espacioInicio}`}
            >
              <h3 className="text-sm font-bold text-primary text-center mb-4 sticky top-0 bg-white z-20">4tos</h3>
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
              className={`flex flex-col min-w-max ${ESPACIOS.COLUMNA_SEMIS.espacioInicio}`}
            >
              <h3 className="text-sm font-bold text-primary text-center mb-4 sticky top-0 bg-white z-20">Semis</h3>
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
              className={`flex flex-col min-w-max ${ESPACIOS.COLUMNA_FINAL.espacioInicio}`}
            >
              <h3 className="text-sm font-bold text-primary text-center mb-4 sticky top-0 bg-white z-20">FINAL</h3>
              <div className={ESPACIOS.COLUMNA_FINAL.espacioEntrePartidos}>
                <BracketMatch
                  matchId={FINAL_MATCHUP.id}
                  stadium={FINAL_MATCHUP.stadium}
                  date={FINAL_MATCHUP.date}
                  showLeftLine={true}
                  setRef={true}
                />
                {results[FINAL_MATCHUP.id]?.goals1 !== null && results[FINAL_MATCHUP.id]?.goals2 !== null && (
                  <Card className="mt-4 bg-gradient-to-r from-primary to-primary/80 text-white border-0 w-56">
                    <CardContent className="pt-4 pb-4 text-center">
                      <h3 className="text-xl font-bold">CAMPEÓN</h3>
                      <p className="text-sm font-bold mt-2">{getMatchWinner(FINAL_MATCHUP.id)}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>

          <VerticalConnectors />
        </div>
      </div>
    </div>
  )
}

