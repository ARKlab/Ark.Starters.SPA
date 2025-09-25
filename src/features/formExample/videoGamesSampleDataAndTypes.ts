export type VideoGame = {
  title: string
  releaseYear: number
  developer: string
  rating: number
  platform: string
  salesMillions: number
  genre: number
}

export type VideoGameGenre = {
  id: number
  name: string
}

export const videoGamesSampleData: VideoGame[] = [
  {
    title: 'The Witcher 3',
    releaseYear: 2015,
    developer: 'CD Projekt Red',
    rating: 9.3,
    platform: 'PC, PS4, Xbox One',
    salesMillions: 30,
    genre: 1, // RPG
  },
  {
    title: 'Halo: Combat Evolved',
    releaseYear: 2001,
    developer: 'Bungie',
    rating: 9.7,
    platform: 'Xbox',
    salesMillions: 6,
    genre: 2, // FPS
  },
  {
    title: 'Stardew Valley',
    releaseYear: 2016,
    developer: 'ConcernedApe',
    rating: 9.1,
    platform: 'PC, Switch, PS4',
    salesMillions: 10,
    genre: 3, // Simulation
  },
  {
    title: 'Fortnite',
    releaseYear: 2017,
    developer: 'Epic Games',
    rating: 8.5,
    platform: 'PC, PS4, Xbox One',
    salesMillions: 350,
    genre: 9, // Action
  },
  {
    title: 'Minecraft',
    releaseYear: 2011,
    developer: 'Mojang',
    rating: 9.0,
    platform: 'PC, Xbox, Switch',
    salesMillions: 200,
    genre: 10, // Indie
  },
  {
    title: 'Cyberpunk 2077',
    releaseYear: 2020,
    developer: 'CD Projekt Red',
    rating: 7.8,
    platform: 'PC, PS4, Xbox One',
    salesMillions: 13,
    genre: 1, // RPG
  },
  {
    title: 'Overwatch',
    releaseYear: 2016,
    developer: 'Blizzard',
    rating: 8.3,
    platform: 'PC, PS4, Xbox One',
    salesMillions: 50,
    genre: 9, // Action
  },
  {
    title: 'Animal Crossing: New Horizons',
    releaseYear: 2020,
    developer: 'Nintendo',
    rating: 9.5,
    platform: 'Switch',
    salesMillions: 32,
    genre: 5, // Adventure
  },
  {
    title: 'Grand Theft Auto V',
    releaseYear: 2013,
    developer: 'Rockstar Games',
    rating: 9.6,
    platform: 'PC, PS4, Xbox One',
    salesMillions: 150,
    genre: 9, // Action
  },
  {
    title: 'Celeste',
    releaseYear: 2018,
    developer: 'Maddy Makes Games',
    rating: 9.1,
    platform: 'PC, Switch, PS4',
    salesMillions: 2,
    genre: 10, // Indie
  },
  {
    title: 'PUBG',
    releaseYear: 2017,
    developer: 'PUBG Corporation',
    rating: 7.9,
    platform: 'PC, Xbox One',
    salesMillions: 70,
    genre: 9, // Action
  },
  {
    title: 'The Legend of Zelda: Breath of the Wild',
    releaseYear: 2017,
    developer: 'Nintendo',
    rating: 9.5,
    platform: 'Switch',
    salesMillions: 24,
    genre: 5, // Adventure
  },
  {
    title: 'League of Legends',
    releaseYear: 2009,
    developer: 'Riot Games',
    rating: 8.7,
    platform: 'PC',
    salesMillions: 100,
    genre: 4, // Strategy
  },
  {
    title: "Assassin's Creed: Odyssey",
    releaseYear: 2018,
    developer: 'Ubisoft',
    rating: 8.9,
    platform: 'PC, PS4, Xbox One',
    salesMillions: 11,
    genre: 1, // RPG
  },
  {
    title: 'Rocket League',
    releaseYear: 2015,
    developer: 'Psyonix',
    rating: 8.0,
    platform: 'PC, Switch, PS4',
    salesMillions: 75,
    genre: 6, // Sports
  },
  {
    title: 'Final Fantasy VII',
    releaseYear: 1997,
    developer: 'Square Enix',
    rating: 9.2,
    platform: 'PS1, PC, Switch',
    salesMillions: 13,
    genre: 1, // RPG
  },
  {
    title: 'Destiny 2',
    releaseYear: 2017,
    developer: 'Bungie',
    rating: 8.4,
    platform: 'PC, PS4, Xbox One',
    salesMillions: 25,
    genre: 9, // Action
  },
  {
    title: 'The Last of Us Part II',
    releaseYear: 2020,
    developer: 'Naughty Dog',
    rating: 9.7,
    platform: 'PS4',
    salesMillions: 12,
    genre: 8, // Horror
  },
  {
    title: 'DOTA 2',
    releaseYear: 2013,
    developer: 'Valve',
    rating: 8.5,
    platform: 'PC',
    salesMillions: 90,
    genre: 4, // Strategy
  },
  {
    title: 'Splatoon 2',
    releaseYear: 2017,
    developer: 'Nintendo',
    rating: 8.6,
    platform: 'Switch',
    salesMillions: 12,
    genre: 5, // Adventure
  },
]
export const gameGenres: VideoGameGenre[] = [
  { id: 1, name: 'RPG' },
  { id: 2, name: 'FPS' },
  { id: 3, name: 'Simulation' },
  { id: 4, name: 'Strategy' },
  { id: 5, name: 'Adventure' },
  { id: 6, name: 'Sports' },
  { id: 7, name: 'Puzzle' },
  { id: 8, name: 'Horror' },
  { id: 9, name: 'Action' },
  { id: 10, name: 'Indie' },
]
