import { TicketModel, TicketStatus } from '../models/ticket.model';

export const TICKET_REPOSITORY = 'TICKET_REPOSITORY';

export interface ITicketRepository {
  findAll(status?: TicketStatus, showtimeId?: string): Promise<TicketModel[]>;
  findById(id: string): Promise<TicketModel | null>;
  findBySaleId(saleId: string): Promise<TicketModel[]>;
  save(ticket: TicketModel): Promise<TicketModel>;
  count(status?: TicketStatus): Promise<number>;
}
