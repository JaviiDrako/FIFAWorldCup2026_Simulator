"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { GROUPS } from "@/lib/teams-data"
import { Eye, Trophy, Award, Sparkles } from "lucide-react"
import { calculateBestThirdPlaces } from "@/lib/tournament-structure"
import { getFlagUrl, getDynamicCountryCode } from "@/lib/teams-data"
import { Shield } from "lucide-react"

interface GroupsModalProps {
  matches: Record<string, any[]>
  groups: Record<string, string[]>
  standings: Record<string, any[]>
  playoffSelections?: Record<string, string>
}

export default function GroupsModal({ 
  matches, 
  groups, 
  standings,
  playoffSelections = {} 
}: GroupsModalProps) {
  const [open, setOpen] = useState(false)

  const getTeamFlagCode = (teamName: string): string => {
    if (!teamName) return "XX"
    return getDynamicCountryCode(teamName, playoffSelections)
  }

  const bestThirdPlaces = useMemo(() => {
    if (standings && Object.keys(standings).length > 0) {
      return calculateBestThirdPlaces(standings)
    }
    return []
  }, [standings])

  const hasTies = useMemo(() => {
    if (bestThirdPlaces.length < 2) return false
    
    for (let i = 0; i < bestThirdPlaces.length - 1; i++) {
      const current = bestThirdPlaces[i]
      const next = bestThirdPlaces[i + 1]
      
      if (current.points === next.points && 
          current.goalDifference === next.goalDifference && 
          current.goalsFor === next.goalsFor) {
        return true
      }
    }
    return false
  }, [bestThirdPlaces])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 bg-transparent"
          data-modal-trigger="groups-modal"
        >
          <Eye className="w-4 h-4" />
          Ver Grupos
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[1400px] h-[800px] overflow-y-auto" style={{ maxWidth: '95vw' }}>
        <div id="groups-content" className="p-4">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Clasificación Final de Fase de Grupos</DialogTitle>
          </DialogHeader>
        
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-600" />
              Tablas de Posiciones por Grupo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-2">
              {GROUPS.map((groupName) => (
                <Card key={groupName} className="border-2 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="bg-primary/10 pb-2">
                    <CardTitle className="text-base font-bold">Grupo {groupName}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-3">
                    <div className="space-y-1 text-sm">
                      {standings[groupName]?.map((team, idx) => {
                        const flagCode = getTeamFlagCode(team.team)
                        
                        return (
                          <div 
                            key={team.team} 
                            className={`flex justify-between items-center py-2 px-3 rounded ${
                              idx < 2 ? "bg-green-50 border border-green-100" : 
                              idx === 2 ? "bg-blue-50 border border-blue-100" : 
                              "bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className={`font-bold w-6 text-center ${
                                idx < 2 ? "text-green-700" : 
                                idx === 2 ? "text-blue-700" : 
                                "text-gray-600"
                              }`}>
                                {idx + 1}
                              </span>
                              
                              <div className="w-6 h-4 flex-shrink-0">
                                <img
                                  src={getFlagUrl(flagCode, 'w20')}
                                  alt={team.team}
                                  className="w-full h-full object-cover rounded border border-gray-300"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                    e.currentTarget.parentElement!.innerHTML = '<div class="w-6 h-4 bg-gray-200 rounded border border-gray-300 flex items-center justify-center"><Shield className="w-2 h-2 text-gray-400" /></div>'
                                  }}
                                />
                              </div>
                              
                              <span className={`font-medium ${
                                idx < 2 ? "text-green-800" : 
                                idx === 2 ? "text-blue-800" : 
                                "text-gray-700"
                              }`}>
                                {team.team}
                              </span>
                            </div>
                            <div className="flex gap-3 text-xs">
                              <span className={`font-bold ${
                                idx < 2 ? "text-green-700" : 
                                idx === 2 ? "text-blue-700" : 
                                "text-gray-600"
                              }`}>
                                {team.points} pts
                              </span>
                              <span className={`font-mono ${
                                idx < 2 ? "text-green-600" : 
                                idx === 2 ? "text-blue-600" : 
                                "text-gray-500"
                              }`}>
                                {team.goalDifference > 0 ? "+" : ""}
                                {team.goalDifference}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {bestThirdPlaces.length > 0 && (
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              Ranking de Mejores Terceros (Clasifican los 8 primeros)
            </h3>
            
            {hasTies && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <p className="text-sm text-amber-800">
                  <span className="font-semibold">Nota:</span> Existen empates que serán definidos por sorteo de FIFA según el reglamento oficial.
                </p>
              </div>
            )}
            
            <Card className="border-2 border-purple-200">
              <CardHeader className="bg-purple-50 pb-3">
                <CardTitle className="text-base font-bold text-purple-800">
                  Top 8 Terceros que avanzan a Dieciseisavos
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3 font-semibold text-gray-700">Pos.</th>
                        <th className="text-left py-2 px-3 font-semibold text-gray-700">Equipo</th>
                        <th className="text-left py-2 px-3 font-semibold text-gray-700">Bandera</th>
                        <th className="text-left py-2 px-3 font-semibold text-gray-700">Grupo</th>
                        <th className="text-left py-2 px-3 font-semibold text-gray-700">Puntos</th>
                        <th className="text-left py-2 px-3 font-semibold text-gray-700">Dif. Goles</th>
                        <th className="text-left py-2 px-3 font-semibold text-gray-700">Goles a Favor</th>
                        <th className="text-left py-2 px-3 font-semibold text-gray-700">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bestThirdPlaces.map((third, index) => {
                        const nextThird = bestThirdPlaces[index + 1]
                        const isTied = nextThird && 
                          third.points === nextThird.points && 
                          third.goalDifference === nextThird.goalDifference && 
                          third.goalsFor === nextThird.goalsFor
                        const flagCode = getTeamFlagCode(third.team)
                        
                        return (
                          <tr 
                            key={`${third.group}-${third.team}`} 
                            className={`border-b hover:bg-gray-50 ${
                              index < 8 ? "bg-green-50/30" : "bg-gray-50/30"
                            }`}
                          >
                            <td className="py-3 px-3 font-bold">
                              <div className="flex items-center gap-2">
                                <span className={index < 8 ? "text-green-700" : "text-gray-500"}>
                                  {index + 1}
                                </span>
                                {isTied && index < 8 && (
                                  <Sparkles className="w-3 h-3 text-amber-500" title="Empate que requiere sorteo" />
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-3 font-medium">
                              <span className={index < 8 ? "text-green-800" : "text-gray-600"}>
                                {third.team}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <div className="w-8 h-6 flex-shrink-0">
                                <img
                                  src={getFlagUrl(flagCode, 'w20')}
                                  alt={third.team}
                                  className="w-full h-full object-cover rounded border border-gray-300"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                    e.currentTarget.parentElement!.innerHTML = '<div class="w-8 h-6 bg-gray-200 rounded border border-gray-300 flex items-center justify-center"><Shield className="w-3 h-3 text-gray-400" /></div>'
                                  }}
                                />
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs font-semibold">
                                Grupo {third.group}
                              </span>
                            </td>
                            <td className="py-3 px-3 font-bold text-gray-800">{third.points}</td>
                            <td className="py-3 px-3">
                              <span className={`font-mono ${
                                third.goalDifference > 0 ? "text-green-600" : 
                                third.goalDifference < 0 ? "text-red-600" : 
                                "text-gray-600"
                              }`}>
                                {third.goalDifference > 0 ? "+" : ""}{third.goalDifference}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-gray-700">{third.goalsFor}</td>
                            <td className="py-3 px-3">
                              {index < 8 ? (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-bold">
                                  <Sparkles className="w-3 h-3" />
                                  CLASIFICA
                                </span>
                              ) : (
                                <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                  Eliminado
                                </span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 pt-4 border-t text-xs text-gray-600 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                    <span>Los 8 primeros se clasifican a Dieciseisavos de Final</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Empates se definen por sorteo de FIFA</span>
                  </div>
                  <div className="text-xs text-gray-500 italic mt-2">
                    Criterios de clasificación: 1) Puntos, 2) Diferencia de goles, 3) Goles a favor
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
