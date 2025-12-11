export interface Team {
  name: string
  confederation: string
  code: string 
  abbreviation: string
  isHost?: boolean
  fifaRanking?: number
  isPlayoff?: boolean
  playoffGroup?: string
}

export const CONFEDERATIONS = {
  UEFA: 'UEFA',
  CONMEBOL: 'CONMEBOL',
  CONCACAF: 'CONCACAF',
  AFC: 'AFC',
  CAF: 'CAF',
  OFC: 'OFC',
  INTER: 'INTER'
}

const TEAMS_CONFEDERATION_MAP: Record<string, { 
  confederation: string, 
  code: string,
  abbreviation: string,
  isHost?: boolean, 
  fifaRanking?: number, 
  isPlayoff?: boolean, 
  playoffGroup?: string 
}> = {
  // POT 1 - Seeded teams (with approximate FIFA ranking) 
  "Estados Unidos": { confederation: CONFEDERATIONS.CONCACAF, code: "US", abbreviation: "USA", isHost: true, fifaRanking: 11 },
  "México": { confederation: CONFEDERATIONS.CONCACAF, code: "MX", abbreviation: "MEX", isHost: true, fifaRanking: 12 },
  "Canadá": { confederation: CONFEDERATIONS.CONCACAF, code: "CA", abbreviation: "CAN", isHost: true, fifaRanking: 37 },
  "España": { confederation: CONFEDERATIONS.UEFA, code: "ES", abbreviation: "ESP", fifaRanking: 1 },
  "Argentina": { confederation: CONFEDERATIONS.CONMEBOL, code: "AR", abbreviation: "ARG", fifaRanking: 2 },
  "Francia": { confederation: CONFEDERATIONS.UEFA, code: "FR", abbreviation: "FRA", fifaRanking: 3 },
  "Inglaterra": { confederation: CONFEDERATIONS.UEFA, code: "GB", abbreviation: "ENG", fifaRanking: 4 },
  "Brasil": { confederation: CONFEDERATIONS.CONMEBOL, code: "BR", abbreviation: "BRA", fifaRanking: 5 },
  "Portugal": { confederation: CONFEDERATIONS.UEFA, code: "PT", abbreviation: "POR", fifaRanking: 6 },
  "Países Bajos": { confederation: CONFEDERATIONS.UEFA, code: "NL", abbreviation: "NED", fifaRanking: 7 },
  "Bélgica": { confederation: CONFEDERATIONS.UEFA, code: "BE", abbreviation: "BEL", fifaRanking: 8 },
  "Alemania": { confederation: CONFEDERATIONS.UEFA, code: "DE", abbreviation: "GER", fifaRanking: 9 },
  
  // POT 2
  "Croacia": { confederation: CONFEDERATIONS.UEFA, code: "HR", abbreviation: "CRO" },
  "Marruecos": { confederation: CONFEDERATIONS.CAF, code: "MA", abbreviation: "MAR" },
  "Colombia": { confederation: CONFEDERATIONS.CONMEBOL, code: "CO", abbreviation: "COL" },
  "Uruguay": { confederation: CONFEDERATIONS.CONMEBOL, code: "UY", abbreviation: "URU" },
  "Suiza": { confederation: CONFEDERATIONS.UEFA, code: "CH", abbreviation: "SUI" },
  "Japón": { confederation: CONFEDERATIONS.AFC, code: "JP", abbreviation: "JPN" },
  "Senegal": { confederation: CONFEDERATIONS.CAF, code: "SN", abbreviation: "SEN" },
  "Irán": { confederation: CONFEDERATIONS.AFC, code: "IR", abbreviation: "IRN" },
  "Corea del Sur": { confederation: CONFEDERATIONS.AFC, code: "KR", abbreviation: "KOR" },
  "Ecuador": { confederation: CONFEDERATIONS.CONMEBOL, code: "EC", abbreviation: "ECU" },
  "Austria": { confederation: CONFEDERATIONS.UEFA, code: "AT", abbreviation: "AUT" },
  "Australia": { confederation: CONFEDERATIONS.AFC, code: "AU", abbreviation: "AUS" },
  
  // POT 3
  "Noruega": { confederation: CONFEDERATIONS.UEFA, code: "NO", abbreviation: "NOR" },
  "Panamá": { confederation: CONFEDERATIONS.CONCACAF, code: "PA", abbreviation: "PAN" },
  "Egipto": { confederation: CONFEDERATIONS.CAF, code: "EG", abbreviation: "EGY" },
  "Argelia": { confederation: CONFEDERATIONS.CAF, code: "DZ", abbreviation: "ALG" },
  "Escocia": { confederation: CONFEDERATIONS.UEFA, code: "GB", abbreviation: "SCO", isPlayoff: true },
  "Paraguay": { confederation: CONFEDERATIONS.CONMEBOL, code: "PY", abbreviation: "PAR" },
  "Túnez": { confederation: CONFEDERATIONS.CAF, code: "TN", abbreviation: "TUN" },
  "Costa de Marfil": { confederation: CONFEDERATIONS.CAF, code: "CI", abbreviation: "CIV" },
  "Uzbekistán": { confederation: CONFEDERATIONS.AFC, code: "UZ", abbreviation: "UZB" },
  "Qatar": { confederation: CONFEDERATIONS.AFC, code: "QA", abbreviation: "QAT" },
  "Arabia Saudita": { confederation: CONFEDERATIONS.AFC, code: "SA", abbreviation: "KSA" },
  "Sudáfrica": { confederation: CONFEDERATIONS.CAF, code: "ZA", abbreviation: "RSA" },
  
  // POT 4
  "Jordania": { confederation: CONFEDERATIONS.AFC, code: "JO", abbreviation: "JOR" },
  "Cabo Verde": { confederation: CONFEDERATIONS.CAF, code: "CV", abbreviation: "CPV" },
  "Ghana": { confederation: CONFEDERATIONS.CAF, code: "GH", abbreviation: "GHA" },
  "Curazao": { confederation: CONFEDERATIONS.CONCACAF, code: "CW", abbreviation: "CUW" },
  "Haití": { confederation: CONFEDERATIONS.CONCACAF, code: "HT", abbreviation: "HAI" },
  "Nueva Zelanda": { confederation: CONFEDERATIONS.OFC, code: "NZ", abbreviation: "NZL" },
  
  // UEFA PLAYOFFS (Pot 4) - generic codes
  "UEFA A": { confederation: CONFEDERATIONS.UEFA, code: "EU", abbreviation: "EUA", isPlayoff: true, playoffGroup: "UEFA_A" },
  "UEFA B": { confederation: CONFEDERATIONS.UEFA, code: "EU", abbreviation: "EUB", isPlayoff: true, playoffGroup: "UEFA_B" },
  "UEFA C": { confederation: CONFEDERATIONS.UEFA, code: "EU", abbreviation: "EUC", isPlayoff: true, playoffGroup: "UEFA_C" },
  "UEFA D": { confederation: CONFEDERATIONS.UEFA, code: "EU", abbreviation: "EUD", isPlayoff: true, playoffGroup: "UEFA_D" },
  
  // INTERNATIONAL PLAYOFFS (Pot 4)
  "FIFA 1": { 
    confederation: CONFEDERATIONS.INTER, 
    code: "FIFA",
    abbreviation: "FIFA1",
    isPlayoff: true, 
    playoffGroup: "FIFA_1"
  },
  "FIFA 2": { 
    confederation: CONFEDERATIONS.INTER, 
    code: "FIFA",
    abbreviation: "FIFA2",
    isPlayoff: true, 
    playoffGroup: "FIFA_2"
  }
}

const createTeam = (name: string): Team => {
  const teamData = TEAMS_CONFEDERATION_MAP[name] || { 
    confederation: CONFEDERATIONS.INTER,
    code: "XX",
    abbreviation: "XXX"
  }
  return {
    name,
    confederation: teamData.confederation,
    code: teamData.code,
    abbreviation: teamData.abbreviation,
    isHost: teamData.isHost,
    fifaRanking: teamData.fifaRanking,
    isPlayoff: teamData.isPlayoff,
    playoffGroup: teamData.playoffGroup
  }
}

export const TEAMS_BY_SEEDING: Record<string, Team[]> = {
  seed1: [
    "Estados Unidos",
    "México",
    "Canadá",
    "España",
    "Argentina",
    "Francia",
    "Inglaterra",
    "Brasil",
    "Portugal",
    "Países Bajos",
    "Bélgica",
    "Alemania"
  ].map(createTeam),

  seed2: [
    "Croacia",
    "Marruecos",
    "Colombia",
    "Uruguay",
    "Suiza",
    "Japón",
    "Senegal",
    "Irán",
    "Corea del Sur",
    "Ecuador",
    "Austria",
    "Australia"
  ].map(createTeam),

  seed3: [
    "Noruega",
    "Panamá",
    "Egipto",
    "Argelia",
    "Escocia",
    "Paraguay",
    "Túnez",
    "Costa de Marfil",
    "Uzbekistán",
    "Qatar",
    "Arabia Saudita",
    "Sudáfrica"
  ].map(createTeam),

  seed4: [
    "Jordania",
    "Cabo Verde",
    "Ghana",
    "Curazao",
    "Haití",
    "Nueva Zelanda",
    "UEFA A",
    "UEFA B",
    "UEFA C",
    "UEFA D",
    "FIFA 1",
    "FIFA 2"
  ].map(createTeam),
}

export const ALL_TEAMS = [
  ...TEAMS_BY_SEEDING.seed1,
  ...TEAMS_BY_SEEDING.seed2,
  ...TEAMS_BY_SEEDING.seed3,
  ...TEAMS_BY_SEEDING.seed4
];

export function getTeamAbbreviation(teamName: string): string {
  const team = ALL_TEAMS.find(t => t.name === teamName)
  return team?.abbreviation || "XXX"
}

// (API de FlagCDN)
export function getFlagUrl(code: string, size: 'w20' | 'w40' | 'w80' = 'w40'): string {
  if (code === "EU") return `https://flagcdn.com/${size}/eu.png`; 
  if (code === "FIFA") return `https://flagcdn.com/${size}/un.png`; 
  if (code === "XX") return `https://flagcdn.com/${size}/un.png`; 
  
  return `https://flagcdn.com/${size}/${code.toLowerCase()}.png`;
}

export function getTeamInfo(teamName: string): Team | undefined {
  return ALL_TEAMS.find(team => team.name === teamName);
}

export function getCountryCode(teamName: string): string {
  const team = getTeamInfo(teamName);
  return team?.code || "XX";
}

export const GROUPS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]

export const KNOCKOUT_MATCHES = {
  "16_finals": [
    { id: 73, name: "2º Grupo A v 2º Grupo B", date: "Dom, 28 de junio", stadium: "Los Angeles Stadium" },
    { id: 74, name: "1º Grupo E v 3º Grupo A/B/C/D/F", date: "Lun, 29 de junio", stadium: "Boston Stadium" },
    { id: 75, name: "1º Grupo F v 2º Grupo C", date: "Lun, 29 de junio", stadium: "Estadio Monterrey" },
    { id: 76, name: "1º Grupo C v 2º Grupo F", date: "Lun, 29 de junio", stadium: "Houston Stadium" },
    {
      id: 77,
      name: "1º Grupo I v 3º Grupo C/D/F/G/H",
      date: "Mar, 30 de junio",
      stadium: "New York New Jersey Stadium",
    },
    { id: 78, name: "2º Grupo E v 2º Grupo I", date: "Mar, 30 de junio", stadium: "Dallas Stadium" },
    { id: 79, name: "1º Grupo A v 3º Grupo C/E/F/H/I", date: "Mar, 30 de junio", stadium: "Estadio Ciudad de México" },
    { id: 80, name: "1º Grupo L v 3º Grupo E/H/I/J/K", date: "Mié, 1 de julio", stadium: "Atlanta Stadium" },
    {
      id: 81,
      name: "1º Grupo D v 3º Grupo B/E/F/I/J",
      date: "Mié, 1 de julio",
      stadium: "San Francisco Bay Area Stadium",
    },
    { id: 82, name: "1º Grupo G v 3º Grupo A/E/H/I/J", date: "Mié, 1 de julio", stadium: "Seattle Stadium" },
    { id: 83, name: "2º Grupo K v 2º Grupo L", date: "Jue, 2 de julio", stadium: "Toronto Stadium" },
    { id: 84, name: "1º Grupo H v 2º Grupo J", date: "Jue, 2 de julio", stadium: "Los Angeles Stadium" },
    { id: 85, name: "1º Grupo B v 3º Grupo E/F/G/I/J", date: "Jue, 2 de julio", stadium: "BC Place Vancouver" },
    { id: 86, name: "1º Grupo J v 2º Grupo H", date: "Vie, 3 de julio", stadium: "Miami Stadium" },
    { id: 87, name: "1º Grupo K v 3º Grupo D/E/I/J/L", date: "Vie, 3 de julio", stadium: "Kansas City Stadium" },
    { id: 88, name: "2º Grupo D v 2º Grupo G", date: "Vie, 3 de julio", stadium: "Dallas Stadium" },
  ],
  octavos: [
    { id: 89, teams: ["p74", "p77"], stadium: "Philadelphia Stadium", date: "Sab, 4 de julio" },
    { id: 90, teams: ["p73", "p75"], stadium: "Houston Stadium", date: "Sab, 4 de julio" },
    { id: 91, teams: ["p76", "p78"], stadium: "New York New Jersey Stadium", date: "Dom, 5 de julio" },
    { id: 92, teams: ["p79", "p80"], stadium: "Estadio Azteca Ciudad de México", date: "Dom, 5 de julio" },
    { id: 93, teams: ["p83", "p84"], stadium: "Dallas Stadium", date: "Lun, 6 de julio" },
    { id: 94, teams: ["p81", "p82"], stadium: "Seattle Stadium", date: "Lun, 6 de julio" },
    { id: 95, teams: ["p86", "p88"], stadium: "Atlanta Stadium", date: "Mar, 7 de julio" },
    { id: 96, teams: ["p85", "p87"], stadium: "BC Place Vancouver", date: "Mar, 7 de julio" },
  ],
  cuartos: [
    { id: 97, teams: ["p89", "p90"], stadium: "Boston Stadium", date: "Jue, 9 de julio" },
    { id: 98, teams: ["p93", "p94"], stadium: "Los Angeles Stadium", date: "Vie, 10 de julio" },
    { id: 99, teams: ["p91", "p92"], stadium: "Miami Stadium", date: "Sab, 11 de julio" },
    { id: 100, teams: ["p95", "p96"], stadium: "Kansas City Stadium", date: "Sab, 11 de julio" },
  ],
  semifinales: [
    { id: 101, teams: ["p97", "p98"], stadium: "Dallas Stadium", date: "Mar, 14 de julio" },
    { id: 102, teams: ["p99", "p100"], stadium: "Atlanta Stadium", date: "Mié, 15 de julio" },
  ],
  final: {
    id: 103,
    teams: ["p101", "p102"],
    stadium: "Metlife Stadium",
    date: "Dom, 20 de julio",
  },
}

export interface PlayoffOption {
  name: string
  code: string
  abbreviation: string 
  confederation: string
  isPlaceholder?: boolean
}

export const PLAYOFF_OPTIONS: Record<string, PlayoffOption[]> = {
  UEFA_A: [
    { name: "Ganador UEFA A", code: "EU", abbreviation: "EUA", confederation: CONFEDERATIONS.UEFA, isPlaceholder: true },
    { name: "Bosnia y Herzegovina", code: "BA", abbreviation: "BIH", confederation: CONFEDERATIONS.UEFA },
    { name: "Italia", code: "IT", abbreviation: "ITA", confederation: CONFEDERATIONS.UEFA },
    { name: "Irlanda del Norte", code: "GB", abbreviation: "NIR", confederation: CONFEDERATIONS.UEFA },
    { name: "Gales", code: "GB", abbreviation: "WAL", confederation: CONFEDERATIONS.UEFA }
  ],
  UEFA_B: [
    { name: "Ganador UEFA B", code: "EU", abbreviation: "EUB", confederation: CONFEDERATIONS.UEFA, isPlaceholder: true },
    { name: "Albania", code: "AL", abbreviation: "ALB", confederation: CONFEDERATIONS.UEFA },
    { name: "Polonia", code: "PL", abbreviation: "POL", confederation: CONFEDERATIONS.UEFA },
    { name: "Suecia", code: "SE", abbreviation: "SWE", confederation: CONFEDERATIONS.UEFA },
    { name: "Ucrania", code: "UA", abbreviation: "UKR", confederation: CONFEDERATIONS.UEFA }
  ],
  UEFA_C: [
    { name: "Ganador UEFA C", code: "EU", abbreviation: "EUC", confederation: CONFEDERATIONS.UEFA, isPlaceholder: true },
    { name: "Kosovo", code: "XK", abbreviation: "KOS", confederation: CONFEDERATIONS.UEFA },
    { name: "Rumanía", code: "RO", abbreviation: "ROU", confederation: CONFEDERATIONS.UEFA },
    { name: "Eslovaquia", code: "SK", abbreviation: "SVK", confederation: CONFEDERATIONS.UEFA },
    { name: "Turquía", code: "TR", abbreviation: "TUR", confederation: CONFEDERATIONS.UEFA }
  ],
  UEFA_D: [
    { name: "Ganador UEFA D", code: "EU", abbreviation: "EUD", confederation: CONFEDERATIONS.UEFA, isPlaceholder: true },
    { name: "Chequia", code: "CZ", abbreviation: "CZE", confederation: CONFEDERATIONS.UEFA },
    { name: "Dinamarca", code: "DK", abbreviation: "DEN", confederation: CONFEDERATIONS.UEFA },
    { name: "Macedonia del Norte", code: "MK", abbreviation: "MKD", confederation: CONFEDERATIONS.UEFA },
    { name: "República de Irlanda", code: "IE", abbreviation: "IRL", confederation: CONFEDERATIONS.UEFA }
  ],
  FIFA_1: [
    { name: "Ganador FIFA 1", code: "FIFA", abbreviation: "FIFA1", confederation: CONFEDERATIONS.INTER, isPlaceholder: true },
    { name: "R.D del Congo", code: "CD", abbreviation: "COD", confederation: CONFEDERATIONS.CAF },
    { name: "Jamaica", code: "JM", abbreviation: "JAM", confederation: CONFEDERATIONS.CONCACAF },
    { name: "Nueva Caledonia", code: "NC", abbreviation: "NCL", confederation: CONFEDERATIONS.OFC }
  ],
  FIFA_2: [
    { name: "Ganador FIFA 2", code: "FIFA", abbreviation: "FIFA2", confederation: CONFEDERATIONS.INTER, isPlaceholder: true },
    { name: "Bolivia", code: "BO", abbreviation: "BOL", confederation: CONFEDERATIONS.CONMEBOL },
    { name: "Irak", code: "IQ", abbreviation: "IRQ", confederation: CONFEDERATIONS.AFC },
    { name: "Surinam", code: "SR", abbreviation: "SUR", confederation: CONFEDERATIONS.CONCACAF }
  ]
} as const

export function getDynamicAbbreviation(teamName: string, playoffSelections?: Record<string, string>): string {
  const team = getTeamInfo(teamName)
  if (team?.abbreviation) return team.abbreviation
  
  if (playoffSelections) {
    for (const [group, options] of Object.entries(PLAYOFF_OPTIONS)) {
      const placeholder = options.find(opt => opt.isPlaceholder && opt.name === teamName)
      if (placeholder) {
        const selectedTeamName = playoffSelections[group]
        if (selectedTeamName && selectedTeamName !== placeholder.name) {
          const selectedOption = options.find(opt => opt.name === selectedTeamName)
          if (selectedOption?.abbreviation) return selectedOption.abbreviation
        }
        return placeholder.abbreviation
      }
    }
    
    for (const [group, selectedTeamName] of Object.entries(playoffSelections)) {
      if (selectedTeamName === teamName) {
        const options = PLAYOFF_OPTIONS[group as keyof typeof PLAYOFF_OPTIONS]
        if (options) {
          const selectedOption = options.find(opt => opt.name === selectedTeamName)
          if (selectedOption?.abbreviation) return selectedOption.abbreviation
        }
      }
    }
  }
  
  for (const options of Object.values(PLAYOFF_OPTIONS)) {
    const teamOption = options.find(opt => opt.name === teamName)
    if (teamOption?.abbreviation) return teamOption.abbreviation
  }
  
  return "XXX"
}

export function getPlayoffTeam(playoffGroup: string, selectedOption?: string): Team | undefined {
  if (!selectedOption) return undefined
  
  const options = PLAYOFF_OPTIONS[playoffGroup as keyof typeof PLAYOFF_OPTIONS]
  if (!options) return undefined
  
  return options.find(team => team.name === selectedOption)
}

export function getPlayoffOptions(playoffGroup: string): PlayoffOption[] {
  return PLAYOFF_OPTIONS[playoffGroup as keyof typeof PLAYOFF_OPTIONS] || []
}

export function getDynamicCountryCode(teamName: string, playoffSelections?: Record<string, string>): string {
  const team = getTeamInfo(teamName)
  if (team?.code) return team.code
  
  if (playoffSelections) {
    for (const [group, options] of Object.entries(PLAYOFF_OPTIONS)) {
      const placeholder = options.find(opt => opt.isPlaceholder && opt.name === teamName)
      if (placeholder) {
        const selectedTeamName = playoffSelections[group]
        if (selectedTeamName && selectedTeamName !== placeholder.name) {
          const selectedOption = options.find(opt => opt.name === selectedTeamName)
          if (selectedOption?.code) return selectedOption.code
        }
        return placeholder.code
      }
    }
    
    for (const [group, selectedTeamName] of Object.entries(playoffSelections)) {
      if (selectedTeamName === teamName) {
        const options = PLAYOFF_OPTIONS[group as keyof typeof PLAYOFF_OPTIONS]
        if (options) {
          const selectedOption = options.find(opt => opt.name === selectedTeamName)
          if (selectedOption?.code) return selectedOption.code
        }
      }
    }
  }
  
  for (const options of Object.values(PLAYOFF_OPTIONS)) {
    const teamOption = options.find(opt => opt.name === teamName)
    if (teamOption?.code) return teamOption.code
  }
  
  return "XX"
}
