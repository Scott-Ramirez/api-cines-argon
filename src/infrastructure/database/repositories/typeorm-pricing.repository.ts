import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPricingRepository } from '../../../domain/repositories/pricing.repository.interface';
import { PricingTierModel, TicketType } from '../../../domain/models/pricing-tier.model';
import { PricingTierOrmEntity } from '../entities/pricing-tier.orm-entity';
import { PricingTierMapper } from '../mappers';

@Injectable()
export class TypeormPricingRepository implements IPricingRepository {
  constructor(
    @InjectRepository(PricingTierOrmEntity)
    private readonly repo: Repository<PricingTierOrmEntity>,
  ) {}

  async findAll(): Promise<PricingTierModel[]> {
    const list = await this.repo.find({ order: { basePrice: 'ASC' } });
    return list.map(PricingTierMapper.toDomain);
  }

  async findByType(type: TicketType): Promise<PricingTierModel | null> {
    const item = await this.repo.findOne({ where: { type } });
    return item ? PricingTierMapper.toDomain(item) : null;
  }

  async saveBatch(tiers: PricingTierModel[]): Promise<PricingTierModel[]> {
    const results: PricingTierModel[] = [];
    for (const tier of tiers) {
      const saved = await this.saveOne(tier);
      results.push(saved);
    }
    return results;
  }

  async saveOne(tier: PricingTierModel): Promise<PricingTierModel> {
    let existing = await this.repo.findOne({ where: { type: tier.type } });
    if (existing) {
      existing.label = tier.label;
      existing.description = tier.description;
      existing.basePrice = tier.basePrice;
    } else {
      existing = PricingTierMapper.toOrm(tier);
    }
    const saved = await this.repo.save(existing);
    return PricingTierMapper.toDomain(saved);
  }
}
