import { SaleModel } from '../models/sale.model';

export const SALE_REPOSITORY = 'SALE_REPOSITORY';

export interface ISaleRepository {
  findAll(): Promise<SaleModel[]>;
  findById(id: string): Promise<SaleModel | null>;
  findByExternalPaymentId(externalPaymentId: string): Promise<SaleModel | null>;
  createWithTickets(sale: SaleModel): Promise<SaleModel>;
  update(id: string, partial: Partial<SaleModel>): Promise<SaleModel | null>;
  cancelSaleAndTickets(saleId: string): Promise<void>;
  count(): Promise<number>;
  getTotalRevenue(): Promise<number>;
}

