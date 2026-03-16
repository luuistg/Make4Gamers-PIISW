export type SlotButton = {
  textKey: string
  onClick: () => void
}

export type SlotEvent = {
  title: string
  imageSrc: string
  imageAlt?: string
  button?: SlotButton
}

export const slots: SlotEvent[] = [
  {
    title: '16 - Bit',
    imageSrc: '/assets/emblems/nintendoEmblem.png',
    imageAlt: 'Tier 1',
    button: {
      textKey: 'home.ranks.firstButton',
      onClick: () => {},
    },
  },
  {
    title: 'Polygon Zero',
    imageSrc: '/assets/emblems/ps1Emblem.png',
    imageAlt: 'Tier 2',
  },
  {
    title: 'Cell Core',
    imageSrc: '/assets/emblems/ps3Emblem.png',
    imageAlt: 'Tier 4',
  },
  {
    title: 'High Definition',
    imageSrc: '/assets/emblems/ps4Emblem.png',
    imageAlt: 'Tier 5',
  },
  {
    title: 'Ray-Tracing',
    imageSrc: '/assets/emblems/ps5Emblem.png',
    imageAlt: 'Tier 6',
  },
]