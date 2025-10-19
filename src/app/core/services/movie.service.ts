import { Injectable, signal, computed } from '@angular/core';
import { Movie, FeaturedMovie, Genre, MovieFilters } from '../models/movie.model';

@Injectable({ providedIn: 'root' })
export class MovieService {
  // ── State signals ──────────────────────────────────
  private readonly _filters = signal<MovieFilters>({
    genre: 'all',
    query: '',
    sortBy: 'rating',
  });

  readonly filters = this._filters.asReadonly();

  // ── Static data (replace with HttpClient calls) ────
  private readonly movies: Movie[] = [
    { id: 1,  title: 'Jack the Giant Slayer',   year: 2013, genre: 'adventure', rating: 6.3, duration: '1h 54m', badge: '',    posterSeed: 'giant',    backdropSeed: 'giantbg',    description: 'A young farmhand fights giants to rescue a princess.',       cast: ['Nicholas Hoult', 'Eleanor Tomlinson'], director: 'Bryan Singer' },
    { id: 2,  title: 'G.I. Joe: Retaliation',   year: 2013, genre: 'action',    rating: 5.7, duration: '1h 50m', badge: '',    posterSeed: 'joe',      backdropSeed: 'joebg',      description: 'The G.I. Joes must stop Cobra from taking over the world.',   cast: ['Dwayne Johnson', 'Channing Tatum'],     director: 'Jon M. Chu' },
    { id: 3,  title: 'Arthur the King',          year: 2024, genre: 'adventure', rating: 7.1, duration: '1h 47m', badge: 'new', posterSeed: 'arthur',   backdropSeed: 'arthurbg',   description: 'An endurance racer bonds with a stray dog mid-race.',         cast: ['Mark Wahlberg'],                        director: 'Simon Cellan Jones' },
    { id: 4,  title: 'Bleeding Steel',           year: 2017, genre: 'action',    rating: 4.8, duration: '1h 49m', badge: '',    posterSeed: 'steel',    backdropSeed: 'steelbg',    description: 'An agent defends a girl hunted by a cyborg criminal.',        cast: ['Jackie Chan'],                          director: 'Leo Zhang' },
    { id: 5,  title: 'Avengers: Endgame',        year: 2019, genre: 'action',    rating: 8.4, duration: '3h 2m',  badge: 'hot', posterSeed: 'endgame',  backdropSeed: 'endgamebg',  description: 'Earth\'s Mightiest Heroes undo the Snap.',                    cast: ['Robert Downey Jr.', 'Chris Evans'],     director: 'Anthony & Joe Russo' },
    { id: 6,  title: 'Dune: Part Two',           year: 2024, genre: 'scifi',     rating: 8.8, duration: '2h 46m', badge: 'new', posterSeed: 'dune',     backdropSeed: 'dunebg',     description: 'Paul Atreides leads the Fremen against the Harkonnens.',     cast: ['Timothée Chalamet', 'Zendaya'],         director: 'Denis Villeneuve' },
    { id: 7,  title: 'The Shining',              year: 1980, genre: 'horror',    rating: 8.4, duration: '2h 26m', badge: '',    posterSeed: 'shining',  backdropSeed: 'shiningbg',  description: 'A writer and his family winter at a haunted hotel.',          cast: ['Jack Nicholson', 'Shelley Duvall'],     director: 'Stanley Kubrick' },
    { id: 8,  title: 'Titanic',                  year: 1997, genre: 'romance',   rating: 7.9, duration: '3h 14m', badge: '',    posterSeed: 'titanic',  backdropSeed: 'titanicbg',  description: 'An epic romance aboard the ill-fated ocean liner.',           cast: ['Leonardo DiCaprio', 'Kate Winslet'],    director: 'James Cameron' },
    { id: 9,  title: 'Interstellar',             year: 2014, genre: 'scifi',     rating: 8.7, duration: '2h 49m', badge: '',    posterSeed: 'inter',    backdropSeed: 'interbg',    description: 'Astronauts travel a wormhole to save humanity.',              cast: ['Matthew McConaughey', 'Anne Hathaway'], director: 'Christopher Nolan' },
    { id: 10, title: 'The Dark Knight',          year: 2008, genre: 'action',    rating: 9.0, duration: '2h 32m', badge: 'hot', posterSeed: 'batman',   backdropSeed: 'batmanbg',   description: 'Batman faces the Joker in a battle for Gotham\'s soul.',      cast: ['Christian Bale', 'Heath Ledger'],       director: 'Christopher Nolan' },
    { id: 11, title: 'Parasite',                 year: 2019, genre: 'drama',     rating: 8.5, duration: '2h 12m', badge: '',    posterSeed: 'parasite', backdropSeed: 'parasitebg', description: 'Class warfare erupts between two Korean families.',           cast: ['Song Kang-ho', 'Lee Sun-kyun'],         director: 'Bong Joon-ho' },
    { id: 12, title: 'The Grand Budapest Hotel', year: 2014, genre: 'comedy',    rating: 8.1, duration: '1h 39m', badge: '',    posterSeed: 'budapest', backdropSeed: 'budapestbg', description: 'A concierge and his protégé go on a wild European adventure.', cast: ['Ralph Fiennes', 'Tony Revolori'],       director: 'Wes Anderson' },
  ];

  private readonly featured: FeaturedMovie[] = [
    { id: 101, title: 'Spiderman: No Way Home',  year: 2021, genre: 'action', rating: 8.2, duration: '2h 28m', badge: '',    posterSeed: 'noway',   backdropSeed: 'nowaybg',   description: 'Peter Parker asks Strange for help after his identity is revealed.', cast: ['Tom Holland', 'Zendaya'],              director: 'Jon Watts',       tagLabel: 'Marvel' },
    { id: 102, title: 'Top Gun: Maverick',        year: 2022, genre: 'action', rating: 8.3, duration: '2h 11m', badge: 'hot', posterSeed: 'topgun',  backdropSeed: 'topgunbg',  description: 'Maverick returns to train the next generation of fighter pilots.',   cast: ['Tom Cruise', 'Jennifer Connelly'],     director: 'Joseph Kosinski', tagLabel: 'Action' },
    { id: 103, title: 'Oppenheimer',              year: 2023, genre: 'drama',  rating: 8.9, duration: '3h 0m',  badge: 'hot', posterSeed: 'oppen',   backdropSeed: 'oppenbg',   description: 'The story of J. Robert Oppenheimer and the Manhattan Project.',     cast: ['Cillian Murphy', 'Emily Blunt'],       director: 'Christopher Nolan', tagLabel: 'Epic' },
    { id: 104, title: 'Blade Runner 2049',         year: 2017, genre: 'scifi',  rating: 8.0, duration: '2h 44m', badge: '',    posterSeed: 'blade',   backdropSeed: 'bladebg',   description: 'A young blade runner discovers a secret that threatens civilization.', cast: ['Ryan Gosling', 'Harrison Ford'],      director: 'Denis Villeneuve', tagLabel: 'Sci-Fi' },
  ];

  // ── Computed filtered list ─────────────────────────
  readonly filteredMovies = computed(() => {
    const { genre, query, sortBy } = this._filters();
    let list = [...this.movies];

    if (genre !== 'all') {
      list = list.filter((m) => m.genre === genre);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.cast.some((c) => c.toLowerCase().includes(q)) ||
          m.director?.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'year')   return b.year - a.year;
      return a.title.localeCompare(b.title);
    });
    return list;
  });

  // ── Public API ─────────────────────────────────────
  getTrending(): Movie[] {
    return this.movies
      .filter((m) => m.rating >= 7)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8);
  }

  getFeatured(): FeaturedMovie[] {
    return this.featured;
  }

  getById(id: number): Movie | FeaturedMovie | undefined {
    return (
      this.movies.find((m) => m.id === id) ??
      this.featured.find((m) => m.id === id)
    );
  }

  getHeroBanner(): Movie {
    return this.movies.find((m) => m.id === 5)!;
  }

  setGenreFilter(genre: Genre | 'all'): void {
    this._filters.update((f) => ({ ...f, genre }));
  }

  setSearchQuery(query: string): void {
    this._filters.update((f) => ({ ...f, query }));
  }

  setSortBy(sortBy: MovieFilters['sortBy']): void {
    this._filters.update((f) => ({ ...f, sortBy }));
  }
}
