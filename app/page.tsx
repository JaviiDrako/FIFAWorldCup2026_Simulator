"use client"

import { useState } from "react"
import GroupCreator from "@/components/group-creator"
import GroupSimulator from "@/components/group-simulator"
import KnockoutBracket from "@/components/knockout-bracket"
import Navigation from "@/components/navigation"

export default function Home() {
  const [stage, setStage] = useState<"groups" | "simulator" | "knockout">("groups")
  const [createdGroups, setCreatedGroups] = useState<any>(null)
  const [winners, setWinners] = useState<any>(null)
  const [groupsData, setGroupsData] = useState<any>(null)

  const handleGroupsCreated = (groups: any) => {
    setCreatedGroups(groups)
    setStage("simulator")
  }

  const handleWinnersSelected = (selectedWinners: any, matches: any, standings: any) => {
    setWinners(selectedWinners)
    setGroupsData({ matches, standings })
    setStage("knockout")
  }

  const handleReset = () => {
    setStage("groups")
    setCreatedGroups(null)
    setWinners(null)
    setGroupsData(null)
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation currentStage={stage} onReset={handleReset} />

      <div className="container mx-auto px-4 py-8">
        {stage === "groups" && <GroupCreator onGroupsCreated={handleGroupsCreated} />}

        {stage === "simulator" && createdGroups && (
          <GroupSimulator groups={createdGroups} onWinnersSelected={handleWinnersSelected} />
        )}

        {stage === "knockout" && winners && (
          <KnockoutBracket
            winners={winners}
            matches={groupsData?.matches}
            groups={createdGroups}
            standings={groupsData?.standings}
          />
        )}
      </div>
    </main>
  )
}

