import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ITicketRepository, TICKET_REPOSITORY } from '../../../domain/repositories/ticket.repository.interface';
import { TicketModel, TicketStatus } from '../../../domain/models/ticket.model';

@Injectable()
export class GetTicketsUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: ITicketRepository,
  ) {}

  async execute(status?: TicketStatus, showtimeId?: string): Promise<TicketModel[]> {
    return this.ticketRepository.findAll(status, showtimeId);
  }
}

@Injectable()
export class GetTicketByIdUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: ITicketRepository,
  ) {}

  async execute(id: string): Promise<TicketModel> {
    const ticket = await this.ticketRepository.findById(id);
    if (!ticket) {
      throw new NotFoundException(`Boleto con ID '${id}' no encontrado`);
    }
    return ticket;
  }
}

@Injectable()
export class GetTicketsBySaleUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: ITicketRepository,
  ) {}

  async execute(saleId: string): Promise<TicketModel[]> {
    return this.ticketRepository.findBySaleId(saleId);
  }
}

@Injectable()
export class CancelTicketUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: ITicketRepository,
  ) {}

  async execute(id: string): Promise<TicketModel> {
    const ticket = await this.ticketRepository.findById(id);
    if (!ticket) {
      throw new NotFoundException(`Boleto con ID '${id}' no encontrado`);
    }
    ticket.cancel();
    return this.ticketRepository.save(ticket);
  }
}
