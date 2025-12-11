interface KnockoutMatch {
  id: string
  matchNumber: number
  round: "round16" | "quarterfinal" | "semifinal" | "final"
  stadium: string
  date: string
  team1?: string
  team2?: string
  goalsTeam1?: number
  goalsTeam2?: number
}

// Mapping of round of 16 with proper group positions
export const KNOCKOUT_MATCHES_CONFIG = [
  {
    id: 73,
    round: "round16",
    date: "Domingo, 28 de junio",
    stadium: "Los Angeles Stadium",
    groupMatch: ["B", 2, "A", 2], // 2º Group A v 2º Group B
  },
  {
    id: 74,
    round: "round16",
    date: "Lunes, 29 de junio",
    stadium: "Boston Stadium",
    groupMatch: ["E", 1, "A/B/C/D/F", 3], // 1º Group E v 3º Group A/B/C/D/F
  },
  {
    id: 75,
    round: "round16",
    date: "Lunes, 29 de junio",
    stadium: "Estadio Monterrey",
    groupMatch: ["F", 1, "C", 2], // 1º Group F v 2º Group C
  },
  {
    id: 76,
    round: "round16",
    date: "Lunes, 29 de junio",
    stadium: "Houston Stadium",
    groupMatch: ["C", 1, "F", 2], // 1º Group C v 2º Group F 
  },
  {
    id: 77,
    round: "round16",
    date: "Martes, 30 de junio",
    stadium: "New York New Jersey Stadium",
    groupMatch: ["I", 1, "C/D/F/G/H", 3], // 1º Group I v 3º Group C/D/F/G/H
  },
  {
    id: 78,
    round: "round16",
    date: "Martes, 30 de junio",
    stadium: "Dallas Stadium",
    groupMatch: ["E", 2, "I", 2], // 2º Group E v 2º Group I
  },
  {
    id: 79,
    round: "round16",
    date: "Martes, 30 de junio",
    stadium: "Estadio Ciudad de México",
    groupMatch: ["A", 1, "C/E/F/H/I", 3], // 1º Group A v 3º Group C/E/F/H/I
  },
  {
    id: 80,
    round: "round16",
    date: "Miércoles, 1 de julio",
    stadium: "Atlanta Stadium",
    groupMatch: ["L", 1, "E/H/I/J/K", 3], // 1º Group L v 3º Group E/H/I/J/K
  },
  {
    id: 81,
    round: "round16",
    date: "Miércoles, 1 de julio",
    stadium: "San Francisco Bay Area Stadium",
    groupMatch: ["D", 1, "B/E/F/I/J", 3], // 1º Group D v 3º Group B/E/F/I/J
  },
  {
    id: 82,
    round: "round16",
    date: "Miércoles, 1 de julio",
    stadium: "Seattle Stadium",
    groupMatch: ["G", 1, "A/E/H/I/J", 3], // 1º Group G v 3º Group A/E/H/I/J
  },
  {
    id: 83,
    round: "round16",
    date: "Jueves, 2 de julio",
    stadium: "Toronto Stadium",
    groupMatch: ["K", 2, "L", 2], // 2º Group K v 2º Group L
  },
  {
    id: 84,
    round: "round16",
    date: "Jueves, 2 de julio",
    stadium: "Los Angeles Stadium",
    groupMatch: ["H", 1, "J", 2], // 1º Group H v 2º Group J
  },
  {
    id: 85,
    round: "round16",
    date: "Jueves, 2 de julio",
    stadium: "BC Place Vancouver",
    groupMatch: ["B", 1, "E/F/G/I/J", 3], // 1º Group B v 3º Group E/F/G/I/J
  },
  {
    id: 86,
    round: "round16",
    date: "Viernes, 3 de julio",
    stadium: "Miami Stadium",
    groupMatch: ["J", 1, "H", 2], // 1º Group J v 2º Group H
  },
  {
    id: 87,
    round: "round16",
    date: "Viernes, 3 de julio",
    stadium: "Kansas City Stadium",
    groupMatch: ["K", 1, "D/E/I/J/L", 3], // 1º Group K v 3º Group D/E/I/J/L
  },
  {
    id: 88,
    round: "round16",
    date: "Viernes, 3 de julio",
    stadium: "Dallas Stadium",
    groupMatch: ["D", 2, "G", 2], // 2º Group D v 2º Group G
  },
]

// Round of 8 structure
export const OCTAVOS_STRUCTURE = [
  { id: 89, round: "quarterfinal", stadium: "Philadelphia Stadium", date: "Sábado, 4 de julio", matches: [73, 77] },
  { id: 90, round: "quarterfinal", stadium: "Houston Stadium", date: "Sábado, 4 de julio", matches: [74, 76] },
  {
    id: 91,
    round: "quarterfinal",
    stadium: "New York New Jersey Stadium",
    date: "Domingo, 5 de julio",
    matches: [78, 80],
  },
  {
    id: 92,
    round: "quarterfinal",
    stadium: "Estadio Azteca Ciudad de México",
    date: "Domingo, 5 de julio",
    matches: [79, 81],
  },
  { id: 93, round: "quarterfinal", stadium: "Dallas Stadium", date: "Lunes, 6 de julio", matches: [85, 87] },
  { id: 94, round: "quarterfinal", stadium: "Seattle Stadium", date: "Lunes, 6 de julio", matches: [83, 84] },
  { id: 95, round: "quarterfinal", stadium: "Atlanta Stadium", date: "Martes, 7 de julio", matches: [88, 86] },
  { id: 96, round: "quarterfinal", stadium: "BC Place Vancouver", date: "Martes, 7 de julio", matches: [82, 85] },
]

export interface ThirdPlaceTeam {
  group: string
  team: string
  points: number
  goalDifference: number
  goalsFor: number
}

// Third place pools following round of 16 matches
export const THIRD_PLACE_POOLS: Record<number, string[]> = {
  74: ['A', 'B', 'C', 'D', 'F'],      // Match number 74: 3º Group A/B/C/D/F
  77: ['C', 'D', 'F', 'G', 'H'],      
  79: ['C', 'E', 'F', 'H', 'I'],      
  80: ['E', 'H', 'I', 'J', 'K'],     
  81: ['B', 'E', 'F', 'I', 'J'],      
  82: ['A', 'E', 'H', 'I', 'J'],      
  85: ['E', 'F', 'G', 'I', 'J'],      
  87: ['D', 'E', 'I', 'J', 'L'],     
}

// AUXILIAR FUNCTIONS

// Obtain opponent's information in a specific match
function getMatchOpponentGroup(matchId: number): { group: string; position: number } | null {
  const matchConfig = KNOCKOUT_MATCHES_CONFIG.find(match => match.id === matchId)
  
  if (!matchConfig) return null
  
  // The opponent is the first element of the groupMatch (other than a third place) 
  const groupMatch = matchConfig.groupMatch
  if (Array.isArray(groupMatch) && groupMatch.length === 4) {
    const [opponentGroup, opponentPosition] = groupMatch
    // Only return if it's not a third place (position 3)
    if (opponentPosition !== 3) {
      return { group: opponentGroup as string, position: opponentPosition as number }
    }
  }
  
  return null
}

// Verify if a match has a third place
function matchHasThirdPlace(matchId: number): boolean {
  const matchConfig = KNOCKOUT_MATCHES_CONFIG.find(match => match.id === matchId)
  if (!matchConfig) return false
  
  const groupMatch = matchConfig.groupMatch
  if (Array.isArray(groupMatch) && groupMatch.length === 4) {
    const position = groupMatch[3] 
    return position === 3
  }
  
  return false
}

// Function to calculate group priority (for fallback) 
function calculateGroupPriority(thirds: ThirdPlaceTeam[]): Record<string, number> {
  const appearances: Record<string, number> = {
    'A': 2, 'B': 2, 'C': 3, 'D': 3, 'E': 5, 'F': 5,
    'G': 2, 'H': 4, 'I': 6, 'J': 5, 'K': 1, 'L': 1
  }
  
  // Those present have priority according to appearances 
  const priority: Record<string, number> = {}
  thirds.forEach(third => {
    priority[third.group] = appearances[third.group]
  })
  
  return priority
}

// MAIN FUNCTIONS

// Function to calculate the best 8 third places or use manual selection
export function calculateBestThirdPlaces(
  standings: Record<string, any[]>,
  manualThirdPlaces?: string[]
): Array<{team: string, group: string, points: number, goalDifference: number, goalsFor: number}> {
  
  // If there are manually selected thirds, use them
  if (manualThirdPlaces && manualThirdPlaces.length > 0) {
    const manualThirds: Array<{team: string, group: string, points: number, goalDifference: number, goalsFor: number}> = []
    
    Object.entries(standings).forEach(([groupName, groupStandings]) => {
      const thirdPlace = groupStandings[2]
      if (thirdPlace && manualThirdPlaces.includes(thirdPlace.team)) {
        manualThirds.push({
          team: thirdPlace.team,
          group: groupName,
          points: thirdPlace.points || 0,
          goalDifference: thirdPlace.goalDifference || 0,
          goalsFor: thirdPlace.goalsFor || 0
        })
      }
    })
    
    const orderedThirds = manualThirdPlaces
      .map(teamName => manualThirds.find(t => t.team === teamName))
      .filter(Boolean) as Array<{team: string, group: string, points: number, goalDifference: number, goalsFor: number}>
    
    return orderedThirds.slice(0, 8)
  }
  
  // Normal Calculus (complete mode)
  const thirdPlaces: Array<{team: string, group: string, points: number, goalDifference: number, goalsFor: number}> = []
  
  Object.entries(standings).forEach(([groupName, groupStandings]) => {
    if (groupStandings.length >= 3) {
      const third = groupStandings[2]
      thirdPlaces.push({
        team: third.team,
        group: groupName,
        points: third.points,
        goalDifference: third.goalDifference,
        goalsFor: third.goalsFor
      })
    }
  })
  
  return thirdPlaces.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference
    return b.goalsFor - a.goalsFor
  })
}

// Fallback greedy if the perfect matching fails
function greedyFallbackAssignment(
  bestThirds: ThirdPlaceTeam[],
  winners: Record<string, [string, string]>,
  existingMatches: Record<number, string>
): Record<number, string> {
  const assignments = { ...existingMatches }
  const assignedGroups = new Set(Object.values(existingMatches))
  const assignedMatches = new Set(Object.keys(existingMatches).map(Number))
  
  const remainingThirds = bestThirds.filter(t => !assignedGroups.has(t.group))
  const allMatchIds = Object.keys(THIRD_PLACE_POOLS)
    .map(Number)
    .filter(matchHasThirdPlace)
  const remainingMatches = allMatchIds.filter(id => !assignedMatches.has(id))
  
  // Assign priority to groups with fewer options 
  while (remainingThirds.length > 0 && remainingMatches.length > 0) {
    // Calculate options for each group
    const groupOptions = remainingThirds.map(third => ({
      third,
      options: remainingMatches.filter(matchId => {
        const pool = THIRD_PLACE_POOLS[matchId]
        if (!pool || !pool.includes(third.group)) return false
        
        const opponent = getMatchOpponentGroup(matchId)
        return !opponent || opponent.group !== third.group
      }).length
    }))
    
    // Sort by those with fewer options first
    groupOptions.sort((a, b) => a.options - b.options)
    
    const { third } = groupOptions[0]
    
    // Find compatible matches
    const availableMatches = remainingMatches.filter(matchId => {
      const pool = THIRD_PLACE_POOLS[matchId]
      if (!pool || !pool.includes(third.group)) return false
      
      const opponent = getMatchOpponentGroup(matchId)
      return !opponent || opponent.group !== third.group
    })
    
    if (availableMatches.length > 0) {
      // Assign to the first available match
      const chosenMatch = availableMatches[0]
      assignments[chosenMatch] = third.team
      
      const thirdIndex = remainingThirds.findIndex(t => t.group === third.group)
      remainingThirds.splice(thirdIndex, 1)
      
      const matchIndex = remainingMatches.indexOf(chosenMatch)
      remainingMatches.splice(matchIndex, 1)
    } else {
      // If there are no compatible matches, try any match in the pool. 
      const anyMatch = remainingMatches.find(matchId => 
        THIRD_PLACE_POOLS[matchId]?.includes(third.group)
      )
      
      if (anyMatch) {
        assignments[anyMatch] = third.team
        const thirdIndex = remainingThirds.findIndex(t => t.group === third.group)
        remainingThirds.splice(thirdIndex, 1)
        
        const matchIndex = remainingMatches.indexOf(anyMatch)
        remainingMatches.splice(matchIndex, 1)
      } else {
        const thirdIndex = remainingThirds.findIndex(t => t.group === third.group)
        remainingThirds.splice(thirdIndex, 1)
      }
    }
  }
  
  return assignments
}

// Function to assign third places to matches 
export function assignThirdPlacesToMatches(
  bestThirds: ThirdPlaceTeam[],
  winners: Record<string, [string, string]>
): Record<number, string> {
  const assignments: Record<number, string> = {}
  
  const thirdPlaceMatchIds = Object.keys(THIRD_PLACE_POOLS)
    .map(Number)
    .filter(matchHasThirdPlace)
  
  if (bestThirds.length === 0 || thirdPlaceMatchIds.length === 0) {
    return assignments
  }
  
  if (bestThirds.length <= 8) {
    
    let availableThirds = [...bestThirds]
    let availableMatches = [...thirdPlaceMatchIds]
    
    const calculateOptionsForGroup = (group: string, matches: number[]): number[] => {
      return matches.filter(matchId => {
        const pool = THIRD_PLACE_POOLS[matchId]
        if (!pool || !pool.includes(group)) return false
        
        const opponent = getMatchOpponentGroup(matchId)
        return !opponent || opponent.group !== group
      })
    }
    
    const calculateAllOptions = (thirds: ThirdPlaceTeam[], matches: number[]) => {
      return thirds.map(third => ({
        third,
        options: calculateOptionsForGroup(third.group, matches),
        optionsCount: calculateOptionsForGroup(third.group, matches).length
      }))
    }
    
    // While there are groups and matches available 
    while (availableThirds.length > 0 && availableMatches.length > 0) {
      // 1. Calculate current options for every group
      const groupsWithOptions = calculateAllOptions(availableThirds, availableMatches)
      
      // 2. Sort by fewer options first
      groupsWithOptions.sort((a, b) => {
        if (a.optionsCount !== b.optionsCount) {
          return a.optionsCount - b.optionsCount
        }
        const appearances: Record<string, number> = {
          'A': 2, 'B': 2, 'C': 3, 'D': 3, 'E': 5, 'F': 5,
          'G': 2, 'H': 4, 'I': 6, 'J': 5, 'K': 1, 'L': 1
        }
        return appearances[a.third.group] - appearances[b.third.group]
      })
      
      // 3. Choose the group with the fewest options (or the most restricted) 
      const { third, options } = groupsWithOptions[0]
      
      // 4. If it has options, assign to the first available match. 
      if (options.length > 0) {
        const chosenMatch = options[0]
        assignments[chosenMatch] = third.team
        
        // 5. Update lists
        // Remove the assigned group
        const thirdIndex = availableThirds.findIndex(t => t.group === third.group)
        availableThirds.splice(thirdIndex, 1)
        
        // Remover the assigned match
        const matchIndex = availableMatches.indexOf(chosenMatch)
        availableMatches.splice(matchIndex, 1)
      } else {
        // 6. If it has no compatible options, try any match in the pool. 
        const anyMatch = availableMatches.find(matchId => 
          THIRD_PLACE_POOLS[matchId]?.includes(third.group)
        )
        
        if (anyMatch) {
          assignments[anyMatch] = third.team
          const thirdIndex = availableThirds.findIndex(t => t.group === third.group)
          availableThirds.splice(thirdIndex, 1)
          
          const matchIndex = availableMatches.indexOf(anyMatch)
          availableMatches.splice(matchIndex, 1)
        } else {
          // 7. If there is no possible match for this group, delete it. 
          console.warn(`No hay match posible para grupo ${third.group}, eliminando`)
          const thirdIndex = availableThirds.findIndex(t => t.group === third.group)
          availableThirds.splice(thirdIndex, 1)
        }
      }
    }
    
    return assignments
  }
  
  // For complete mode (more than 8 third places), use the matching algorithm
  // 1. Prepare data for bipartite matching
  const groups = bestThirds.slice(0, 8).map(t => t.group) // Only the top 8
  
  // 2. Compatibility matrix: group x matchId
  const compatibility: boolean[][] = groups.map(group => {
    return thirdPlaceMatchIds.map(matchId => {
      if (!THIRD_PLACE_POOLS[matchId]?.includes(group)) return false
      
      const opponent = getMatchOpponentGroup(matchId)
      return !opponent || opponent.group !== group
    })
  })
  
  // 3. Bipartite matching (DFS with backtracking)
  const matchForGroup: Record<string, number> = {}
  const matchForMatch: Record<number, string> = {}
  
  // DFS function to find augmenting path
  const dfs = (groupIndex: number, visited: boolean[]): boolean => {
    const group = groups[groupIndex]
    
    for (let matchIndex = 0; matchIndex < thirdPlaceMatchIds.length; matchIndex++) {
      if (visited[matchIndex] || !compatibility[groupIndex][matchIndex]) continue
      
      visited[matchIndex] = true
      
      const matchId = thirdPlaceMatchIds[matchIndex]
      const currentGroup = matchForMatch[matchId]
      
      if (!currentGroup || dfs(groups.indexOf(currentGroup), visited)) {
        matchForGroup[group] = matchId
        matchForMatch[matchId] = group
        return true
      }
    }
    
    return false
  }
  
  // 4. Sort groups by restriction degree (fewer options first)
  const groupsWithOptions = groups.map((group, index) => ({
    group,
    index,
    options: thirdPlaceMatchIds.filter((_, matchIndex) => compatibility[index][matchIndex]).length
  }))
  
  groupsWithOptions.sort((a, b) => a.options - b.options)
  
  // 5. Try matching for each group (in order of restriction)
  for (const { group, index } of groupsWithOptions) {
    const visited = new Array(thirdPlaceMatchIds.length).fill(false)
    if (!dfs(index, visited)) {
      // No matching found - use greedy fallback
      console.warn(`Could not assign group ${group}, using fallback`)
      return greedyFallbackAssignment(bestThirds.slice(0, 8), winners, matchForMatch)
    }
  }
  
  // 6. Convert matching to assignments
  bestThirds.slice(0, 8).forEach(third => {
    const matchId = matchForGroup[third.group]
    if (matchId) {
      assignments[matchId] = third.team
    }
  })
  
  return assignments
}

