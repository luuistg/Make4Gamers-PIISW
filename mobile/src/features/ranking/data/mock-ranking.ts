export type RankingRow = {
  id: string
  name: string
  badge: string
  meta: string
  value: string
}

export type GlobalRankingEntry = RankingRow & {
  level: number
  totalXp: number
  mainGame: string
}

export type GameRankingBoard = {
  gameId: string
  gameTitle: string
  category: string
  description: string
  metricLabel: string
  resetLabel: string
  entries: RankingRow[]
}

export const globalRanking: GlobalRankingEntry[] = [
  {
    id: 'g-1',
    name: 'LunaPulse',
    level: 64,
    totalXp: 248500,
    mainGame: 'Pilot Adventure',
    badge: 'Elite S+',
    meta: 'Pilot Adventure · 18 victorias seguidas',
    value: 'Nivel 64',
  },
  {
    id: 'g-2',
    name: 'NeoMaverick',
    level: 61,
    totalXp: 231900,
    mainGame: 'Valor Arena',
    badge: 'Elite S',
    meta: 'Valor Arena · top 3 estable',
    value: 'Nivel 61',
  },
  {
    id: 'g-3',
    name: 'PixelRiot',
    level: 59,
    totalXp: 220400,
    mainGame: 'Tic Tac Toe',
    badge: 'Diamond',
    meta: 'Tic Tac Toe · 92% winrate',
    value: 'Nivel 59',
  },
  {
    id: 'g-4',
    name: 'EchoRanger',
    level: 56,
    totalXp: 207600,
    mainGame: 'Neon Rush',
    badge: 'Diamond',
    meta: 'Neon Rush · 14 podios',
    value: 'Nivel 56',
  },
  {
    id: 'g-5',
    name: 'ZeroLag',
    level: 53,
    totalXp: 194200,
    mainGame: 'GameClicker',
    badge: 'Platinum',
    meta: 'GameClicker · economia perfecta',
    value: 'Nivel 53',
  },
  {
    id: 'g-6',
    name: 'NovaTilt',
    level: 51,
    totalXp: 186850,
    mainGame: 'Kingdom Relic',
    badge: 'Platinum',
    meta: 'Kingdom Relic · ladder semanal',
    value: 'Nivel 51',
  },
  {
    id: 'g-7',
    name: 'AstraByte',
    level: 49,
    totalXp: 178440,
    mainGame: 'Pilot Adventure',
    badge: 'Gold',
    meta: 'Pilot Adventure · run limpia',
    value: 'Nivel 49',
  },
  {
    id: 'g-8',
    name: 'GlitchBloom',
    level: 47,
    totalXp: 169730,
    mainGame: 'Puzzle Ops',
    badge: 'Gold',
    meta: 'Puzzle Ops · diario completado',
    value: 'Nivel 47',
  },
]

export const gameRankings: GameRankingBoard[] = [
  {
    gameId: 'pilot-adventure',
    gameTitle: 'Pilot Adventure',
    category: 'Arcade',
    description: 'Top de runs mas estables en la aventura de la semana.',
    metricLabel: 'Mejor puntuacion',
    resetLabel: 'Reset semanal',
    entries: [
      { id: 'pa-1', name: 'LunaPulse', badge: 'S+', meta: 'Nivel 64 · 3 runs perfectas', value: '98,450 pts' },
      { id: 'pa-2', name: 'AstraByte', badge: 'S', meta: 'Nivel 49 · 0 fallos', value: '95,900 pts' },
      { id: 'pa-3', name: 'EchoRanger', badge: 'A+', meta: 'Nivel 56 · top speed', value: '94,200 pts' },
      { id: 'pa-4', name: 'VantaFox', badge: 'A+', meta: 'Nivel 45 · boss rush', value: '92,880 pts' },
      { id: 'pa-5', name: 'PixelRiot', badge: 'A', meta: 'Nivel 59 · combo limpio', value: '91,760 pts' },
    ],
  },
  {
    gameId: 'tic-tac-toe',
    gameTitle: 'Tic Tac Toe',
    category: 'Arcade',
    description: 'Clasificacion por winrate y eficiencia en partidas rapidas.',
    metricLabel: 'Winrate competitivo',
    resetLabel: 'Reset cada 14 dias',
    entries: [
      { id: 'ttt-1', name: 'PixelRiot', badge: 'S', meta: 'Nivel 59 · 68 partidas', value: '92% WR' },
      { id: 'ttt-2', name: 'ZeroLag', badge: 'A+', meta: 'Nivel 53 · 61 partidas', value: '89% WR' },
      { id: 'ttt-3', name: 'NovaTilt', badge: 'A+', meta: 'Nivel 51 · 58 partidas', value: '87% WR' },
      { id: 'ttt-4', name: 'AstraByte', badge: 'A', meta: 'Nivel 49 · 52 partidas', value: '86% WR' },
      { id: 'ttt-5', name: 'GlitchBloom', badge: 'A', meta: 'Nivel 47 · 47 partidas', value: '84% WR' },
    ],
  },
  {
    gameId: 'gameclicker',
    gameTitle: 'GameClicker',
    category: 'Idle',
    description: 'Los mejores ritmos de progresion y economia del clicker local.',
    metricLabel: 'Bits acumulados',
    resetLabel: 'Reset mensual',
    entries: [
      { id: 'gc-1', name: 'ZeroLag', badge: 'S+', meta: 'Nivel 53 · build perfecta', value: '12.8M bits' },
      { id: 'gc-2', name: 'LunaPulse', badge: 'S', meta: 'Nivel 64 · combo infinito', value: '11.9M bits' },
      { id: 'gc-3', name: 'HexaMint', badge: 'A+', meta: 'Nivel 44 · tiempo record', value: '11.1M bits' },
      { id: 'gc-4', name: 'NovaTilt', badge: 'A', meta: 'Nivel 51 · early rush', value: '10.4M bits' },
      { id: 'gc-5', name: 'EchoRanger', badge: 'A', meta: 'Nivel 56 · ruta segura', value: '9.8M bits' },
    ],
  },
  {
    gameId: 'valor-arena',
    gameTitle: 'Valor Arena',
    category: 'Action',
    description: 'Ranking centrado en puntos de temporada y regularidad en duelos.',
    metricLabel: 'Puntos de temporada',
    resetLabel: 'Reset semanal',
    entries: [
      { id: 'va-1', name: 'NeoMaverick', badge: 'S+', meta: 'Nivel 61 · 21 victorias', value: '18,240 pts' },
      { id: 'va-2', name: 'RiftSignal', badge: 'S', meta: 'Nivel 46 · top 5 constante', value: '17,980 pts' },
      { id: 'va-3', name: 'LunaPulse', badge: 'A+', meta: 'Nivel 64 · pick flexible', value: '17,440 pts' },
      { id: 'va-4', name: 'VantaFox', badge: 'A+', meta: 'Nivel 45 · cierre fuerte', value: '16,930 pts' },
      { id: 'va-5', name: 'NovaTilt', badge: 'A', meta: 'Nivel 51 · defensa solida', value: '16,500 pts' },
    ],
  },
]
