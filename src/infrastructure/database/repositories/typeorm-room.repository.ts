import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IRoomRepository } from '../../../domain/repositories/room.repository.interface';
import { RoomModel } from '../../../domain/models/room.model';
import { RoomOrmEntity } from '../entities/room.orm-entity';
import { RoomMapper } from '../mappers';

@Injectable()
export class TypeormRoomRepository implements IRoomRepository {
  constructor(
    @InjectRepository(RoomOrmEntity)
    private readonly repo: Repository<RoomOrmEntity>,
  ) {}

  async findAll(): Promise<RoomModel[]> {
    const list = await this.repo.find({ order: { createdAt: 'ASC' } });
    return list.map(RoomMapper.toDomain);
  }

  async findById(id: string): Promise<RoomModel | null> {
    const item = await this.repo.findOne({ where: { id } });
    return item ? RoomMapper.toDomain(item) : null;
  }

  async create(room: RoomModel): Promise<RoomModel> {
    const orm = RoomMapper.toOrm(room);
    const saved = await this.repo.save(orm);
    return RoomMapper.toDomain(saved);
  }

  async update(id: string, room: Partial<RoomModel>): Promise<RoomModel> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) throw new Error('Sala no encontrada');
    const merged = Object.assign(existing, RoomMapper.toOrm(room));
    const saved = await this.repo.save(merged);
    return RoomMapper.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
