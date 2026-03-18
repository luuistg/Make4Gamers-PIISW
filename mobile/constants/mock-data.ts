export type MockGame = {
  id: string
  title: string
  genre: string
  rating: number
  players: number
  tag: string
  blurb: string
  accent: [string, string]
}

export type FeaturePanel = {
  id: string
  eyebrow: string
  title: string
  description: string
  accent: [string, string]
  align: 'left' | 'right'
}

export type RankingEntry = {
  id: string
  name: string
  points: number
  streak: string
  badge: string
}

export const featurePanels: FeaturePanel[] = [
  {
    id: 'rise',
    eyebrow: 'Sube desde abajo',
    title: 'Empieza con una base clara y una interfaz que empuja a competir.',
    description:
      'El objetivo de esta maqueta es clavar el tono visual de la web en movil: oscuro, intenso y con acentos que marcan progreso.',
    accent: ['#312e81', '#0f172a'],
    align: 'right',
  },
  {
    id: 'duel',
    eyebrow: 'Encuentra tu ritmo',
    title: 'Catalogo, ranking y cuenta nacen ya con la misma identidad.',
    description:
      'Todavia no conectamos nada al backend. Todo lo que ves aqui es base visual, lista para crecer sin rehacer el front.',
    accent: ['#365314', '#0f172a'],
    align: 'left',
  },
  {
    id: 'peak',
    eyebrow: 'Llega arriba',
    title: 'Cada pantalla ya habla el idioma de Made4Gamers.',
    description:
      'Jerarquia fuerte, tarjetas con profundidad, gradientes atmosfericos y una estructura pensada para sumar mas vistas luego.',
    accent: ['#4f46e5', '#701a75'],
    align: 'right',
  },
]

export const games: MockGame[] = [
  {
    id: 'valor-arena',
    title: 'Valor Arena',
    genre: 'Action',
    rating: 4.9,
    players: 12840,
    tag: 'ARENA',
    blurb: 'Duelo rapido, precision y partidas cortas que piden revancha.',
    accent: ['#4338ca', '#0f172a'],
  },
  {
    id: 'neon-rush',
    title: 'Neon Rush',
    genre: 'Arcade',
    rating: 4.7,
    players: 9340,
    tag: 'ARCADE',
    blurb: 'Velocidad, luces y un bucle de progreso perfecto para movil.',
    accent: ['#0f766e', '#1d4ed8'],
  },
  {
    id: 'kingdom-relic',
    title: 'Kingdom Relic',
    genre: 'RPG',
    rating: 4.8,
    players: 6420,
    tag: 'RPG',
    blurb: 'Explora, mejora tu build y escala posiciones con calma.',
    accent: ['#4d7c0f', '#14532d'],
  },
  {
    id: 'puzzle-ops',
    title: 'Puzzle Ops',
    genre: 'Puzzle',
    rating: 4.6,
    players: 5180,
    tag: 'PUZZLE',
    blurb: 'Retos compactos con una capa competitiva facil de entender.',
    accent: ['#7c3aed', '#1e1b4b'],
  },
  {
    id: 'mecha-league',
    title: 'Mecha League',
    genre: 'Strategy',
    rating: 4.5,
    players: 4120,
    tag: 'TACTIC',
    blurb: 'Toma decisiones lentas, gana ventaja y domina la tabla.',
    accent: ['#be123c', '#1e293b'],
  },
  {
    id: 'sky-forge',
    title: 'Sky Forge',
    genre: 'Adventure',
    rating: 4.4,
    players: 3560,
    tag: 'QUEST',
    blurb: 'Una aventura ligera para equilibrar el tono competitivo.',
    accent: ['#2563eb', '#0f172a'],
  },
]

export const categories = ['All', 'Action', 'Arcade', 'RPG', 'Puzzle', 'Strategy', 'Adventure']

export const ranking: RankingEntry[] = [
  { id: '1', name: 'LunaPulse', points: 18240, streak: '12 victorias', badge: 'S+' },
  { id: '2', name: 'NeoMaverick', points: 17510, streak: '9 victorias', badge: 'S' },
  { id: '3', name: 'PixelRiot', points: 16980, streak: '7 victorias', badge: 'A+' },
  { id: '4', name: 'EchoRanger', points: 16120, streak: '5 victorias', badge: 'A' },
  { id: '5', name: 'ZeroLag', points: 15440, streak: '4 victorias', badge: 'A' },
  { id: '6', name: 'NovaTilt', points: 14990, streak: '3 victorias', badge: 'B+' },
]

export const accountHighlights = [
  {
    id: 'visual',
    title: 'Frontend alpha',
    description: 'La base visual de movil ya vive separada del backend y lista para crecer.',
  },
  {
    id: 'tokens',
    title: 'Sistema de diseno',
    description: 'Colores, tarjetas, chips y pantallas comparten un mismo lenguaje desde hoy.',
  },
  {
    id: 'next',
    title: 'Proximo paso',
    description: 'Cuando quieras, conectamos auth real, datos reales y detalle de juego encima de esta estructura.',
  },
]
