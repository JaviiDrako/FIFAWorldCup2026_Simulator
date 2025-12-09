"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Shuffle, Target, Users } from "lucide-react"

interface HomeScreenProps {
  onSelectSorteo: () => void
  onSelectOficial: () => void
}

export default function HomeScreen({ onSelectSorteo, onSelectOficial }: HomeScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 relative">
      <div className="container mx-auto px-4 relative z-10 py-8 bg-black/20 backdrop-blur-sm rounded-3xl border border-white/10">
        <div className="text-center mb-16">
          <div className="mb-10">
            <div className="inline-block px-6 py-2 rounded-full mb-6 border border-white/10 bg-gradient-to-r from-red-600/30 via-blue-600/30 to-green-600/30">
              <span className="text-white font-medium text-sm uppercase tracking-wider">
                3 Países Anfitriones
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-4">
              <span className="animate-smooth-gradient-balanced">
                FIFA
              </span>
              <span className="text-white block mt-2 font-['Montserrat'] font-black text-5xl md:text-7xl lg:text-8xl tracking-tight">
                WORLD CUP 2026
              </span>
            </h1>
            
            <div className="flex items-center justify-center gap-4 my-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-red-600"></div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse-slow shadow-md shadow-red-600/40"></div>
                <div className="w-3 h-3 rounded-full bg-blue-600 animate-pulse-slow delay-300 shadow-md shadow-blue-600/40"></div>
                <div className="w-3 h-3 rounded-full bg-green-600 animate-pulse-slow delay-600 shadow-md shadow-green-600/40"></div>
              </div>
              <div className="h-px w-16 bg-gradient-to-r from-green-600 to-transparent"></div>
            </div>
          </div>
          
          <div className="max-w-2xl mx-auto mb-10">
            <div className="inline-flex rounded-full px-8 py-4 backdrop-blur-sm bg-white/5 border border-white/15 hover:border-red-600/40 transition-all duration-300">
              <p className="text-lg md:text-xl text-white font-semibold">
                Crea y simula tu propia predicción del torneo
              </p>
            </div>
          </div>

          <div className="flex gap-6 justify-center items-center text-white/90 drop-shadow-lg">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-yellow-400">48</div>
              <div className="text-sm">Equipos</div>
            </div>
            <div className="h-8 w-px bg-white/40"></div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-blue-500">12</div>
              <div className="text-sm">Grupos</div>
            </div>
            <div className="h-8 w-px bg-white/40"></div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-green-500">104</div>
              <div className="text-sm">Partidos</div>
            </div>
            <div className="h-8 w-px bg-white/40"></div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-red-500">3</div>
              <div className="text-sm">Anfitriones</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="border-2 border-white/30 bg-gradient-to-br from-orange-900/70 to-orange-600/55 backdrop-blur-lg shadow-2xl hover:shadow-orange-600/35 transition-all duration-500 hover:scale-[1.02] hover:border-white/50 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/15 to-transparent"></div>
            <div className="absolute -right-20 -top-20 w-40 h-40 bg-orange-600/25 rounded-full blur-3xl group-hover:bg-orange-500/35 transition-all"></div>
            
            <CardHeader className="relative border-b border-white/20 pb-6">
              <CardTitle className="text-2xl flex items-center gap-3 text-white">
                <div className="p-3 bg-orange-600/35 rounded-2xl backdrop-blur-sm">
                  <Shuffle className="h-8 w-8 text-white" />
                </div>
                <div>
                  <div className="font-bold">Sorteo Manual</div>
                  <div className="text-sm font-normal text-white/80">Crea tus propios escenarios</div>
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="relative pt-6">
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-500/35 rounded-full shrink-0 mt-1">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Total libertad</h3>
                    <ul className="text-sm text-white/80 space-y-1">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                        <span>Sortea con reglas FIFA reales</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                        <span>Crea grupos manualmente</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                        <span>Experimenta escenarios alternativos</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button 
                onClick={onSelectSorteo} 
                className="w-full py-6 text-lg bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 border-2 border-white/30 shadow-lg group-hover:shadow-orange-600/55 transition-all"
                size="lg"
              >
                <Shuffle className="mr-2 h-5 w-5" />
                <span className="font-bold">Comenzar Sorteo</span>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-white/30 bg-gradient-to-br from-teal-900/70 to-teal-600/55 backdrop-blur-lg shadow-2xl hover:shadow-teal-600/35 transition-all duration-500 hover:scale-[1.02] hover:border-white/50 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-600/15 to-transparent"></div>
            <div className="absolute -right-20 -top-20 w-40 h-40 bg-teal-600/25 rounded-full blur-3xl group-hover:bg-teal-500/35 transition-all"></div>
            
            <CardHeader className="relative border-b border-white/20 pb-6">
              <CardTitle className="text-2xl flex items-center gap-3 text-white">
                <div className="p-3 bg-teal-600/35 rounded-2xl backdrop-blur-sm">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <div>
                  <div className="font-bold">Grupos Oficiales</div>
                  <div className="text-sm font-normal text-white/80">Sorteo real del 5 de diciembre</div>
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="relative pt-6">
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-teal-500/35 rounded-full shrink-0 mt-1">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Experiencia real</h3>
                    <ul className="text-sm text-white/80 space-y-1">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                        <span>Grupos oficiales FIFA 2026</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                        <span>Emparejamientos reales del torneo</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                        <span>Haz predicciones con datos reales</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button 
                onClick={onSelectOficial} 
                className="w-full py-6 text-lg bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 border-2 border-white/30 shadow-lg group-hover:shadow-teal-600/55 transition-all"
                size="lg"
              >
                <Trophy className="mr-2 h-5 w-5" />
                <span className="font-bold">Usar Grupos Reales</span>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex flex-col items-center gap-4 p-6 rounded-2xl border border-white/20">
            <div className="flex items-center gap-6 text-white/90">
              <div className="flex flex-col items-center">
                <Trophy className="h-8 w-8 text-yellow-400" />
                <div className="text-sm mt-1">Simulación Completa</div>
              </div>
              <div className="flex flex-col items-center">
                <Users className="h-8 w-8 text-blue-400" />
                <div className="text-sm mt-1">Compara Resultados</div>
              </div>
              <div className="flex flex-col items-center">
                <Target className="h-8 w-8 text-green-400" />
                <div className="text-sm mt-1">Precisión FIFA</div>
              </div>
            </div>
            <p className="text-white/70 text-sm max-w-2xl mx-auto">
              Simulador oficial del Mundial 2026 • Actualizado tras sorteo del 5 de diciembre
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes smooth-gradient-balanced {
          0%, 100% {
            background-position: 0% 50%;
            background-image: linear-gradient(
              90deg,
              #dc2626 0%,      /* red-600 - Canadá */
              #2563eb 33%,     /* blue-600 - EE.UU. */
              #059669 66%      /* green-600 - México */
            );
          }
          33% {
            background-position: 100% 50%;
            background-image: linear-gradient(
              90deg,
              #059669 0%,      /* green-600 - México */
              #dc2626 33%,     /* red-600 - Canadá */
              #2563eb 66%      /* blue-600 - EE.UU. */
            );
          }
          66% {
            background-position: 0% 50%;
            background-image: linear-gradient(
              90deg,
              #2563eb 0%,      /* blue-600 - EE.UU. */
              #059669 33%,     /* green-600 - México */
              #dc2626 66%      /* red-600 - Canadá */
            );
          }
        }
        
        /* Animación de pulso balanceado */
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.85;
            transform: scale(1.08);
          }
        }
        
        .animate-smooth-gradient-balanced {
          background-size: 200% auto;
          animation: smooth-gradient-balanced 8s ease-in-out infinite;
          background-image: linear-gradient(
            90deg,
            #dc2626 0%,      /* red-600 - Canadá */
            #2563eb 33%,     /* blue-600 - EE.UU. */
            #059669 66%      /* green-600 - México */
          );
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: inline-block;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        
        .delay-300 {
          animation-delay: 300ms;
        }
        
        .delay-600 {
          animation-delay: 600ms;
        }
      `}</style>
    </div>
  )
}
