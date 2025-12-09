export interface Team {
  name: string
  confederation: string
  code: string 
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
  isHost?: boolean, 
  fifaRanking?: number, 
  isPlayoff?: boolean, 
  playoffGroup?: string 
}> = {
  // POT 1 - Seeded teams (with approximate FIFA ranking) 
  "Estados Unidos": { confederation: CONFEDERATIONS.CONCACAF, code: "US", isHost: true, fifaRanking: 11 },
  "México": { confederation: CONFEDERATIONS.CONCACAF, code: "MX", isHost: true, fifaRanking: 12 },
  "Canadá": { confederation: CONFEDERATIONS.CONCACAF, code: "CA", isHost: true, fifaRanking: 37 },
  "España": { confederation: CONFEDERATIONS.UEFA, code: "ES", fifaRanking: 1 },
  "Argentina": { confederation: CONFEDERATIONS.CONMEBOL, code: "AR", fifaRanking: 2 },
  "Francia": { confederation: CONFEDERATIONS.UEFA, code: "FR", fifaRanking: 3 },
  "Inglaterra": { confederation: CONFEDERATIONS.UEFA, code: "GB", fifaRanking: 4 }, // UK usa GB
  "Brasil": { confederation: CONFEDERATIONS.CONMEBOL, code: "BR", fifaRanking: 5 },
  "Portugal": { confederation: CONFEDERATIONS.UEFA, code: "PT", fifaRanking: 6 },
  "Países Bajos": { confederation: CONFEDERATIONS.UEFA, code: "NL", fifaRanking: 7 },
  "Bélgica": { confederation: CONFEDERATIONS.UEFA, code: "BE", fifaRanking: 8 },
  "Alemania": { confederation: CONFEDERATIONS.UEFA, code: "DE", fifaRanking: 9 },
  
  // POT 2
  "Croacia": { confederation: CONFEDERATIONS.UEFA, code: "HR" },
  "Marruecos": { confederation: CONFEDERATIONS.CAF, code: "MA" },
  "Colombia": { confederation: CONFEDERATIONS.CONMEBOL, code: "CO" },
  "Uruguay": { confederation: CONFEDERATIONS.CONMEBOL, code: "UY" },
  "Suiza": { confederation: CONFEDERATIONS.UEFA, code: "CH" },
  "Japón": { confederation: CONFEDERATIONS.AFC, code: "JP" },
  "Senegal": { confederation: CONFEDERATIONS.CAF, code: "SN" },
  "Irán": { confederation: CONFEDERATIONS.AFC, code: "IR" },
  "Corea del Sur": { confederation: CONFEDERATIONS.AFC, code: "KR" },
  "Ecuador": { confederation: CONFEDERATIONS.CONMEBOL, code: "EC" },
  "Austria": { confederation: CONFEDERATIONS.UEFA, code: "AT" },
  "Australia": { confederation: CONFEDERATIONS.AFC, code: "AU" },
  
  // POT 3
  "Noruega": { confederation: CONFEDERATIONS.UEFA, code: "NO" },
  "Panamá": { confederation: CONFEDERATIONS.CONCACAF, code: "PA" },
  "Egipto": { confederation: CONFEDERATIONS.CAF, code: "EG" },
  "Argelia": { confederation: CONFEDERATIONS.CAF, code: "DZ" },
  "Escocia": { confederation: CONFEDERATIONS.UEFA, code: "GB", isPlayoff: true }, // Reino Unido
  "Paraguay": { confederation: CONFEDERATIONS.CONMEBOL, code: "PY" },
  "Túnez": { confederation: CONFEDERATIONS.CAF, code: "TN" },
  "Costa de Marfil": { confederation: CONFEDERATIONS.CAF, code: "CI" },
  "Uzbekistán": { confederation: CONFEDERATIONS.AFC, code: "UZ" },
  "Qatar": { confederation: CONFEDERATIONS.AFC, code: "QA" },
  "Arabia Saudita": { confederation: CONFEDERATIONS.AFC, code: "SA" },
  "Sudáfrica": { confederation: CONFEDERATIONS.CAF, code: "ZA" },
  
  // POT 4
  "Jordania": { confederation: CONFEDERATIONS.AFC, code: "JO" },
  "Cabo Verde": { confederation: CONFEDERATIONS.CAF, code: "CV" },
  "Ghana": { confederation: CONFEDERATIONS.CAF, code: "GH" },
  "Curazao": { confederation: CONFEDERATIONS.CONCACAF, code: "CW" },
  "Haití": { confederation: CONFEDERATIONS.CONCACAF, code: "HT" },
  "Nueva Zelanda": { confederation: CONFEDERATIONS.OFC, code: "NZ" },
  
  // UEFA PLAYOFFS (Pot 4) - generic codes
  "UEFA A": { confederation: CONFEDERATIONS.UEFA, code: "EU", isPlayoff: true, playoffGroup: "UEFA_A" },
  "UEFA B": { confederation: CONFEDERATIONS.UEFA, code: "EU", isPlayoff: true, playoffGroup: "UEFA_B" },
  "UEFA C": { confederation: CONFEDERATIONS.UEFA, code: "EU", isPlayoff: true, playoffGroup: "UEFA_C" },
  "UEFA D": { confederation: CONFEDERATIONS.UEFA, code: "EU", isPlayoff: true, playoffGroup: "UEFA_D" },
  
  // INTERNATIONAL PLAYOFFS (Pot 4)
  "FIFA 1": { 
    confederation: CONFEDERATIONS.INTER, 
    code: "FIFA",
    isPlayoff: true, 
    playoffGroup: "FIFA_1"
  },
  "FIFA 2": { 
    confederation: CONFEDERATIONS.INTER, 
    code: "FIFA",
    isPlayoff: true, 
    playoffGroup: "FIFA_2"
  }
}

const createTeam = (name: string): Team => {
  const teamData = TEAMS_CONFEDERATION_MAP[name] || { 
    confederation: CONFEDERATIONS.INTER,
    code: "XX"
  }
  return {
    name,
    confederation: teamData.confederation,
    code: teamData.code,
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
  confederation: string
  isPlaceholder?: boolean
}

export const PLAYOFF_OPTIONS: Record<string, PlayoffOption[]> = {
  UEFA_A: [
    { name: "Ganador UEFA A", code: "EU", confederation: CONFEDERATIONS.UEFA, isPlaceholder: true },
    { name: "Bosnia y Herzegovina", code: "BA", confederation: CONFEDERATIONS.UEFA },
    { name: "Italia", code: "IT", confederation: CONFEDERATIONS.UEFA },
    { name: "Irlanda del Norte", code: "GB", confederation: CONFEDERATIONS.UEFA },
    { name: "Gales", code: "GB", confederation: CONFEDERATIONS.UEFA }
  ],
  UEFA_B: [
    { name: "Ganador UEFA B", code: "EU", confederation: CONFEDERATIONS.UEFA, isPlaceholder: true },
    { name: "Albania", code: "AL", confederation: CONFEDERATIONS.UEFA },
    { name: "Polonia", code: "PL", confederation: CONFEDERATIONS.UEFA },
    { name: "Suecia", code: "SE", confederation: CONFEDERATIONS.UEFA },
    { name: "Ucrania", code: "UA", confederation: CONFEDERATIONS.UEFA }
  ],
  UEFA_C: [
    { name: "Ganador UEFA C", code: "EU", confederation: CONFEDERATIONS.UEFA, isPlaceholder: true },
    { name: "Kosovo", code: "XK", confederation: CONFEDERATIONS.UEFA },
    { name: "Rumanía", code: "RO", confederation: CONFEDERATIONS.UEFA },
    { name: "Eslovaquia", code: "SK", confederation: CONFEDERATIONS.UEFA },
    { name: "Turquía", code: "TR", confederation: CONFEDERATIONS.UEFA }
  ],
  UEFA_D: [
    { name: "Ganador UEFA D", code: "EU", confederation: CONFEDERATIONS.UEFA, isPlaceholder: true },
    { name: "Chequia", code: "CZ", confederation: CONFEDERATIONS.UEFA },
    { name: "Dinamarca", code: "DK", confederation: CONFEDERATIONS.UEFA },
    { name: "Macedonia del Norte", code: "MK", confederation: CONFEDERATIONS.UEFA },
    { name: "República de Irlanda", code: "IE", confederation: CONFEDERATIONS.UEFA }
  ],
  FIFA_1: [
    { name: "Ganador FIFA 1", code: "FIFA", confederation: CONFEDERATIONS.INTER, isPlaceholder: true },
    { name: "R.D del Congo", code: "CD", confederation: CONFEDERATIONS.CAF },
    { name: "Jamaica", code: "JM", confederation: CONFEDERATIONS.CONCACAF },
    { name: "Nueva Caledonia", code: "NC", confederation: CONFEDERATIONS.OFC }
  ],
  FIFA_2: [
    { name: "Ganador FIFA 2", code: "FIFA", confederation: CONFEDERATIONS.INTER, isPlaceholder: true },
    { name: "Bolivia", code: "BO", confederation: CONFEDERATIONS.CONMEBOL },
    { name: "Irak", code: "IQ", confederation: CONFEDERATIONS.AFC },
    { name: "Surinam", code: "SR", confederation: CONFEDERATIONS.CONCACAF }
  ]
} as const

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
