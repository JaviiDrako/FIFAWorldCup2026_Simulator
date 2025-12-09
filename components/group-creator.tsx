"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon, Shield, X } from "lucide-react"
import { TEAMS_BY_SEEDING, GROUPS, Team, CONFEDERATIONS, getFlagUrl, getCountryCode } from "@/lib/teams-data"

interface GroupCreatorProps {
  onGroupsCreated: (groups: any) => void
}

export default function GroupCreator({ onGroupsCreated }: GroupCreatorProps) {
  const [groups, setGroups] = useState<Record<string, Team[]>>({})
  const [availableTeams, setAvailableTeams] = useState<Record<string, Team[]>>({})
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawLog, setDrawLog] = useState<string[]>([])
  const [drawStep, setDrawStep] = useState(0)

  useEffect(() => {
    initializeData()
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


  const initializeData = () => {
    const initialGroups: Record<string, Team[]> = {}
    GROUPS.forEach((g) => (initialGroups[g] = []))
    setGroups(initialGroups)
    setDrawLog([])
    setDrawStep(0)

    const initialTeams: Record<string, Team[]> = {
      seed1: [...TEAMS_BY_SEEDING.seed1],
      seed2: [...TEAMS_BY_SEEDING.seed2],
      seed3: [...TEAMS_BY_SEEDING.seed3],
      seed4: [...TEAMS_BY_SEEDING.seed4],
    }
    setAvailableTeams(initialTeams)
  }

  const canTeamGoToGroup = (team: Team, group: Team[]): boolean => {
    if (group.length >= 4) return false

    const confCounts: Record<string, number> = {}
    group.forEach(t => {
      confCounts[t.confederation] = (confCounts[t.confederation] || 0) + 1
    })

    if (team.confederation === CONFEDERATIONS.UEFA) {
      const uefaCount = confCounts[CONFEDERATIONS.UEFA] || 0
      if (uefaCount >= 2) return false
    } else {
      if (confCounts[team.confederation] >= 1) return false
    }

    if (team.isPlayoff && team.playoffGroup) {
      switch (team.playoffGroup) {
        case "FIFA_1":
          if (confCounts[CONFEDERATIONS.CAF] > 0) return false
          if (confCounts[CONFEDERATIONS.OFC] > 0) return false
          if (confCounts[CONFEDERATIONS.CONCACAF] > 0) return false
          break
        
        case "FIFA_2":
          if (confCounts[CONFEDERATIONS.AFC] > 0) return false
          if (confCounts[CONFEDERATIONS.CONMEBOL] > 0) return false
          if (confCounts[CONFEDERATIONS.CONCACAF] > 0) return false
          break
        
        default:
          break
      }
    }

    return true
  }

  const findValidGroup = (team: Team, currentGroups: Record<string, Team[]>): string | null => {
    const availableGroups = GROUPS.filter(groupName => {
      const group = currentGroups[groupName]
      return canTeamGoToGroup(team, group)
    })

    if (availableGroups.length === 0) return null
    return availableGroups[Math.floor(Math.random() * availableGroups.length)]
  }

  const handleDrawGroups = async () => {
    setIsDrawing(true)
    setDrawStep(1)
    const newLog: string[] = ["🔮 INICIANDO SORTEO OFICIAL FIFA 2026"]
    newLog.push("=".repeat(50))
    setDrawLog([...newLog])
    
    const teamsPool = {
      seed1: [...TEAMS_BY_SEEDING.seed1],
      seed2: [...TEAMS_BY_SEEDING.seed2],
      seed3: [...TEAMS_BY_SEEDING.seed3],
      seed4: [...TEAMS_BY_SEEDING.seed4],
    }

    const newGroups: Record<string, Team[]> = {}
    GROUPS.forEach(g => newGroups[g] = [])

    await new Promise(resolve => setTimeout(resolve, 1000))

    setDrawStep(2)
    newLog.push("\n🏟️ PASO 1: ASIGNACIÓN DE ANFITRIONES")
    newLog.push("-".repeat(30))
    
    const assignHost = (teamName: string, group: string) => {
      const hostTeam = teamsPool.seed1.find(t => t.name === teamName)
      if (hostTeam) {
        newGroups[group].push(hostTeam)
        teamsPool.seed1 = teamsPool.seed1.filter(t => t.name !== teamName)
        newLog.push(`✅ ${teamName} → Grupo ${group} (Anfitrión)`)
      }
    }

    assignHost("México", "A")
    assignHost("Canadá", "B")
    assignHost("Estados Unidos", "D")
    
    setDrawLog([...newLog])
    setGroups({ ...newGroups })
    await new Promise(resolve => setTimeout(resolve, 1500))

    setDrawStep(3)
    newLog.push("\n🏆 PASO 2: DISTRIBUCIÓN DE TOP 4 FIFA")
    newLog.push("-".repeat(30))

    const topTeams = teamsPool.seed1.filter(t => 
      ["España", "Argentina", "Francia", "Inglaterra"].includes(t.name)
    )

    const upperBracket = GROUPS.filter(g => g <= "F")
    const lowerBracket = GROUPS.filter(g => g >= "G")

    const assignToBracket = (teamName: string, bracket: string[]) => {
      const team = topTeams.find(t => t.name === teamName)
      if (team) {
        const validGroups = bracket.filter(groupName => 
          newGroups[groupName].length < 4 && canTeamGoToGroup(team, newGroups[groupName])
        )
        if (validGroups.length > 0) {
          const group = validGroups[Math.floor(Math.random() * validGroups.length)]
          newGroups[group].push(team)
          teamsPool.seed1 = teamsPool.seed1.filter(t => t.name !== teamName)
          newLog.push(`✅ ${teamName} → Grupo ${group} (Bracket ${bracket === upperBracket ? 'Superior' : 'Inferior'})`)
        }
      }
    }

    assignToBracket("España", lowerBracket)
    assignToBracket("Argentina", lowerBracket)
    assignToBracket("Francia", lowerBracket)
    assignToBracket("Inglaterra", lowerBracket)
    
    setDrawLog([...newLog])
    setGroups({ ...newGroups })
    await new Promise(resolve => setTimeout(resolve, 1500))

    setDrawStep(4)
    newLog.push("\n🎲 PASO 3: SORTEO BOMBO POR BOMBO")
    newLog.push("-".repeat(30))

    const seedingOrder: (keyof typeof teamsPool)[] = ["seed1", "seed2", "seed3", "seed4"]
    
    for (const seeding of seedingOrder) {
      newLog.push(`\n📦 BOMBO ${seeding.replace('seed', '')}:`)
      
      const shuffledTeams = [...teamsPool[seeding]].sort(() => Math.random() - 0.5)
      
      for (const team of shuffledTeams) {
        const validGroup = findValidGroup(team, newGroups)
        
        if (validGroup) {
          newGroups[validGroup].push(team)
          newLog.push(`   ${team.name} → Grupo ${validGroup}`)
          
          setGroups({ ...newGroups })
          await new Promise(resolve => setTimeout(resolve, 100))
        } else {
          const availableGroup = GROUPS.find(g => newGroups[g].length < 4)
          if (availableGroup) {
            newGroups[availableGroup].push(team)
            newLog.push(`   ⚠️ ${team.name} → Grupo ${availableGroup} (fallback)`)
          }
        }
      }
      
      setDrawLog([...newLog])
      await new Promise(resolve => setTimeout(resolve, 800))
    }

    setDrawStep(5)
    newLog.push("\n✅ PASO 4: VERIFICACIÓN FINAL")
    newLog.push("-".repeat(30))
    
    let allValid = true
    GROUPS.forEach(groupName => {
      const group = newGroups[groupName]
      if (group.length !== 4) {
        allValid = false
        newLog.push(`❌ Grupo ${groupName}: ${group.length}/4 equipos`)
      } else {
        const confCounts: Record<string, number> = {}
        group.forEach(team => {
          confCounts[team.confederation] = (confCounts[team.confederation] || 0) + 1
        })
        
        const issues = []
        if (confCounts[CONFEDERATIONS.UEFA] > 2) issues.push(`${confCounts[CONFEDERATIONS.UEFA]} UEFA (máx 2)`)
        Object.entries(confCounts).forEach(([conf, count]) => {
          if (conf !== CONFEDERATIONS.UEFA && count > 1) {
            issues.push(`${count} ${conf} (máx 1)`)
          }
        })
        
        if (issues.length > 0) {
          allValid = false
          newLog.push(`❌ Grupo ${groupName}: ${issues.join(', ')}`)
        } else {
          newLog.push(`✓ Grupo ${groupName}: OK`)
        }
      }
    })

    if (allValid) {
      newLog.push("\n🎉 ¡SORTEO COMPLETADO EXITOSAMENTE!")
      newLog.push("Todos los grupos cumplen con las reglas FIFA")
    } else {
      newLog.push("\n⚠️ SORTEO COMPLETADO CON ADVERTENCIAS")
      newLog.push("Algunos grupos no cumplen todas las restricciones")
    }

    setDrawLog([...newLog])
    setGroups({ ...newGroups })
    setAvailableTeams({ seed1: [], seed2: [], seed3: [], seed4: [] })
    setIsDrawing(false)
    setDrawStep(0)
  }

  const handleAddTeamToGroup = (groupName: string, seeding: keyof typeof availableTeams, teamIndex: number) => {
    const team = availableTeams[seeding]?.[teamIndex]
    if (!team) return

    setGroups(prev => ({
      ...prev,
      [groupName]: [...prev[groupName], team],
    }))

    setAvailableTeams(prev => ({
      ...prev,
      [seeding]: prev[seeding].filter((_, i) => i !== teamIndex),
    }))
  }

  const handleRemoveTeamFromGroup = (groupName: string, teamIndex: number) => {
    const team = groups[groupName][teamIndex]
    if (!team) return

    let seeding: keyof typeof availableTeams = "seed1"
    if (TEAMS_BY_SEEDING.seed2.some(t => t.name === team.name)) seeding = "seed2"
    else if (TEAMS_BY_SEEDING.seed3.some(t => t.name === team.name)) seeding = "seed3"
    else if (TEAMS_BY_SEEDING.seed4.some(t => t.name === team.name)) seeding = "seed4"

    setGroups(prev => ({
      ...prev,
      [groupName]: prev[groupName].filter((_, i) => i !== teamIndex),
    }))

    setAvailableTeams(prev => ({
      ...prev,
      [seeding]: [...prev[seeding], team],
    }))
  }

  const canCreate = GROUPS.every(g => groups[g]?.length === 4)

  const handleCreateGroups = () => {
    if (canCreate) {
      onGroupsCreated(groups)
    }
  }

  const handleReset = () => {
    initializeData()
  }

  const getStepTitle = () => {
    switch(drawStep) {
      case 1: return "Preparando sorteo..."
      case 2: return "Asignando anfitriones"
      case 3: return "Distribuyendo top 4 del ranking"
      case 4: return "Sorteando equipos"
      case 5: return "Verificando grupos"
      default: return ""
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Sorteo Oficial - Copa Mundial 2026</h2>
        <p className="text-gray-600">Realiza el sorteo con todas las reglas FIFA o crea grupos manualmente</p>
      </div>

      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          <strong>Reglas FIFA para el sorteo:</strong>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm">
            <div>
              <strong>• Distribución por bombos:</strong>
              <ul className="list-disc pl-5">
                <li>1 equipo de cada bombo por grupo</li>
                <li>Anfitriones: México (A), Canadá (B), USA (D)</li>
              </ul>
            </div>
            <div>
              <strong>• Restricciones por confederación:</strong>
              <ul className="list-disc pl-5">
                <li>UEFA: máximo 2 equipos por grupo</li>
                <li>Otras confederaciones: máximo 1</li>
                <li>Playoffs: evitar repetición de confeds posibles</li>
              </ul>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      <div className="flex gap-4 justify-center mb-8 flex-wrap">
        <Button 
          onClick={handleDrawGroups} 
          variant="default" 
          size="lg"
          disabled={isDrawing}
          className="bg-green-600 hover:bg-green-700 min-w-[200px]"
        >
          {isDrawing ? (
            <>
              <span className="animate-spin mr-2">⟳</span>
              {getStepTitle()}
            </>
          ) : (
            "🎲 Realizar Sorteo Oficial"
          )}
        </Button>
        <Button onClick={handleReset} variant="outline" size="lg">
          Reiniciar Todo
        </Button>
      </div>

      {drawLog.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Registro del Sorteo</span>
              {drawStep > 0 && (
                <span className="text-sm font-normal px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                  Paso {drawStep}/5
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 overflow-y-auto bg-gray-900 text-gray-100 p-4 rounded font-mono text-sm">
              {drawLog.map((log, index) => (
                <div 
                  key={index} 
                  className={`mb-1 ${log.includes('❌') ? 'text-red-400' : log.includes('✅') ? 'text-green-400' : log.includes('⚠️') ? 'text-yellow-400' : ''}`}
                >
                  {log}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {GROUPS.map((group) => (
          <Card key={group} className="border-2 border-gray-200 hover:border-gray-300 transition-colors shadow-lg hover:shadow-xl">
            <CardHeader className={`bg-gradient-to-r ${group <= 'F' ? 'from-blue-50 to-blue-100 border-b-4 border-blue-500' : 'from-red-50 to-red-100 border-b-4 border-red-500'}`}>
              <CardTitle className="text-xl flex justify-between items-center">
                <span className="font-bold">Grupo {group}</span>
                <span className={`text-xs font-semibold px-2 py-1 rounded ${group <= 'F' ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'}`}>
                  {group <= 'F' ? 'BRACKET SUP' : 'BRACKET INF'}
                </span>
              </CardTitle>
              <div className="text-sm text-gray-600 flex justify-between items-center">
                <span>{groups[group]?.length || 0}/4 equipos</span>
                {groups[group]?.some(t => t.isHost) && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full flex items-center gap-1">
                    🏠 Anfitrión
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3 mb-4">
                {groups[group]?.map((team, idx) => {
                  const flagCode = getCountryCode(team.name)
                  
                  return (
                    <div
                      key={`${group}-${team.name}`}
                      className="flex justify-between items-center bg-white p-3 rounded-lg hover:bg-gray-50 border border-gray-200 shadow-sm transition-all"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-800 truncate">{team.name}</div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <span className={`px-2 py-0.5 rounded ${team.confederation === CONFEDERATIONS.UEFA ? 'bg-blue-100 text-blue-800' : 
                            team.confederation === CONFEDERATIONS.CONMEBOL ? 'bg-green-100 text-green-800' :
                            team.confederation === CONFEDERATIONS.CONCACAF ? 'bg-yellow-100 text-yellow-800' :
                            team.confederation === CONFEDERATIONS.AFC ? 'bg-red-100 text-red-800' :
                            team.confederation === CONFEDERATIONS.CAF ? 'bg-purple-100 text-purple-800' :
                            team.confederation === CONFEDERATIONS.OFC ? 'bg-pink-100 text-pink-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {team.confederation}
                          </span>
                          {team.isPlayoff && (
                            <span className="px-2 py-0.5 bg-orange-100 text-orange-800 rounded">Playoff</span>
                          )}
                          {team.isHost && (
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded">Anfitrión</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 ml-3">
                        <div className="w-12 h-8 flex-shrink-0 bg-gray-100 rounded border border-gray-300 overflow-hidden shadow-sm">
                          <img
                            src={getFlagUrl(flagCode, 'w80')}
                            alt={`Bandera de ${team.name}`}
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
                        <button
                          onClick={() => handleRemoveTeamFromGroup(group, idx)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1 hover:bg-red-50 rounded-full"
                          title="Remover equipo"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {(groups[group]?.length || 0) < 4 && (
                <div className="space-y-2">
                  {["seed1", "seed2", "seed3", "seed4"].map((seeding) => (
                    <div key={seeding}>
                      {availableTeams[seeding as keyof typeof availableTeams]?.length > 0 && (
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              const idx = Number.parseInt(e.target.value)
                              handleAddTeamToGroup(group, seeding as keyof typeof availableTeams, idx)
                              e.target.value = ""
                            }
                          }}
                          className="w-full p-2 border border-gray-300 rounded text-sm bg-white hover:border-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">
                            Bombo {seeding.replace('seed', '')} ({availableTeams[seeding as keyof typeof availableTeams]?.length} equipos)
                          </option>
                          {availableTeams[seeding as keyof typeof availableTeams]?.map((team, idx) => {
                            const flagCode = getCountryCode(team.name)
                            return (
                              <option key={idx} value={idx}>
                                {team.name} ({team.confederation}{team.isPlayoff ? ' - Playoff' : ''})
                              </option>
                            )
                          })}
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

      <div className="flex justify-center pt-8 gap-4">
        <Button 
          onClick={handleCreateGroups} 
          disabled={!canCreate} 
          size="lg" 
          className="px-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg"
        >
          {canCreate ? (
            <span className="flex items-center gap-2">
              🎮 Continuar a Simulación
            </span>
          ) : (
            "Completa los 12 grupos (48 equipos)"
          )}
        </Button>
        {canCreate && (
          <Button onClick={handleReset} variant="outline" size="lg">
            Empezar de nuevo
          </Button>
        )}
      </div>

      {!canCreate && (
        <div className="text-center text-sm text-gray-500">
          Progreso: {Object.values(groups).reduce((acc, group) => acc + group.length, 0)}/48 equipos asignados
        </div>
      )}
    </div>
  )
}
