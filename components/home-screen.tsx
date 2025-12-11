"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Shuffle, Target, Users } from "lucide-react"
import { memo, useMemo } from "react"

interface HomeScreenProps {
  onSelectSorteo: () => void
  onSelectOficial: () => void
}

const STATIC_STYLES = `
  @keyframes subtle-gradient {
    0%, 100% { opacity: 0.8; }
    50% { opacity: 1; }
  }
  .animate-subtle-gradient {
    animation: subtle-gradient 4s ease-in-out infinite;
  }
`

const StatsItem = memo(({ number, label, color }: { number: string; label: string; color: string }) => (
  <div className="flex flex-col items-center">
    <div className={`text-2xl sm:text-3xl font-bold ${color}`}>{number}</div>
    <div className="text-xs sm:text-sm">{label}</div>
  </div>
))

const AnimatedDot = memo(({ color, delay }: { color: string; delay: string }) => (
  <div 
    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${color} opacity-80`}
    style={{ 
      animation: `pulse 2s ease-in-out ${delay} infinite`,
      boxShadow: `0 0 8px ${color}40`
    }}
  />
))

const STATS_DATA = [
  { number: "48", label: "Equipos", color: "text-yellow-400" },
  { number: "12", label: "Grupos", color: "text-blue-500" },
  { number: "104", label: "Partidos", color: "text-green-500" },
  { number: "3", label: "Anfitriones", color: "text-red-500" },
]

const FeatureCard = memo(({ 
  title, 
  subtitle, 
  icon: Icon, 
  gradientFrom, 
  gradientTo,
  buttonColor,
  features,
  buttonText,
  buttonIcon: ButtonIcon,
  onClick 
}: {
  title: string
  subtitle: string
  icon: any
  gradientFrom: string
  gradientTo: string
  buttonColor: string
  features: string[]
  buttonText: string
  buttonIcon: any
  onClick: () => void
}) => (
  <Card className={`border border-white/20 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden`}>
    <CardHeader className="border-b border-white/10 pb-4">
      <CardTitle className="text-xl flex items-center gap-3 text-white">
        <div className={`p-2 ${gradientFrom.includes('orange') ? 'bg-orange-600/30' : 'bg-teal-600/30'} rounded-xl`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <div className="font-bold">{title}</div>
          <div className="text-xs font-normal text-white/70">{subtitle}</div>
        </div>
      </CardTitle>
    </CardHeader>
    
    <CardContent className="pt-4">
      <div className="space-y-3 mb-4">
        <div className="flex items-start gap-2">
          <div className={`p-1.5 ${gradientFrom.includes('orange') ? 'bg-orange-500/25' : 'bg-teal-500/25'} rounded-full shrink-0 mt-0.5`}>
            <Target className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm mb-1">
              {gradientFrom.includes('orange') ? 'Total libertad' : 'Experiencia real'}
            </h3>
            <ul className="text-xs text-white/80 space-y-1">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${gradientFrom.includes('orange') ? 'bg-orange-500' : 'bg-teal-500'}`} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Button 
        onClick={onClick} 
        className={`w-full py-4 text-base ${buttonColor} hover:opacity-90 transition-opacity border border-white/20`}
        size="lg"
      >
        <ButtonIcon className="mr-2 h-4 w-4" />
        <span className="font-bold">{buttonText}</span>
      </Button>
    </CardContent>
  </Card>
))

const TechBadge = memo(({ tech }: { tech: string }) => (
  <span className="px-2 py-1 text-xs bg-white/10 rounded-full text-white/80">
    {tech}
  </span>
))

export default function HomeScreen({ onSelectSorteo, onSelectOficial }: HomeScreenProps) {
  const techStack = useMemo(() => ["Next.js", "React", "TypeScript", "Tailwind"], [])
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl px-4 py-6 bg-black/10 rounded-2xl border border-white/10 backdrop-blur-sm">
        <style jsx global>{STATIC_STYLES}</style>
        
        <div className="text-center mb-8">
          <div className="mb-6">
            <div className="inline-flex items-center px-2 md:px-4 py-1 md:py-1.5 rounded-full mb-4 border border-white/10 bg-gradient-to-r from-red-600/20 via-blue-600/20 to-green-600/20">
              <span className="text-white font-medium text-[8px] md:text-xs uppercase tracking-wider">
                3 Países Anfitriones
              </span>
            </div>
            
            <h1 className="text-5xl sm:text-5xl md:text-7xl font-black mb-3">
              <span className="animate-subtle-gradient bg-gradient-to-r from-red-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
                FIFA
              </span>
              <span className="text-white block mt-1 font-['Montserrat'] font-black text-4xl sm:text-5xl md:text-7xl tracking-tight">
                WORLD CUP 2026
              </span>
            </h1>
            
            <div className="flex items-center justify-center gap-3 my-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-red-600"></div>
              <div className="flex items-center gap-1.5">
                <AnimatedDot color="bg-red-600" delay="0ms" />
                <AnimatedDot color="bg-blue-600" delay="150ms" />
                <AnimatedDot color="bg-green-600" delay="300ms" />
              </div>
              <div className="h-px w-12 bg-gradient-to-r from-green-600 to-transparent"></div>
            </div>
          </div>
          
          <div className="max-w-2xl mx-auto mb-6">
            <div className="inline-flex rounded-full px-3 md:px-6 py-2 md:py-3 bg-white/5 border border-white/15">
              <p className="text-[10px] sm:text-lg md:text-[16px] text-white font-semibold">
                Crea y simula tu propia predicción del torneo
              </p>
            </div>
          </div>

          <div className="flex gap-4 sm:gap-6 justify-center items-center text-white/90">
            {STATS_DATA.map((stat, index) => (
              <div key={stat.label} className="flex items-center">
                <StatsItem {...stat} />
                {index < STATS_DATA.length - 1 && (
                  <div className="h-6 w-px bg-white/30 ml-4 sm:ml-6"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
          <FeatureCard
            title="Sorteo Manual"
            subtitle="Crea tus propios escenarios"
            icon={Shuffle}
            gradientFrom="from-orange-900/100"
            gradientTo="to-orange-600/60"
            buttonColor="bg-gradient-to-r from-orange-600 to-orange-700"
            features={[
              "Sortea con reglas FIFA reales",
              "Crea grupos manualmente",
              "Experimenta escenarios alternativos"
            ]}
            buttonText="Comenzar Sorteo"
            buttonIcon={Shuffle}
            onClick={onSelectSorteo}
          />
          
          <FeatureCard
            title="Grupos Oficiales"
            subtitle="Sorteo real del 5 de diciembre"
            icon={Trophy}
            gradientFrom="from-teal-900/100"
            gradientTo="to-teal-600/60"
            buttonColor="bg-gradient-to-r from-teal-600 to-teal-700"
            features={[
              "Grupos oficiales FIFA 2026",
              "Emparejamientos reales del torneo",
              "Haz predicciones con datos reales"
            ]}
            buttonText="Usar Grupos Reales"
            buttonIcon={Trophy}
            onClick={onSelectOficial}
          />
        </div>

        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <h3 className="text-base font-semibold text-white mb-1">
                  FIFA World Cup 2026 Simulator
                </h3>
                <p className="text-xs text-white/60 max-w-md">
                  Simulador creado por Javier Esteban Pérez Adriázola. 
                  Datos basados en información FIFA oficial.
                </p>
              </div>
              
              <div className="flex flex-col items-center md:items-end gap-3">
                <div className="flex gap-4">
                  <a 
                    href="https://github.com/JaviiDrako/FIFAWorldCup2026_Simulator/tree/master" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                    </svg>
                    <span className="text-sm">GitHub</span>
                  </a>
                  
                  <a 
                    href="https://www.linkedin.com/in/javier-esteban-p%C3%A9rez-adri%C3%A1zola-33a802276/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <span className="text-sm">LinkedIn</span>
                  </a>
                </div>
                
                <div className="flex flex-wrap gap-2 justify-center">
                  <span className="px-3 py-1 text-xs bg-white/10 rounded-full text-white/80">
                    Next.js
                  </span>
                  <span className="px-3 py-1 text-xs bg-white/10 rounded-full text-white/80">
                    React
                  </span>
                  <span className="px-3 py-1 text-xs bg-white/10 rounded-full text-white/80">
                    TypeScript
                  </span>
                  <span className="px-3 py-1 text-xs bg-white/10 rounded-full text-white/80">
                    Tailwind
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-center text-xs text-white/40">
              <p>
                Este es un proyecto de simulación no oficial. 
                FIFA™ es una marca registrada de la FIFA.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
