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
