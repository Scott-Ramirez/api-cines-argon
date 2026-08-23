import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IScanLogRepository } from '../../../domain/repositories/scan-log.repository.interface';
import { ScanLogModel } from '../../../domain/models/scan-log.model';
import { ScanLogOrmEntity } from '../entities/scan-log.orm-entity';
import { ScanLogMapper } from '../mappers';

@Injectable()
export class TypeormScanLogRepository implements IScanLogRepository {
  constructor(
    @InjectRepository(ScanLogOrmEntity)
    private readonly repo: Repository<ScanLogOrmEntity>,
  ) {}

  async create(log: ScanLogModel): Promise<ScanLogModel> {
    const orm = ScanLogMapper.toOrm(log);
    const saved = await this.repo.save(orm);
    return ScanLogMapper.toDomain(saved);
  }

  async findRecent(limit: number): Promise<ScanLogModel[]> {
    const list = await this.repo.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
    return list.map(ScanLogMapper.toDomain);
  }
}
