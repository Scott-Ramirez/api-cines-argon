import { RoomType } from './room.model';
import { TicketType } from './pricing-tier.model';

export type TicketStatus = 'ISSUED' | 'USED' | 'CANCELLED';

export class TicketModel {
  constructor(
    public readonly id: string,
    public saleId: string,
    public showtimeId: string,
    public movieId: string,
    public movieTitle: string,
    public roomName: string,
    public roomType: RoomType,
    public showtimeDate: string,
    public showtimeHour: string,
    public ticketType: TicketType,
    public price: number,
    public status: TicketStatus = 'ISSUED',
    public issuedAt: string = new Date().toISOString(),
    public usedAt?: string,
    public validatedBy?: string,
    public signature: string = '',
    public createdAt?: Date,
  ) {}

  markAsUsed(validatedBy: string): void {
    this.status = 'USED';
    this.usedAt = new Date().toISOString();
    this.validatedBy = validatedBy;
  }

  cancel(): void {
    this.status = 'CANCELLED';
  }

  isUsed(): boolean {
    return this.status === 'USED';
  }

  isCancelled(): boolean {
    return this.status === 'CANCELLED';
  }
}
