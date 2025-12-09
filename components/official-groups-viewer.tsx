"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Flag, Users, CheckCircle, Calendar, Shield, ChevronDown, Globe, AlertCircle } from "lucide-react"
import { OFFICIAL_GROUPS_2026_SIMPLE } from "@/lib/official-groups-data"
import { getFlagUrl, getCountryCode, PLAYOFF_OPTIONS, getPlayoffOptions, getDynamicCountryCode } from "@/lib/teams-data"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface OfficialGroupsViewerProps {
  onContinue: (groups: Record<string, string[]>, selections: Record<string, string>) => void
}

interface PlayoffSelection {
  [key: string]: string
}

export default function OfficialGroupsViewer({ onContinue }: OfficialGroupsViewerProps) {
  const [playoffSelections, setPlayoffSelections] = useState<PlayoffSelection>({})
  const [isModified, setIsModified] = useState(false)

  useEffect(() => {
    const initialSelections: PlayoffSelection = {}
    
    Object.values(OFFICIAL_GROUPS_2026_SIMPLE).forEach(teams => {
      teams.forEach(team => {
        if (team.isPlayoff) {
          let playoffGroup = ""
          if (team.name === "Ganador UEFA A") playoffGroup = "UEFA_A"
          else if (team.name === "Ganador UEFA B") playoffGroup = "UEFA_B"
          else if (team.name === "Ganador UEFA C") playoffGroup = "UEFA_C"
          else if (team.name === "Ganador UEFA D") playoffGroup = "UEFA_D"
          else if (team.name === "Ganador FIFA 1") playoffGroup = "FIFA_1"
          else if (team.name === "Ganador FIFA 2") playoffGroup = "FIFA_2"
          
          if (playoffGroup) {
            const options = PLAYOFF_OPTIONS[playoffGroup as keyof typeof PLAYOFF_OPTIONS]
            const placeholder = options?.find(opt => opt.isPlaceholder)
            if (placeholder) {
              initialSelections[playoffGroup] = placeholder.name
            }
          }
        }
      })
    })
    
    setPlayoffSelections(initialSelections)
  }, [])

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


  const handlePlayoffSelect = (playoffGroup: string, teamName: string) => {
    setPlayoffSelections(prev => ({
      ...prev,
      [playoffGroup]: teamName
    }))
    setIsModified(true)
  }

  const handleContinue = () => {
    const finalGroups: Record<string, string[]> = {}
    
    Object.entries(OFFICIAL_GROUPS_2026_SIMPLE).forEach(([groupName, teams]) => {
      finalGroups[groupName] = teams.map(team => {
        if (team.isPlayoff) {
          let playoffGroup = ""
          if (team.name === "Ganador UEFA A") playoffGroup = "UEFA_A"
          else if (team.name === "Ganador UEFA B") playoffGroup = "UEFA_B"
          else if (team.name === "Ganador UEFA C") playoffGroup = "UEFA_C"
          else if (team.name === "Ganador UEFA D") playoffGroup = "UEFA_D"
          else if (team.name === "Ganador FIFA 1") playoffGroup = "FIFA_1"
          else if (team.name === "Ganador FIFA 2") playoffGroup = "FIFA_2"
          
          return playoffSelections[playoffGroup] || team.name
        }
        return team.name
      })
    })
    
    onContinue(finalGroups, playoffSelections)
  }

  const getDisplayTeam = (team: any) => {
    if (team.isPlayoff) {
      let playoffGroup = ""
      if (team.name === "Ganador UEFA A") playoffGroup = "UEFA_A"
      else if (team.name === "Ganador UEFA B") playoffGroup = "UEFA_B"
      else if (team.name === "Ganador UEFA C") playoffGroup = "UEFA_C"
      else if (team.name === "Ganador UEFA D") playoffGroup = "UEFA_D"
      else if (team.name === "Ganador FIFA 1") playoffGroup = "FIFA_1"
      else if (team.name === "Ganador FIFA 2") playoffGroup = "FIFA_2"
      
      const selected = playoffSelections[playoffGroup]
      if (selected) {
        const options = PLAYOFF_OPTIONS[playoffGroup as keyof typeof PLAYOFF_OPTIONS]
        const selectedOption = options?.find(opt => opt.name === selected)
        return {
          name: selected,
          confederation: selectedOption?.confederation || team.confederation,
          isPlayoff: true,
          playoffGroup,
          isPlaceholder: selectedOption?.isPlaceholder,
          code: selectedOption?.code
        }
      }
    }
    return { 
      ...team, 
      isPlayoff: false, 
      code: getCountryCode(team.name) 
    }
  }

  const getTeamFlagCode = (team: any) => {
    const displayTeam = getDisplayTeam(team)
    if (displayTeam.code) {
      return displayTeam.code
    }
    
    return getDynamicCountryCode(displayTeam.name, playoffSelections)
  }

  const getPlayoffDescription = (playoffGroup: string): string => {
    switch(playoffGroup) {
      case "UEFA_A": return "Play-off A europeo (Bosnia y Herzegovina, Italia, Irlanda del Norte o Gales)"
      case "UEFA_B": return "Play-off B europeo (Albania, Polonia, Suecia o Ucrania)"
      case "UEFA_C": return "Play-off C europeo (Kosovo, Rumanía, Eslovaquia o Turquía)"
      case "UEFA_D": return "Play-off D europeo (Chequia, Dinamarca, Macedonia del Norte o República de Irlanda)"
      case "FIFA_1": return "Play-off 1 intercontinental (RD Congo, Jamaica o Nueva Caledonia)"
      case "FIFA_2": return "Play-off 2 intercontinental (Bolivia, Irak o Surinam)"
      default: return ""
    }
  }

  const getSpecificSelectionsCount = () => {
    return Object.entries(playoffSelections).filter(([group, selection]) => {
      const options = PLAYOFF_OPTIONS[group as keyof typeof PLAYOFF_OPTIONS]
      const selectedOption = options?.find(opt => opt.name === selection)
      return !selectedOption?.isPlaceholder
    }).length
  }

  const specificCount = getSpecificSelectionsCount()

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-4">
          <Trophy className="h-12 w-12 text-yellow-500" />
          <h1 className="text-4xl font-bold text-gray-800">Grupos Oficiales 2026</h1>
          <CheckCircle className="h-12 w-12 text-green-500" />
        </div>
        <p className="text-gray-600 text-lg">
          Grupos reales del sorteo del <span className="font-semibold text-blue-600">5 de diciembre de 2025</span>
        </p>
        <div className="flex justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <Flag className="h-4 w-4 text-green-500" />
            <span>48 Equipos</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" />
            <span>12 Grupos</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-red-500" />
            <span>Junio-Julio 2026</span>
          </div>
        </div>

        <div className="mt-6 max-w-3xl mx-auto">
          <Alert className="bg-blue-50 border-blue-200">
            <Globe className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold text-blue-800">¡Personaliza los playoffs!</p>
                <p className="text-sm text-blue-700">
                  Haz clic en los equipos marcados con <span className="font-medium">⏳ Playoff</span> para elegir:
                </p>
                <ul className="text-sm text-blue-700 list-disc pl-5 space-y-1">
                  <li>Mantener el <span className="font-medium">placeholder oficial</span> (ej: "Ganador UEFA A")</li>
                  <li>O seleccionar un <span className="font-medium">país específico</span> que podría clasificar</li>
                </ul>
                <div className="flex items-center gap-4 mt-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-300"></div>
                    <span className="text-blue-700">Placeholder oficial</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-100 border border-purple-300"></div>
                    <span className="text-purple-700">País seleccionado</span>
                  </div>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="inline-flex items-center gap-6 bg-gray-50 px-6 py-3 rounded-full border">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">6</div>
            <div className="text-xs text-gray-600">Playoffs</div>
          </div>
          <div className="h-8 w-px bg-gray-300"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{specificCount}</div>
            <div className="text-xs text-gray-600">Personalizados</div>
          </div>
          <div className="h-8 w-px bg-gray-300"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{6 - specificCount}</div>
            <div className="text-xs text-gray-600">Oficiales</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Object.entries(OFFICIAL_GROUPS_2026_SIMPLE).map(([groupName, teams]) => (
          <Card key={groupName} className="border-2 border-gray-200 hover:border-blue-300 transition-colors shadow-lg hover:shadow-xl">
            <CardHeader className={`${groupName <= 'F' ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-b-4 border-blue-500' : 'bg-gradient-to-r from-red-50 to-red-100 border-b-4 border-red-500'}`}>
              <CardTitle className="text-xl flex justify-between items-center">
                <span className="font-bold">Grupo {groupName}</span>
                <span className={`text-xs font-semibold px-2 py-1 rounded ${groupName <= 'F' ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'}`}>
                  {groupName <= 'F' ? 'Bracket Sup' : 'Bracket Inf'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {teams.map((team, idx) => {
                  const displayTeam = getDisplayTeam(team)
                  const isPlayoff = team.isPlayoff
                  const isPlaceholder = displayTeam.isPlaceholder
                  const flagCode = getTeamFlagCode(team) 
                  const options = isPlayoff ? getPlayoffOptions(displayTeam.playoffGroup || "") : null
                  
                  return (
                    <div
                      key={`${groupName}-${team.name}`}
                      className={`p-3 rounded-lg transition-all ${
                        team.isHost 
                          ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-300 shadow-sm' 
                          : isPlayoff
                            ? isPlaceholder
                              ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-300 shadow-sm hover:border-blue-400'
                              : 'bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-300 shadow-sm hover:border-purple-400'
                            : 'bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-300 shadow-sm'
                      } ${isPlayoff ? 'cursor-pointer' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="flex flex-col items-center">
                            <span className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold ${
                              team.isHost 
                                ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' 
                                : isPlayoff
                                  ? isPlaceholder
                                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                    : 'bg-purple-100 text-purple-800 border border-purple-300'
                                  : idx < 2
                                    ? 'bg-green-100 text-green-800 border border-green-300'
                                    : 'bg-gray-100 text-gray-800 border border-gray-300'
                            }`}>
                              {idx + 1}
                            </span>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-800 truncate flex items-center gap-2">
                              {displayTeam.name}
                              {isPlayoff && (
                                <span className={isPlaceholder ? "text-blue-600" : "text-purple-600"}>
                                  ⏳
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                              <span className={`px-2 py-0.5 rounded ${
                                displayTeam.confederation === 'UEFA' ? 'bg-blue-100 text-blue-800' : 
                                displayTeam.confederation === 'CONMEBOL' ? 'bg-green-100 text-green-800' :
                                displayTeam.confederation === 'CONCACAF' ? 'bg-yellow-100 text-yellow-800' :
                                displayTeam.confederation === 'AFC' ? 'bg-red-100 text-red-800' :
                                displayTeam.confederation === 'CAF' ? 'bg-purple-100 text-purple-800' :
                                displayTeam.confederation === 'OFC' ? 'bg-pink-100 text-pink-800' :
                                displayTeam.confederation === 'INTER' ? 'bg-cyan-100 text-cyan-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {displayTeam.confederation}
                              </span>
                              {team.isHost && (
                                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full flex items-center gap-1 text-xs">
                                  🏠 Anfitrión
                                </span>
                              )}
                              {isPlayoff && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <span className={`px-2 py-0.5 rounded-full flex items-center gap-1 text-xs cursor-pointer transition-colors ${
                                      isPlaceholder
                                        ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                        : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                                    }`}>
                                      {isPlaceholder ? 'Oficial' : 'Personalizado'}
                                      <ChevronDown className="h-3 w-3" />
                                    </span>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="start" className="w-72 max-h-80 overflow-y-auto">
                                    <div className="px-3 py-2 text-xs font-semibold text-gray-700 border-b bg-gray-50">
                                      {getPlayoffDescription(displayTeam.playoffGroup || "")}
                                    </div>
                                    {options?.map((option) => (
                                      <DropdownMenuItem
                                        key={option.name}
                                        onClick={() => handlePlayoffSelect(displayTeam.playoffGroup!, option.name)}
                                        className="flex items-center gap-2 cursor-pointer py-2 px-3 hover:bg-gray-50"
                                      >
                                        <div className="w-5 h-3.5 flex-shrink-0">
                                          <img
                                            src={getFlagUrl(option.code, 'w20')}
                                            alt={option.name}
                                            className="w-full h-full object-cover rounded border"
                                            onError={(e) => {
                                              e.currentTarget.style.display = 'none'
                                              e.currentTarget.parentElement!.innerHTML = `
                                                <div class="w-full h-full bg-gray-200 rounded border flex items-center justify-center">
                                                  <Shield className="w-3 h-3 text-gray-400" />
                                                </div>
                                              `
                                            }}
                                          />
                                        </div>
                                        <span className={`flex-1 ${option.isPlaceholder ? 'italic' : 'font-medium'} ${
                                          playoffSelections[displayTeam.playoffGroup!] === option.name 
                                            ? option.isPlaceholder ? 'text-blue-700 font-bold' : 'text-purple-700 font-bold'
                                            : ''
                                        }`}>
                                          {option.name}
                                        </span>
                                        {playoffSelections[displayTeam.playoffGroup!] === option.name && (
                                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                        )}
                                      </DropdownMenuItem>
                                    ))}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="ml-3 flex-shrink-0">
                          <div className="w-12 h-8 bg-gray-100 rounded border border-gray-300 overflow-hidden shadow-sm">
                            <img
                              src={getFlagUrl(flagCode, 'w80')}
                              alt={`Bandera de ${displayTeam.name}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                                e.currentTarget.parentElement!.innerHTML = `
                                  <div class="w-full h-full flex items-center justify-center bg-gray-200">
                                    <Shield className="w-6 h-6 text-gray-400" />
                                  </div>
                                `
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center pt-8">
        <Button 
          onClick={handleContinue}
          size="lg" 
          className="px-12 py-6 text-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all"
        >
          <Trophy className="mr-2 h-5 w-5" />
          {isModified ? "Simular con selecciones personalizadas" : "Simular con grupos oficiales"}
        </Button>
      </div>

      <div className="text-center text-sm text-gray-600 pt-4 border-t">
        <div className="inline-flex flex-wrap items-center gap-6 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-100 border border-yellow-300"></div>
            <span>País Anfitrión</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-300"></div>
            <span>Playoff (placeholder oficial)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-100 border border-purple-300"></div>
            <span>Playoff (país seleccionado)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-100 border border-green-300"></div>
            <span>Cabezas de serie</span>
          </div>
        </div>
      </div>
    </div>
  )
}
