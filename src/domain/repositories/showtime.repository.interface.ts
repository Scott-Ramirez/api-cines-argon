import { ShowtimeModel } from '../models/showtime.model';

export const SHOWTIME_REPOSITORY = 'SHOWTIME_REPOSITORY';

export interface IShowtimeRepository {
  findAll(date?: string, movieId?: string): Promise<ShowtimeModel[]>;
  findById(id: string): Promise<ShowtimeModel | null>;
  create(showtime: ShowtimeModel): Promise<ShowtimeModel>;
  update(id: string, showtime: Partial<ShowtimeModel>): Promise<ShowtimeModel>;
  delete(id: string): Promise<void>;
  updateAvailableSeats(id: string, availableSeats: number): Promise<void>;
  decrementAvailableSeats(id: string, count: number): Promise<boolean>;
  incrementAvailableSeats(id: string, count: number): Promise<void>;
}

