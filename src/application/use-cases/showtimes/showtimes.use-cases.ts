import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IShowtimeRepository, SHOWTIME_REPOSITORY } from '../../../domain/repositories/showtime.repository.interface';
import { IMovieRepository, MOVIE_REPOSITORY } from '../../../domain/repositories/movie.repository.interface';
import { IRoomRepository, ROOM_REPOSITORY } from '../../../domain/repositories/room.repository.interface';
import { ShowtimeModel } from '../../../domain/models/showtime.model';

@Injectable()
export class GetShowtimesUseCase {
  constructor(
    @Inject(SHOWTIME_REPOSITORY)
    private readonly showtimeRepository: IShowtimeRepository,
  ) {}

  async execute(date?: string, movieId?: string): Promise<ShowtimeModel[]> {
    return this.showtimeRepository.findAll(date, movieId);
  }
}

@Injectable()
export class GetShowtimeByIdUseCase {
  constructor(
    @Inject(SHOWTIME_REPOSITORY)
    private readonly showtimeRepository: IShowtimeRepository,
  ) {}

  async execute(id: string): Promise<ShowtimeModel> {
    const showtime = await this.showtimeRepository.findById(id);
    if (!showtime) {
      throw new NotFoundException(`Función con ID '${id}' no encontrada`);
    }
    return showtime;
  }
}

@Injectable()
export class CreateShowtimeUseCase {
  constructor(
    @Inject(SHOWTIME_REPOSITORY)
    private readonly showtimeRepository: IShowtimeRepository,
    @Inject(MOVIE_REPOSITORY)
    private readonly movieRepository: IMovieRepository,
    @Inject(ROOM_REPOSITORY)
    private readonly roomRepository: IRoomRepository,
  ) {}

  async execute(data: {
    id?: string;
    movieId: string;
    roomId: string;
    date: string;
    startTime: string;
    endTime: string;
    priceMultiplier?: number;
    availableSeats: number;
  }): Promise<ShowtimeModel> {
    const movie = await this.movieRepository.findById(data.movieId);
    if (!movie) throw new NotFoundException('Película no encontrada');

    const room = await this.roomRepository.findById(data.roomId);
    if (!room) throw new NotFoundException('Sala no encontrada');

    const showtime = new ShowtimeModel(
      data.id || '',
      data.movieId,
      data.roomId,
      data.date,
      data.startTime,
      data.endTime,
      data.priceMultiplier || 1.0,
      data.availableSeats,
    );

    return this.showtimeRepository.create(showtime);
  }
}

@Injectable()
export class UpdateShowtimeUseCase {
  constructor(
    @Inject(SHOWTIME_REPOSITORY)
    private readonly showtimeRepository: IShowtimeRepository,
  ) {}

  async execute(id: string, data: Partial<ShowtimeModel>): Promise<ShowtimeModel> {
    const existing = await this.showtimeRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Función con ID '${id}' no encontrada`);
    }
    return this.showtimeRepository.update(id, data);
  }
}

@Injectable()
export class DeleteShowtimeUseCase {
  constructor(
    @Inject(SHOWTIME_REPOSITORY)
    private readonly showtimeRepository: IShowtimeRepository,
  ) {}

  async execute(id: string): Promise<{ success: boolean; message: string }> {
    const existing = await this.showtimeRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Función con ID '${id}' no encontrada`);
    }
    await this.showtimeRepository.delete(id);
    return { success: true, message: `Función eliminada exitosamente` };
  }
}
