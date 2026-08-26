import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ITicketRepository } from '../../../domain/repositories/ticket.repository.interface';
import { TicketModel, TicketStatus } from '../../../domain/models/ticket.model';
import { TicketOrmEntity } from '../entities/ticket.orm-entity';
import { TicketMapper } from '../mappers';

@Injectable()
export class TypeormTicketRepository implements ITicketRepository {
  constructor(
    @InjectRepository(TicketOrmEntity)
    private readonly repo: Repository<TicketOrmEntity>,
  ) {}

  async findAll(status?: TicketStatus, showtimeId?: string): Promise<TicketModel[]> {
    const where: any = {};
    if (status) where.status = status;
    if (showtimeId) where.showtimeId = showtimeId;

    const list = await this.repo.find({
      where,
      order: { createdAt: 'DESC' },
    });
    return list.map(TicketMapper.toDomain);
  }

  async findById(id: string): Promise<TicketModel | null> {
    const item = await this.repo.findOne({ where: { id } });
    return item ? TicketMapper.toDomain(item) : null;
  }

  async findByIdOrSignature(key: string): Promise<TicketModel | null> {
    const clean = key.trim();
    if (!clean) return null;

    // 1. Exact ID match
    let item = await this.repo.findOne({ where: { id: clean } });
    if (item) return TicketMapper.toDomain(item);

    // 2. Exact signature match
    item = await this.repo.findOne({ where: { signature: clean } });
    if (item) return TicketMapper.toDomain(item);

    // 3. Delimited payload match (e.g. ARGON-V1|UUID|...)
    if (clean.includes('|')) {
      const parts = clean.split('|').map((p) => p.trim()).filter((p) => p.length > 0);
      for (const part of parts) {
        if (part.length >= 8) {
          item = await this.repo.findOne({ where: { id: part } }) || await this.repo.findOne({ where: { signature: part } });
          if (item) return TicketMapper.toDomain(item);
        }
      }
    }

    return null;
  }

  async findBySaleId(saleId: string): Promise<TicketModel[]> {
    const list = await this.repo.find({
      where: { saleId },
      order: { id: 'ASC' },
    });
    return list.map(TicketMapper.toDomain);
  }

  async save(ticket: TicketModel): Promise<TicketModel> {
    const orm = TicketMapper.toOrm(ticket);
    const saved = await this.repo.save(orm);
    return TicketMapper.toDomain(saved);
  }

  async count(status?: TicketStatus): Promise<number> {
    const where: any = {};
    if (status) where.status = status;
    return this.repo.count({ where });
  }
}
