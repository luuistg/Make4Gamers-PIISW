export interface NewsItem {
  id: number;
  title: string;
  category: string;
  image: string;
}

export const newsData: NewsItem[] = [
  
  {
    id: 1,
    title: 'New Ranking system coming soon',
    category: 'Updates',
    image: '/assets/news/ranking.jpg',
  },
  {
    id: 2,
    title: 'New Game "Pilot Adventure" Released',
    category: 'Released',
    image: 'https://gfuldfbbwdjfetjfvkti.supabase.co/storage/v1/object/public/game-assets/pilot-adventure/game-thumbnail.png',
  },
  {
    id: 3,
    title: 'Controller Retro SNES:  How to get it',
    category: 'Guía',
    image: 'https://www.educ.ar/uploads/resources/images/portadanewsgame_20210621222501.jpg',
  },
  {
    id: 4,
    title: 'New Ranking system coming soon',
    category: 'Updates',
    image: '/assets/news/ranking.jpg',
  },
  {
    id: 5,
    title: 'New Game "Pilot Adventure" Released',
    category: 'Released',
    image: 'https://gfuldfbbwdjfetjfvkti.supabase.co/storage/v1/object/public/game-assets/pilot-adventure/game-thumbnail.png',
  },
  {
    id: 6,
    title: 'Controller Retro SNES:  How to get it',
    category: 'Guía',
    image: 'https://www.educ.ar/uploads/resources/images/portadanewsgame_20210621222501.jpg',
  },
];