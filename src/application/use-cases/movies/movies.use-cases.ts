import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IMovieRepository, MOVIE_REPOSITORY } from '../../../domain/repositories/movie.repository.interface';
import { MovieModel, MovieStatus, MovieRating } from '../../../domain/models/movie.model';

@Injectable()
export class GetMoviesUseCase {
  constructor(
    @Inject(MOVIE_REPOSITORY)
    private readonly movieRepository: IMovieRepository,
  ) {}

  async execute(status?: MovieStatus): Promise<MovieModel[]> {
    return this.movieRepository.findAll(status);
  }
}

@Injectable()
export class GetMovieByIdUseCase {
  constructor(
    @Inject(MOVIE_REPOSITORY)
    private readonly movieRepository: IMovieRepository,
  ) {}

  async execute(id: string): Promise<MovieModel> {
    const movie = await this.movieRepository.findById(id);
    if (!movie) {
      throw new NotFoundException(`Película con ID '${id}' no encontrada`);
    }
    return movie;
  }
}

@Injectable()
export class CreateMovieUseCase {
  constructor(
    @Inject(MOVIE_REPOSITORY)
    private readonly movieRepository: IMovieRepository,
  ) {}

  async execute(data: {
    id?: string;
    title: string;
    originalTitle?: string;
    synopsis: string;
    durationMinutes: number;
    rating: MovieRating;
    genre: string[];
    posterUrl: string;
    backdropUrl?: string;
    trailerUrl?: string;
    status: MovieStatus;
    director?: string;
  }): Promise<MovieModel> {
    const movie = new MovieModel(
      data.id || '',
      data.title,
      data.originalTitle,
      data.synopsis,
      data.durationMinutes,
      data.rating,
      data.genre,
      data.posterUrl,
      data.backdropUrl,
      data.trailerUrl,
      data.status,
      data.director,
    );
    return this.movieRepository.create(movie);
  }
}

@Injectable()
export class UpdateMovieUseCase {
  constructor(
    @Inject(MOVIE_REPOSITORY)
    private readonly movieRepository: IMovieRepository,
  ) {}

  async execute(id: string, data: Partial<MovieModel>): Promise<MovieModel> {
    const existing = await this.movieRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Película con ID '${id}' no encontrada`);
    }
    return this.movieRepository.update(id, data);
  }
}

@Injectable()
export class DeleteMovieUseCase {
  constructor(
    @Inject(MOVIE_REPOSITORY)
    private readonly movieRepository: IMovieRepository,
  ) {}

  async execute(id: string): Promise<{ success: boolean; message: string }> {
    const existing = await this.movieRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Película con ID '${id}' no encontrada`);
    }
    await this.movieRepository.delete(id);
    return { success: true, message: `Película '${existing.title}' eliminada exitosamente` };
  }
}
