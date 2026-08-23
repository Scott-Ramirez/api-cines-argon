import { Injectable, Inject } from '@nestjs/common';
import {
  ITmdbService,
  TMDB_SERVICE,
  TmdbMovieResult,
  TmdbMovieDetails,
} from '../../../domain/services/tmdb.service.interface';
import {
  IMovieRepository,
  MOVIE_REPOSITORY,
} from '../../../domain/repositories/movie.repository.interface';
import { MovieModel, MovieStatus } from '../../../domain/models/movie.model';

@Injectable()
export class SearchTmdbMoviesUseCase {
  constructor(
    @Inject(TMDB_SERVICE)
    private readonly tmdbService: ITmdbService,
  ) {}

  async execute(query: string, language?: string): Promise<TmdbMovieResult[]> {
    return this.tmdbService.searchMovies(query, language);
  }
}

@Injectable()
export class GetTmdbNowPlayingUseCase {
  constructor(
    @Inject(TMDB_SERVICE)
    private readonly tmdbService: ITmdbService,
  ) {}

  async execute(language?: string): Promise<TmdbMovieResult[]> {
    return this.tmdbService.getNowPlaying(language);
  }
}

@Injectable()
export class GetTmdbPopularUseCase {
  constructor(
    @Inject(TMDB_SERVICE)
    private readonly tmdbService: ITmdbService,
  ) {}

  async execute(language?: string): Promise<TmdbMovieResult[]> {
    return this.tmdbService.getPopular(language);
  }
}

@Injectable()
export class GetTmdbMovieDetailsUseCase {
  constructor(
    @Inject(TMDB_SERVICE)
    private readonly tmdbService: ITmdbService,
  ) {}

  async execute(tmdbId: number | string, language?: string): Promise<TmdbMovieDetails> {
    return this.tmdbService.getMovieDetails(tmdbId, language);
  }
}

@Injectable()
export class ImportTmdbMovieUseCase {
  constructor(
    @Inject(TMDB_SERVICE)
    private readonly tmdbService: ITmdbService,
    @Inject(MOVIE_REPOSITORY)
    private readonly movieRepository: IMovieRepository,
  ) {}

  async execute(
    tmdbId: number | string,
    status: MovieStatus = 'CARTELERA',
    language?: string,
  ): Promise<MovieModel> {
    const details = await this.tmdbService.getMovieDetails(tmdbId, language);

    const newMovie = new MovieModel(
      '',
      details.title,
      details.originalTitle,
      details.synopsis,
      details.durationMinutes,
      details.rating,
      details.genres,
      details.posterUrl,
      details.backdropUrl,
      details.trailerUrl,
      status,
      details.director,
    );

    return this.movieRepository.create(newMovie);
  }
}
