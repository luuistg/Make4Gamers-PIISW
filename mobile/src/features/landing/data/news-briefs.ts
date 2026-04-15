export type NewsBrief = {
  id: string
  tag: string
  title: string
  summary: string
  image: string
}

export const newsBriefs: NewsBrief[] = [
  {
    id: 'season-reset',
    tag: 'Temporada',
    title: 'La ladder de primavera arranca con reinicio parcial y nuevas recompensas.',
    summary:
      'El ranking competitivo abre una nueva fase con bonus cosmeticos y objetivos semanales.',
    image:
      'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'pilot-adventure',
    tag: 'En portada',
    title: 'Pilot Adventure sube posiciones tras su ultima build y entra en el foco principal.',
    summary:
      'La comunidad ha empujado el juego en sesiones moviles cortas y ya aparece entre los mas vistos.',
    image:
      'https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'studio-watch',
    tag: 'Studios',
    title: 'Tres estudios indie preparan nuevas fichas para action, puzzle y adventure.',
    summary:
      'La portada se mueve esta semana con nuevos titulos y actualizaciones de versiones publicadas.',
    image:
      'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'weekend-event',
    tag: 'Evento',
    title: 'El evento del fin de semana prioriza score attack y partidas rapidas.',
    summary:
      'Arcade, idle y puzzle lideran el calendario con retos pensados para movil y sesiones breves.',
    image:
      'https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=1200&q=80',
  },
]
