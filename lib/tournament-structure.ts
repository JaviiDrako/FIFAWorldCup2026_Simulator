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

// Mapping of dieciseisavos de final with proper group positions
export const KNOCKOUT_MATCHES_CONFIG = [
  // Round 16 matches (Dieciseisavos)
  {
    id: 73,
    round: "round16",
    date: "Domingo, 28 de junio",
    stadium: "Los Angeles Stadium",
    groupMatch: ["B", 2, "A", 2], // 2º Grupo A v 2º Grupo B
  },
  {
    id: 74,
    round: "round16",
    date: "Lunes, 29 de junio",
    stadium: "Boston Stadium",
    groupMatch: ["E", 1, "A/B/C/D/F", 3], // 1º Grupo E v 3º Grupo A/B/C/D/F
  },
  {
    id: 75,
    round: "round16",
    date: "Lunes, 29 de junio",
    stadium: "Estadio Monterrey",
    groupMatch: ["F", 1, "C", 2], // 1º Grupo F v 2º Grupo C
  },
  {
    id: 76,
    round: "round16",
    date: "Lunes, 29 de junio",
    stadium: "Houston Stadium",
    groupMatch: ["E", 1, "F", 2], // 1º Grupo E v 2º Grupo F (Note: error in original, should be F not E again)
  },
  {
    id: 77,
    round: "round16",
    date: "Martes, 30 de junio",
    stadium: "New York New Jersey Stadium",
    groupMatch: ["I", 1, "C/D/F/G/H", 3], // 1º Grupo I v 3º Grupo C/D/F/G/H
  },
  {
    id: 78,
    round: "round16",
    date: "Martes, 30 de junio",
    stadium: "Dallas Stadium",
    groupMatch: ["E", 2, "I", 2], // 2º Grupo E v 2º Grupo I
  },
  {
    id: 79,
    round: "round16",
    date: "Martes, 30 de junio",
    stadium: "Estadio Ciudad de México",
    groupMatch: ["A", 1, "C/E/F/H/I", 3], // 1º Grupo A v 3º Grupo C/E/F/H/I
  },
  {
    id: 80,
    round: "round16",
    date: "Miércoles, 1 de julio",
    stadium: "Atlanta Stadium",
    groupMatch: ["L", 1, "E/H/I/J/K", 3], // 1º Grupo L v 3º Grupo E/H/I/J/K
  },
  {
    id: 81,
    round: "round16",
    date: "Miércoles, 1 de julio",
    stadium: "San Francisco Bay Area Stadium",
    groupMatch: ["D", 1, "B/E/F/I/J", 3], // 1º Grupo D v 3º Grupo B/E/F/I/J
  },
  {
    id: 82,
    round: "round16",
    date: "Miércoles, 1 de julio",
    stadium: "Seattle Stadium",
    groupMatch: ["G", 1, "A/E/H/I/J", 3], // 1º Grupo G v 3º Grupo A/E/H/I/J
  },
  {
    id: 83,
    round: "round16",
    date: "Jueves, 2 de julio",
    stadium: "Toronto Stadium",
    groupMatch: ["K", 2, "L", 2], // 2º Grupo K v 2º Grupo L
  },
  {
    id: 84,
    round: "round16",
    date: "Jueves, 2 de julio",
    stadium: "Los Angeles Stadium",
    groupMatch: ["H", 1, "J", 2], // 1º Grupo H v 2º Grupo J
  },
  {
    id: 85,
    round: "round16",
    date: "Jueves, 2 de julio",
    stadium: "BC Place Vancouver",
    groupMatch: ["B", 1, "E/F/G/I/J", 3], // 1º Grupo B v 3º Grupo E/F/G/I/J
  },
  {
    id: 86,
    round: "round16",
    date: "Viernes, 3 de julio",
    stadium: "Miami Stadium",
    groupMatch: ["J", 1, "H", 2], // 1º Grupo J v 2º Grupo H
  },
  {
    id: 87,
    round: "round16",
    date: "Viernes, 3 de julio",
    stadium: "Kansas City Stadium",
    groupMatch: ["K", 1, "D/E/I/J/L", 3], // 1º Grupo K v 3º Grupo D/E/I/J/L
  },
  {
    id: 88,
    round: "round16",
    date: "Viernes, 3 de julio",
    stadium: "Dallas Stadium",
    groupMatch: ["D", 2, "G", 2], // 2º Grupo D v 2º Grupo G
  },
]

// Octavos structure - Ganador partido 73 v Ganador partido 75, etc.
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
