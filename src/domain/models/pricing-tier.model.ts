export type TicketType = 'GENERAL' | 'NINO' | 'ADULTO_MAYOR' | 'PROMO_DUO';

export class PricingTierModel {
  constructor(
    public readonly id: string,
    public type: TicketType,
    public label: string,
    public description: string,
    public basePrice: number,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}
