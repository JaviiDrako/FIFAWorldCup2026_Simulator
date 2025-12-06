"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { GROUPS } from "@/lib/teams-data"
import { Eye } from "lucide-react"

interface GroupsModalProps {
  matches: Record<string, any[]>
  groups: Record<string, string[]>
  standings: Record<string, any[]>
}

export default function GroupsModal({ matches, groups, standings }: GroupsModalProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Eye className="w-4 h-4" />
          Ver Grupos
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[1400px] h-[800px] overflow-y-auto" style={{ maxWidth: '95vw' }}> 
        <DialogHeader>
          <DialogTitle>Clasificación Final de Fase de Grupos</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-2">
          {GROUPS.map((groupName) => (
            <Card key={groupName} className="border-2">
              <CardHeader className="bg-primary/5 pb-2">
                <CardTitle className="text-base">Grupo {groupName}</CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                <div className="space-y-1 text-sm">
                  {standings[groupName]?.map((team, idx) => (
                    <div key={team.team} className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-1">
                        <span className="font-bold w-5">{idx + 1}.</span>
                        <span
                          className={`flex-1 text-xs ${
                            idx < 2 ? "font-bold text-green-600" : idx === 2 ? "text-blue-600" : "text-gray-500"
                          }`}
                        >
                          {team.team}
                        </span>
                      </div>
                      <div className="flex gap-2 text-xs">
                        <span className="font-bold">{team.points}pts</span>
                        <span className="text-gray-600">
                          {team.goalDifference > 0 ? "+" : ""}
                          {team.goalDifference}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

