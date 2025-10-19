export type Genre =
  | 'action'
  | 'comedy'
  | 'horror'
  | 'romance'
  | 'adventure'
  | 'drama'
  | 'scifi'
  | 'documentary'
  | 'animation';

export type BadgeType = 'new' | 'hot' | '';

export interface Movie {
  id: number;
  title: string;
  year: number;
  genre: Genre;
  rating: number;
  duration: string;
  badge: BadgeType;
  posterSeed: string;
  backdropSeed: string;
  description: string;
  cast: string[];
  director?: string;
  tags?: string[];
}

export interface FeaturedMovie extends Movie {
  tagLabel: string;
}

export interface MovieFilters {
  genre: Genre | 'all';
  query: string;
  sortBy: 'rating' | 'year' | 'title';
}
