import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IShowtimeRepository } from '../../../domain/repositories/showtime.repository.interface';
import { ShowtimeModel } from '../../../domain/models/showtime.model';
import { ShowtimeOrmEntity } from '../entities/showtime.orm-entity';
import { ShowtimeMapper } from '../mappers';

@Injectable()
export class TypeormShowtimeRepository implements IShowtimeRepository {
  constructor(
    @InjectRepository(ShowtimeOrmEntity)
    private readonly repo: Repository<ShowtimeOrmEntity>,
  ) {}

  async findAll(date?: string, movieId?: string): Promise<ShowtimeModel[]> {
    const where: any = {};
    if (date) where.date = date;
    if (movieId) where.movieId = movieId;

    const list = await this.repo.find({
      where,
      relations: ['movie', 'room'],
      order: { startTime: 'ASC' },
    });
    return list.map(ShowtimeMapper.toDomain);
  }

  async findById(id: string): Promise<ShowtimeModel | null> {
    const item = await this.repo.findOne({
      where: { id },
      relations: ['movie', 'room'],
    });
    return item ? ShowtimeMapper.toDomain(item) : null;
  }

  async create(showtime: ShowtimeModel): Promise<ShowtimeModel> {
    const orm = ShowtimeMapper.toOrm(showtime);
    const saved = await this.repo.save(orm);
    const full = await this.findById(saved.id);
    return full || ShowtimeMapper.toDomain(saved);
  }

  async update(id: string, showtime: Partial<ShowtimeModel>): Promise<ShowtimeModel> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) throw new Error('Función no encontrada');
    const merged = Object.assign(existing, ShowtimeMapper.toOrm(showtime));
    const saved = await this.repo.save(merged);
    const full = await this.findById(saved.id);
    return full || ShowtimeMapper.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async updateAvailableSeats(id: string, availableSeats: number): Promise<void> {
    await this.repo.update(id, { availableSeats });
  }

  async decrementAvailableSeats(id: string, count: number): Promise<boolean> {
    const result = await this.repo
      .createQueryBuilder()
      .update(ShowtimeOrmEntity)
      .set({ availableSeats: () => `availableSeats - ${count}` })
      .where('id = :id AND availableSeats >= :count', { id, count })
      .execute();
    return (result.affected ?? 0) > 0;
  }

  async incrementAvailableSeats(id: string, count: number): Promise<void> {
    await this.repo
      .createQueryBuilder()
      .update(ShowtimeOrmEntity)
      .set({ availableSeats: () => `availableSeats + ${count}` })
      .where('id = :id', { id })
      .execute();
  }
}

