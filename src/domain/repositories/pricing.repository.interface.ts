import { PricingTierModel, TicketType } from '../models/pricing-tier.model';

export const PRICING_REPOSITORY = 'PRICING_REPOSITORY';

export interface IPricingRepository {
  findAll(): Promise<PricingTierModel[]>;
  findByType(type: TicketType): Promise<PricingTierModel | null>;
  saveBatch(tiers: PricingTierModel[]): Promise<PricingTierModel[]>;
  saveOne(tier: PricingTierModel): Promise<PricingTierModel>;
}
