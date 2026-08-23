import { MovieModel } from './movie.model';
import { RoomModel } from './room.model';

export class ShowtimeModel {
  constructor(
    public readonly id: string,
    public movieId: string,
    public roomId: string,
    public date: string,
    public startTime: string,
    public endTime: string,
    public priceMultiplier: number = 1.0,
    public availableSeats: number = 25,
    public movie?: MovieModel,
    public room?: RoomModel,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}

  hasEnoughSeats(requestedSeats: number): boolean {
    return this.availableSeats >= requestedSeats;
  }

  reserveSeats(seatsCount: number): void {
    if (!this.hasEnoughSeats(seatsCount)) {
      throw new Error(`Aforo insuficiente. Solo quedan ${this.availableSeats} asientos.`);
    }
    this.availableSeats -= seatsCount;
  }
}
