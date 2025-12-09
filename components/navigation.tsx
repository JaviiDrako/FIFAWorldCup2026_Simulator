"use client"

import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import { useEffect, useRef } from "react"

interface NavigationProps {
  currentStage: "groups" | "official" | "simulator" | "knockout"
  onReset: () => void
}

export default function Navigation({ currentStage, onReset }: NavigationProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log("Autoplay bloqueado:", e))
    }
  }, [])

  const getStages = () => {
    if (currentStage === "groups" || currentStage === "official") {
      return ["groups", "simulator", "knockout"]
    } else if (currentStage === "simulator") {
      return ["groups", "simulator", "knockout"]
    } else {
      return ["groups", "simulator", "knockout"]
    }
  }

  const stages = getStages()
  
  const stageNames = { 
    groups: "Creación de Grupos", 
    simulator: "Simulación de Grupos", 
    knockout: "Fase Eliminatoria" 
  }

  const getCurrentIndex = () => {
    if (currentStage === "groups" || currentStage === "official") return 0
    if (currentStage === "simulator") return 1
    if (currentStage === "knockout") return 2
    return 0
  }

  const currentIndex = getCurrentIndex()

  return (
    <header className="relative overflow-hidden border-b border-gray-200 shadow-sm">
      <div className="absolute inset-0 -z-10">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute w-full h-full object-cover"
          style={{
            filter: "blur(6px)",
            transform: "scale(1.1)"
          }}
        >
          <source src="/WC-background.mp4" type="video/mp4" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-green-900 to-yellow-900" />
        </video>
        
        <div 
          className="absolute inset-0 bg-black/40" 
          style={{
            backdropFilter: "blur(1px)"
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-4 relative">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-['Montserrat'] text-white drop-shadow-lg">Simulador Copa Mundial 2026</h1>
            <p className="text-gray-200 text-sm md:text-base">
              {currentStage === "groups" && "Crea o sortea los grupos del torneo"}
              {currentStage === "official" && "Grupos oficiales del sorteo FIFA"}
              {currentStage === "simulator" && "Simula los partidos de la fase de grupos"}
              {currentStage === "knockout" && "Sigue la fase eliminatoria"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => window.location.href = "/"} 
              variant="outline" 
              size="sm"
              className="gap-2 bg-white/80 hover:bg-white border-white/30 text-gray-800 hover:text-gray-900 backdrop-blur-sm"
            >
              <Home className="h-4 w-4" />
              Volver al Inicio
            </Button>
            <Button 
              onClick={onReset} 
              variant="outline" 
              size="sm"
              className="bg-white/80 hover:bg-white border-red-200 text-gray-800 hover:text-red-600 backdrop-blur-sm"
            >
              Reiniciar
            </Button>
          </div>
        </div>

        <div className="relative pt-6">
          <div 
            className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300/50 -translate-y-1/2 backdrop-blur-sm"
            style={{ top: "50%" }}
          ></div>
          
          <div 
            className="absolute top-1/2 left-0 h-1 bg-green-500 transition-all duration-300 -translate-y-1/2"
            style={{ 
              width: `${(currentIndex / (stages.length - 1)) * 100}%`,
              top: "50%" 
            }}
          ></div>
          
          <div className="flex justify-between relative">
            {stages.map((stage, idx) => (
              <div key={stage} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-2 relative ${
                    currentIndex >= idx 
                      ? "bg-green-500 text-white border-green-500 shadow-lg" 
                      : "bg-white/90 text-gray-700 border-gray-300 backdrop-blur-sm"
                  } transition-all duration-300`}
                >
                  {idx + 1}
                </div>
                <span className={`mt-2 text-sm font-medium whitespace-nowrap ${
                  currentIndex >= idx ? "text-white drop-shadow" : "text-gray-200"
                }`}>
                  {stageNames[stage as keyof typeof stageNames]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
            <div className={`w-2 h-2 rounded-full ${
              currentStage === "groups" ? "bg-blue-400" :
              currentStage === "simulator" ? "bg-green-400" :
              currentStage === "knockout" ? "bg-red-400" : "bg-purple-400"
            }`}></div>
            <span className="text-sm font-medium text-white drop-shadow">
              {currentStage === "groups" && "Sorteo/Creación de Grupos"}
              {currentStage === "official" && "Grupos Oficiales"}
              {currentStage === "simulator" && "Simulación de Grupos"}
              {currentStage === "knockout" && "Fase Eliminatoria"}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
