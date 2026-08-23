import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IMovieRepository } from '../../../domain/repositories/movie.repository.interface';
import { MovieModel, MovieStatus } from '../../../domain/models/movie.model';
import { MovieOrmEntity } from '../entities/movie.orm-entity';
import { MovieMapper } from '../mappers';

@Injectable()
export class TypeormMovieRepository implements IMovieRepository {
  constructor(
    @InjectRepository(MovieOrmEntity)
    private readonly repo: Repository<MovieOrmEntity>,
  ) {}

  async findAll(status?: MovieStatus): Promise<MovieModel[]> {
    const where: any = {};
    if (status) where.status = status;
    const list = await this.repo.find({ where, order: { createdAt: 'DESC' } });
    return list.map(MovieMapper.toDomain);
  }

  async findById(id: string): Promise<MovieModel | null> {
    const item = await this.repo.findOne({ where: { id } });
    return item ? MovieMapper.toDomain(item) : null;
  }

  async create(movie: MovieModel): Promise<MovieModel> {
    const orm = MovieMapper.toOrm(movie);
    const saved = await this.repo.save(orm);
    return MovieMapper.toDomain(saved);
  }

  async update(id: string, movie: Partial<MovieModel>): Promise<MovieModel> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) throw new Error('Película no encontrada');
    const merged = Object.assign(existing, MovieMapper.toOrm(movie));
    const saved = await this.repo.save(merged);
    return MovieMapper.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async count(status?: MovieStatus): Promise<number> {
    const where: any = {};
    if (status) where.status = status;
    return this.repo.count({ where });
  }
}
