import { MovieModel, MovieStatus } from '../models/movie.model';

export const MOVIE_REPOSITORY = 'MOVIE_REPOSITORY';

export interface IMovieRepository {
  findAll(status?: MovieStatus): Promise<MovieModel[]>;
  findById(id: string): Promise<MovieModel | null>;
  create(movie: MovieModel): Promise<MovieModel>;
  update(id: string, movie: Partial<MovieModel>): Promise<MovieModel>;
  delete(id: string): Promise<void>;
  count(status?: MovieStatus): Promise<number>;
}
