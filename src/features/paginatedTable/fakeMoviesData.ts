export type Movie = {
  id: number
  title: string
  releaseDate: string
  runtime: number
  genre: string
  director: string
  actors: string
  plot: string
  rating: number
}
const baseMovies = [
  "GhostBusters",
  "Star Wars",
  "The Matrix",
  "The Godfather",
  "Pulp Fiction",
  "Fight Club",
  "Forrest Gump",
  "Inception",
  "The Dark Knight",
  "Gladiator",
]

const baseDirectors = [
  "Steven Spielberg",
  "Martin Scorsese",
  "Alfred Hitchcock",
  "Stanley Kubrick",
  "Quentin Tarantino",
  "Orson Welles",
  "Francis Ford Coppola",
  "Ridley Scott",
  "Akira Kurosawa",
  "Joel Coen",
]

const baseActors = [
  "Tom Hanks",
  "Robert De Niro",
  "Marlon Brando",
  "Jack Nicholson",
  "Morgan Freeman",
  "Leonardo DiCaprio",
  "Al Pacino",
  "Denzel Washington",
  "Humphrey Bogart",
  "James Stewart",
]

const basePlots = [
  "May the Force be with you. - Star Wars",
  "I'm going to make him an offer he can't refuse. - The Godfather",
  "You talking to me? - Taxi Driver",
  "Here's looking at you, kid. - Casablanca",
  "I love the smell of napalm in the morning. - Apocalypse Now",
  "E.T. phone home. - E.T. The Extra-Terrestrial",
  "I'll be back. - The Terminator",
  "Life is like a box of chocolates, you never know what you're gonna get. - Forrest Gump",
  "You can't handle the truth! - A Few Good Men",
  "I feel the need - the need for speed! - Top Gun",
]

const moviesData: Movie[] = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  title: `${baseMovies[i % baseMovies.length]}${i + 1}`,
  releaseDate: new Date(Math.floor(Math.random() * (2022 - 1900 + 1)) + 1900, 0).toDateString(),
  runtime: Math.floor(Math.random() * (200 - 80 + 1)) + 80,
  genre: `Genere ${(i % 5) + 1}`,
  director: `${baseDirectors[i % baseDirectors.length]}${i + 1}`,
  actors: `${baseActors[i % baseActors.length]}${i + 1}`,
  plot: basePlots[i % basePlots.length],
  rating: Math.floor(Math.random() * 5) + 1,
}))

export default moviesData
