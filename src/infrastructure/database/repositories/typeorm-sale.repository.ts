import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ISaleRepository } from '../../../domain/repositories/sale.repository.interface';
import { SaleModel } from '../../../domain/models/sale.model';
import { SaleOrmEntity } from '../entities/sale.orm-entity';
import { TicketOrmEntity } from '../entities/ticket.orm-entity';
import { SaleMapper, TicketMapper } from '../mappers';

@Injectable()
export class TypeormSaleRepository implements ISaleRepository {
  constructor(
    @InjectRepository(SaleOrmEntity)
    private readonly repo: Repository<SaleOrmEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(): Promise<SaleModel[]> {
    const list = await this.repo.find({
      relations: ['tickets'],
      order: { createdAt: 'DESC' },
    });
    return list.map(SaleMapper.toDomain);
  }

  async findById(id: string): Promise<SaleModel | null> {
    const item = await this.repo.findOne({
      where: { id },
      relations: ['tickets'],
    });
    return item ? SaleMapper.toDomain(item) : null;
  }

  async findByExternalPaymentId(externalPaymentId: string): Promise<SaleModel | null> {
    const item = await this.repo.findOne({
      where: { externalPaymentId },
      relations: ['tickets'],
    });
    return item ? SaleMapper.toDomain(item) : null;
  }

  async update(id: string, partial: Partial<SaleModel>): Promise<SaleModel | null> {
    await this.repo.update(id, partial as any);
    return this.findById(id);
  }

  async cancelSaleAndTickets(saleId: string): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.update(SaleOrmEntity, { id: saleId }, { status: 'REFUNDED' });
      await queryRunner.manager.update(TicketOrmEntity, { saleId }, { status: 'CANCELLED' as any });
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async createWithTickets(sale: SaleModel): Promise<SaleModel> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const saleOrm = SaleMapper.toOrm(sale);
      const ticketOrms = sale.tickets.map(TicketMapper.toOrm);

      await queryRunner.manager.save(SaleOrmEntity, saleOrm);
      await queryRunner.manager.save(TicketOrmEntity, ticketOrms);

      await queryRunner.commitTransaction();
      const saved = await this.findById(sale.id);
      return saved || sale;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async count(): Promise<number> {
    return this.repo.count();
  }

  async getTotalRevenue(): Promise<number> {
    const sales = await this.repo.find({ 
      where: { status: 'APPROVED' },
      select: ['totalAmount'] 
    });
    const total = sales.reduce((acc, curr) => acc + Number(curr.totalAmount), 0);
    return Number(total.toFixed(2));
  }
}

