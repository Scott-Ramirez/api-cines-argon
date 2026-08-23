import { Injectable, Inject } from '@nestjs/common';
import { IPricingRepository, PRICING_REPOSITORY } from '../../../domain/repositories/pricing.repository.interface';
import { PricingTierModel, TicketType } from '../../../domain/models/pricing-tier.model';

@Injectable()
export class GetPricingUseCase {
  constructor(
    @Inject(PRICING_REPOSITORY)
    private readonly pricingRepository: IPricingRepository,
  ) {}

  async execute(): Promise<PricingTierModel[]> {
    return this.pricingRepository.findAll();
  }
}

@Injectable()
export class SavePricingBatchUseCase {
  constructor(
    @Inject(PRICING_REPOSITORY)
    private readonly pricingRepository: IPricingRepository,
  ) {}

  async execute(tiers: any): Promise<PricingTierModel[]> {
    const list = Array.isArray(tiers) ? tiers : (tiers?.tiers || (tiers ? [tiers] : []));
    const models = list.map(
      (t: any) =>
        new PricingTierModel(
          t.id || '',
          t.type,
          t.label || t.type,
          t.description || '',
          Number(t.basePrice) || 0,
        ),
    );
    return this.pricingRepository.saveBatch(models);
  }
}

@Injectable()
export class SavePricingTierUseCase {
  constructor(
    @Inject(PRICING_REPOSITORY)
    private readonly pricingRepository: IPricingRepository,
  ) {}

  async execute(tier: any): Promise<PricingTierModel> {
    const model = new PricingTierModel(
      tier.id || '',
      tier.type,
      tier.label || tier.type,
      tier.description || '',
      Number(tier.basePrice) || 0,
    );
    return this.pricingRepository.saveOne(model);
  }
}
