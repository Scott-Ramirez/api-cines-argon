import { SaleModel } from '../models/sale.model';

export const SALE_REPOSITORY = 'SALE_REPOSITORY';

export interface ISaleRepository {
  findAll(): Promise<SaleModel[]>;
  findById(id: string): Promise<SaleModel | null>;
  createWithTickets(sale: SaleModel): Promise<SaleModel>;
  count(): Promise<number>;
  getTotalRevenue(): Promise<number>;
}
