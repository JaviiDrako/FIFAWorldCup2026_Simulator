export const TEAMS_BY_SEEDING = {
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
  ],

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
  ],

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
  ],

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
  ],
}

export const GROUPS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]

export const KNOCKOUT_MATCHES = {
  "16_finals": [
    { id: 73, name: "2º Grupo A v 2º Grupo B", date: "Dom, 28 de junio", stadium: "Los Angeles Stadium" },
    { id: 74, name: "1º Grupo E v 3º Grupo A/B/C/D/F", date: "Lun, 29 de junio", stadium: "Boston Stadium" },
    { id: 75, name: "1º Grupo F v 2º Grupo C", date: "Lun, 29 de junio", stadium: "Estadio Monterrey" },
    { id: 76, name: "1º Grupo E v 2º Grupo F", date: "Lun, 29 de junio", stadium: "Houston Stadium" },
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

