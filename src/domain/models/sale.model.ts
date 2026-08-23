import { TicketModel } from './ticket.model';

export class SaleModel {
  constructor(
    public readonly id: string,
    public movieTitle: string,
    public showtimeId: string,
    public totalAmount: number,
    public paidAmount: number,
    public changeAmount: number,
    public cashierName: string = 'Admin',
    public totalTickets: number = 1,
    public tickets: TicketModel[] = [],
    public createdAt?: Date,
  ) {}
}
