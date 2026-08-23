export const TMDB_SERVICE = 'TMDB_SERVICE';

export interface TmdbMovieResult {
  id: number;
  title: string;
  originalTitle: string;
  overview: string;
  releaseDate: string;
  posterUrl: string;
  backdropUrl: string;
  voteAverage: number;
  genreIds: number[];
}

export interface TmdbMovieDetails {
  id: number;
  title: string;
  originalTitle: string;
  synopsis: string;
  durationMinutes: number;
  rating: 'APT' | '14+' | '18+' | 'TE';
  genres: string[];
  posterUrl: string;
  backdropUrl: string;
  trailerUrl?: string;
  director?: string;
  releaseDate: string;
}

export interface ITmdbService {
  searchMovies(query: string, language?: string): Promise<TmdbMovieResult[]>;
  getNowPlaying(language?: string): Promise<TmdbMovieResult[]>;
  getPopular(language?: string): Promise<TmdbMovieResult[]>;
  getMovieDetails(tmdbId: number | string, language?: string): Promise<TmdbMovieDetails>;
}
