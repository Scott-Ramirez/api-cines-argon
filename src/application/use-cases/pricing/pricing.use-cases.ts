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

  async execute(tiers: { id?: string; type: TicketType; label: string; description: string; basePrice: number }[]): Promise<PricingTierModel[]> {
    const models = tiers.map(t => new PricingTierModel(t.id || '', t.type, t.label, t.description, t.basePrice));
    return this.pricingRepository.saveBatch(models);
  }
}

@Injectable()
export class SavePricingTierUseCase {
  constructor(
    @Inject(PRICING_REPOSITORY)
    private readonly pricingRepository: IPricingRepository,
  ) {}

  async execute(tier: { id?: string; type: TicketType; label: string; description: string; basePrice: number }): Promise<PricingTierModel> {
    const model = new PricingTierModel(tier.id || '', tier.type, tier.label, tier.description, tier.basePrice);
    return this.pricingRepository.saveOne(model);
  }
}
