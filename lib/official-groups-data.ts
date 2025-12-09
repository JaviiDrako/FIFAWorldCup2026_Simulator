export interface SimpleTeam {
  name: string
  confederation: string
  isHost?: boolean
  isPlayoff?: boolean
}

export const OFFICIAL_GROUPS_2026_SIMPLE: Record<string, SimpleTeam[]> = {
  A: [
    { name: "México", confederation: "CONCACAF", isHost: true },
    { name: "Sudáfrica", confederation: "CAF" },
    { name: "Corea del Sur", confederation: "AFC" },
    { name: "Ganador UEFA D", confederation: "UEFA", isPlayoff: true }
  ],
  B: [
    { name: "Canadá", confederation: "CONCACAF", isHost: true },
    { name: "Ganador UEFA A", confederation: "UEFA", isPlayoff: true },
    { name: "Qatar", confederation: "AFC" },
    { name: "Suiza", confederation: "UEFA" }
  ],
  C: [
    { name: "Brasil", confederation: "CONMEBOL" },
    { name: "Marruecos", confederation: "CAF" },
    { name: "Haití", confederation: "CONCACAF" },
    { name: "Escocia", confederation: "UEFA" }
  ],
  D: [
    { name: "Estados Unidos", confederation: "CONCACAF", isHost: true },
    { name: "Paraguay", confederation: "CONMEBOL" },
    { name: "Australia", confederation: "AFC" },
    { name: "Ganador UEFA C", confederation: "UEFA", isPlayoff: true }
  ],
  E: [
    { name: "Alemania", confederation: "UEFA" },
    { name: "Curazao", confederation: "CONCACAF" },
    { name: "Costa de Marfil", confederation: "CAF" },
    { name: "Ecuador", confederation: "CONMEBOL" }
  ],
  F: [
    { name: "Países Bajos", confederation: "UEFA" },
    { name: "Japón", confederation: "AFC" },
    { name: "Ganador UEFA B", confederation: "UEFA", isPlayoff: true },
    { name: "Túnez", confederation: "CAF" }
  ],
  G: [
    { name: "Bélgica", confederation: "UEFA" },
    { name: "Egipto", confederation: "CAF" },
    { name: "Irán", confederation: "AFC" },
    { name: "Nueva Zelanda", confederation: "OFC" }
  ],
  H: [
    { name: "España", confederation: "UEFA" },
    { name: "Cabo Verde", confederation: "CAF" },
    { name: "Arabia Saudita", confederation: "AFC" },
    { name: "Uruguay", confederation: "CONMEBOL" }
  ],
  I: [
    { name: "Francia", confederation: "UEFA" },
    { name: "Senegal", confederation: "CAF" },
    { name: "Ganador FIFA 2", confederation: "INTER", isPlayoff: true },
    { name: "Noruega", confederation: "UEFA" }
  ],
  J: [
    { name: "Argentina", confederation: "CONMEBOL" },
    { name: "Argelia", confederation: "CAF" },
    { name: "Austria", confederation: "UEFA" },
    { name: "Jordania", confederation: "AFC" }
  ],
  K: [
    { name: "Portugal", confederation: "UEFA" },
    { name: "Ganador FIFA 1", confederation: "INTER", isPlayoff: true },
    { name: "Uzbekistán", confederation: "AFC" },
    { name: "Colombia", confederation: "CONMEBOL" }
  ],
  L: [
    { name: "Inglaterra", confederation: "UEFA" },
    { name: "Croacia", confederation: "UEFA" },
    { name: "Ghana", confederation: "CAF" },
    { name: "Panamá", confederation: "CONCACAF" }
  ]
}
