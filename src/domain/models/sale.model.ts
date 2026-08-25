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
    public paymentMethod: string = 'CASH',
    public externalPaymentId?: string,
    public customerName?: string,
    public customerEmail?: string,
    public customerPhone?: string,
    public status: string = 'APPROVED',
    public createdAt?: Date,
  ) {}
}

