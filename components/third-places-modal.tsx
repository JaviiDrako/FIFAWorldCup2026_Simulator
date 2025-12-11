"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Shield, Check, Sparkles, Target, Trophy } from "lucide-react"

interface ThirdPlacesSelectionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  thirdPlaces: Array<{team: string, group: string}>
  selectedThirdPlaces: string[]
  onSelectThirdPlaces: (teams: string[]) => void
  onConfirm: (selectedTeams: string[]) => void
}

export default function ThirdPlacesSelectionModal({
  open,
  onOpenChange,
  thirdPlaces,
  selectedThirdPlaces,
  onSelectThirdPlaces,
  onConfirm
}: ThirdPlacesSelectionModalProps) {
  const [tempSelected, setTempSelected] = useState<string[]>(selectedThirdPlaces)

  useEffect(() => {
    setTempSelected(selectedThirdPlaces)
  }, [selectedThirdPlaces])

  const handleTeamToggle = (team: string) => {
    setTempSelected(prev => {
      if (prev.includes(team)) {
        return prev.filter(t => t !== team)
      } else if (prev.length < 8) {
        return [...prev, team]
      }
      return prev
    })
  }

  const handleSelectRandom = () => {
    const shuffled = [...thirdPlaces].sort(() => Math.random() - 0.5)
    const randomSelection = shuffled.slice(0, 8).map(t => t.team)
    setTempSelected(randomSelection)
  }

  const handleSave = () => {
    console.log("Continuing with selected teams:", tempSelected)
    onConfirm(tempSelected)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-600" />
            Selecciona los 8 mejores terceros para la fase de dieciseisavos
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-bold text-blue-800">
                  ¡Felicidades! Has seleccionado los 3 primeros de cada grupo.
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  Ahora debes seleccionar <span className="font-bold">8 equipos de tercer lugar</span> que avanzarán a dieciseisavos de final.
                  Hay 12 equipos en total, solo 8 pueden clasificar.
                </p>
              </div>
            </div>
            <div className="mt-3 p-3 bg-white rounded-lg border">
              <div className="flex justify-between items-center">
                <div className="text-sm font-semibold">
                  Seleccionados: <span className={`${tempSelected.length === 8 ? 'text-green-600 font-bold' : 'text-orange-600'}`}>
                    {tempSelected.length}/8
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleSelectRandom}
                    disabled={tempSelected.length === 8}
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    Seleccionar aleatoriamente
                  </Button>
                </div>
              </div>
              {tempSelected.length === 8 && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                  ¡Perfecto! Has seleccionado los 8 equipos que avanzarán.
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {thirdPlaces.map((third) => {
              const isSelected = tempSelected.includes(third.team)
              return (
                <div
                  key={`${third.group}-${third.team}`}
                  onClick={() => handleTeamToggle(third.team)}
                  className={`
                    flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md
                    ${isSelected 
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-400 shadow-sm' 
                      : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center
                      ${isSelected 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                        : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700'
                      }
                    `}>
                      {isSelected ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <span className="text-sm font-bold">{third.group}</span>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{third.team}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <span>Grupo {third.group}</span>
                        <span className="text-xs px-2 py-0.5 bg-gray-100 rounded">Tercer lugar</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="pt-4 mt-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Total de equipos disponibles: <span className="font-bold">{thirdPlaces.length}</span>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={tempSelected.length !== 8}
                  className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Continuar con {tempSelected.length}/8 seleccionados
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
