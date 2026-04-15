export type FeaturePanel = {
  id: string
  eyebrow: string
  title: string
  description: string
  accent: [string, string]
  image: string
  align: 'left' | 'right'
  variant?: 'standard' | 'cover'
  highlights?: string[]
  stats?: {
    label: string
    value: string
  }[]
}

export const featurePanels: FeaturePanel[] = [
  {
    id: 'cover-story',
    eyebrow: 'Portada principal',
    title: 'Pilot Adventure empuja la portada con mejor retencion, sesiones rapidas y mas entradas desde mobile.',
    description:
      'El tiron no viene solo del nombre: esta build esta funcionando bien en partidas cortas, genera reintentos y empieza a colocarse como referencia del catalogo jugable.',
    accent: ['rgba(49, 46, 129, 0.12)', 'rgba(2, 6, 23, 0.9)'],
    image:
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1400&q=80',
    align: 'left',
    variant: 'cover',
    highlights: ['Arcade', 'Adventure', 'Mobile traffic'],
    stats: [
      { label: 'Reintentos', value: '+38%' },
      { label: 'Sesiones', value: '4.2 min' },
      { label: 'Radar', value: 'Top portada' },
    ],
  },
  {
    id: 'ranking-focus',
    eyebrow: 'Ranking',
    title: 'La zona alta aprieta: el top 10 se mueve con diferencias minimas antes del cierre semanal.',
    description:
      'Los jugadores mejor posicionados estan apurando sus mejores runs mientras la temporada entra en su tramo mas competitivo.',
    accent: ['rgba(67, 56, 202, 0.16)', 'rgba(15, 23, 42, 0.84)'],
    image:
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    align: 'left',
  },
  {
    id: 'studio-radar',
    eyebrow: 'Studios',
    title: 'Nuevos estudios entran en radar con action, puzzle y arcade como generos mas activos.',
    description:
      'La portada gana variedad con propuestas breves, competitivas y pensadas para volver cada dia.',
    accent: ['rgba(79, 70, 229, 0.14)', 'rgba(17, 24, 39, 0.86)'],
    image:
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    align: 'right',
  },
  {
    id: 'weekend-watch',
    eyebrow: 'Agenda',
    title: 'El fin de semana viene cargado con score attack, ladder y retos diarios para partidas rapidas.',
    description:
      'El foco pasa a experiencias de alta repeticion, ideales para movil y para sesiones cortas entre semana.',
    accent: ['rgba(55, 48, 163, 0.14)', 'rgba(15, 23, 42, 0.86)'],
    image:
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    align: 'left',
  },
]
