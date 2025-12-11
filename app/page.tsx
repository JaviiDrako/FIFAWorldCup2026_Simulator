"use client"

import { useState, useEffect, useRef } from "react"
import HomeScreen from "@/components/home-screen"
import GroupCreator from "@/components/group-creator"
import GroupSimulator from "@/components/group-simulator"
import KnockoutBracket from "@/components/knockout-bracket"
import OfficialGroupsViewer from "@/components/official-groups-viewer"
import Navigation from "@/components/navigation"
import { Team } from "@/lib/teams-data"

export default function Home() {
  const [stage, setStage] = useState<"home" | "groups" | "official" | "simulator" | "knockout">("home")
  const [createdGroups, setCreatedGroups] = useState<Record<string, string[]> | null>(null)
  const [winners, setWinners] = useState<any>(null)
  const [groupsData, setGroupsData] = useState<any>(null)
  const [originalGroupsWithDetails, setOriginalGroupsWithDetails] = useState<Record<string, Team[]> | null>(null)
  const [cameFromOfficial, setCameFromOfficial] = useState(false)
  const [playoffSelections, setPlayoffSelections] = useState<Record<string, string>>({})
  const [bestThirdPlaces, setBestThirdPlaces] = useState<string[]>([]) 
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      if (stage === "home") {
        videoRef.current.play().catch(e => console.log("Autoplay bloqueado:", e))
      } else {
        videoRef.current.pause()
      }
    }
  }, [stage])

  const handleSelectSorteo = () => {
    setCameFromOfficial(false)
    setStage("groups")
  }

  const handleSelectOficial = () => {
    setCameFromOfficial(true)
    setStage("official")
  }

  const handleGroupsCreated = (groups: Record<string, Team[]>) => {
    setOriginalGroupsWithDetails(groups)
    
    const simplifiedGroups: Record<string, string[]> = {}
    Object.entries(groups).forEach(([groupName, teams]) => {
      simplifiedGroups[groupName] = teams.map(team => team.name)
    })
    
    setCreatedGroups(simplifiedGroups)
    setStage("simulator")
    setBestThirdPlaces([]) 
  }

  const handleOfficialGroupsSelected = (groups: Record<string, string[]>, selections: Record<string, string>) => {
    setCreatedGroups(groups)
    setPlayoffSelections(selections)
    setStage("simulator")
    setBestThirdPlaces([]) 
  }

  const handleWinnersSelected = (selectedWinners: any, matches: any, standings: any, selectedThirdPlaces?: string[]) => {
    console.log("handleWinnersSelected called")
    console.log("Received selectedThirdPlaces:", selectedThirdPlaces)
    console.log("Length:", selectedThirdPlaces?.length || 0)
    
    setWinners(selectedWinners)
    setGroupsData({ matches, standings })
    
    if (selectedThirdPlaces && selectedThirdPlaces.length > 0) {
      console.log("Setting bestThirdPlaces:", selectedThirdPlaces)
      setBestThirdPlaces(selectedThirdPlaces)
    } else {
      console.log("No third places received, setting empty array")
      setBestThirdPlaces([])
    }
    setStage("knockout")
  }

  const handleReset = () => {
    if (stage === "simulator" || stage === "knockout") {
      if (cameFromOfficial) {
        setStage("official")
      } else {
        setStage("groups")
      }
      setWinners(null)
      setGroupsData(null)
      setBestThirdPlaces([]) 
      if (!cameFromOfficial) {
        setPlayoffSelections({})
      }
    } else if (stage === "groups" || stage === "official") {
      setStage("home")
      setCreatedGroups(null)
      setWinners(null)
      setGroupsData(null)
      setOriginalGroupsWithDetails(null)
      setCameFromOfficial(false)
      setPlayoffSelections({})
      setBestThirdPlaces([])
    }
  }

  const handleGoHome = () => {
    setStage("home")
    setCreatedGroups(null)
    setWinners(null)
    setGroupsData(null)
    setOriginalGroupsWithDetails(null)
    setCameFromOfficial(false)
    setPlayoffSelections({})
    setBestThirdPlaces([]) 
  }

  return (
    <>
      {stage === "home" && (
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="absolute w-full h-full object-cover"
            style={{
              filter: "blur(4px)",
              transform: "scale(1.1)"
            }}
          >
            <source src="/WC-background.mp4" type="video/mp4" />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-green-900 to-yellow-900" />
          </video>
          
          <div 
            className="absolute inset-0 bg-black/30" 
            style={{
              backdropFilter: "blur(1px)"
            }}
          />
        </div>
      )}

      <main className="min-h-screen relative">
        {stage !== "home" && (
          <Navigation 
            currentStage={stage === "official" ? "groups" : stage} 
            onReset={handleReset}
          />
        )}

        <div className="container mx-auto px-4 py-8 relative">
          {stage === "home" && (
            <HomeScreen 
              onSelectSorteo={handleSelectSorteo}
              onSelectOficial={handleSelectOficial}
            />
          )}

          {stage === "groups" && (
            <GroupCreator onGroupsCreated={handleGroupsCreated} />
          )}

          {stage === "official" && (
            <OfficialGroupsViewer onContinue={handleOfficialGroupsSelected} />
          )}

          {stage === "simulator" && createdGroups && (
            <GroupSimulator 
              groups={createdGroups} 
              onWinnersSelected={handleWinnersSelected}
              playoffSelections={playoffSelections}
            />
          )}

          {stage === "knockout" && winners && (
            <KnockoutBracket
              winners={winners}
              matches={groupsData?.matches}
              groups={originalGroupsWithDetails || createdGroups}
              standings={groupsData?.standings}
              playoffSelections={playoffSelections}
              bestThirdPlaces={bestThirdPlaces} 
            />
          )}
        </div>
      </main>
    </>
  )
}
