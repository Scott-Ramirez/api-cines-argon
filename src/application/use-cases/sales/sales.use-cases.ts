import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { ISaleRepository, SALE_REPOSITORY } from '../../../domain/repositories/sale.repository.interface';
import { IShowtimeRepository, SHOWTIME_REPOSITORY } from '../../../domain/repositories/showtime.repository.interface';
import { IPricingRepository, PRICING_REPOSITORY } from '../../../domain/repositories/pricing.repository.interface';
import { CryptoService } from '../../../infrastructure/security/crypto.service';
import { SaleModel } from '../../../domain/models/sale.model';
import { TicketModel } from '../../../domain/models/ticket.model';
import { TicketType } from '../../../domain/models/pricing-tier.model';

export interface CartItemInput {
  type: TicketType;
  quantity: number;
}

export interface ProcessSaleInput {
  showtimeId: string;
  items: CartItemInput[];
  cashierName?: string;
  paidAmount: number;
}

@Injectable()
export class GetSalesUseCase {
  constructor(
    @Inject(SALE_REPOSITORY)
    private readonly saleRepository: ISaleRepository,
  ) {}

  async execute(): Promise<SaleModel[]> {
    return this.saleRepository.findAll();
  }
}

@Injectable()
export class GetSaleByIdUseCase {
  constructor(
    @Inject(SALE_REPOSITORY)
    private readonly saleRepository: ISaleRepository,
  ) {}

  async execute(id: string): Promise<SaleModel> {
    const sale = await this.saleRepository.findById(id);
    if (!sale) {
      throw new NotFoundException(`Venta con ID '${id}' no encontrada`);
    }
    return sale;
  }
}

@Injectable()
export class ProcessSaleUseCase {
  constructor(
    @Inject(SALE_REPOSITORY)
    private readonly saleRepository: ISaleRepository,
    @Inject(SHOWTIME_REPOSITORY)
    private readonly showtimeRepository: IShowtimeRepository,
    @Inject(PRICING_REPOSITORY)
    private readonly pricingRepository: IPricingRepository,
    private readonly cryptoService: CryptoService,
  ) {}

  async execute(input: ProcessSaleInput): Promise<{ sale: SaleModel; tickets: TicketModel[] }> {
    const showtime = await this.showtimeRepository.findById(input.showtimeId);
    if (!showtime) {
      throw new NotFoundException('Función no encontrada en el sistema');
    }

    const totalTicketsRequested = input.items.reduce((acc, item) => acc + item.quantity, 0);
    if (totalTicketsRequested <= 0) {
      throw new BadRequestException('Debe seleccionar al menos un boleto');
    }

    if (!showtime.hasEnoughSeats(totalTicketsRequested)) {
      throw new BadRequestException(
        `Aforo insuficiente. Solo quedan ${showtime.availableSeats} asientos disponibles.`,
      );
    }

    const pricingTiers = await this.pricingRepository.findAll();
    const priceMap = new Map<string, number>(pricingTiers.map((p) => [p.type, p.basePrice]));

    const saleId = 'VNT-' + Date.now().toString().slice(-6);
    const nowIso = new Date().toISOString();
    const generatedTickets: TicketModel[] = [];
    let totalAmount = 0;

    const movieTitle = showtime.movie ? showtime.movie.title : 'Cine Argón';
    const roomName = showtime.room ? showtime.room.name : 'Sala Principal';
    const roomType = showtime.room ? showtime.room.type : 'VIP Premium';

    for (const item of input.items) {
      if (item.quantity <= 0) continue;
      const basePrice = priceMap.get(item.type) || 18.0;
      const unitPrice = Number((basePrice * showtime.priceMultiplier).toFixed(2));

      for (let i = 0; i < item.quantity; i++) {
        const ticketSeq = generatedTickets.length + 1;
        const randomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
        const ticketId = `TKT-${randomCode}-${ticketSeq}`;

        const signature = this.cryptoService.generateTicketSignature(
          ticketId,
          showtime.id,
          unitPrice,
          nowIso,
        );

        const ticket = new TicketModel(
          ticketId,
          saleId,
          showtime.id,
          showtime.movieId,
          movieTitle,
          roomName,
          roomType,
          showtime.date,
          showtime.startTime,
          item.type,
          unitPrice,
          'ISSUED',
          nowIso,
          undefined,
          undefined,
          signature,
        );

        generatedTickets.push(ticket);
        totalAmount += unitPrice;
      }
    }

    const paidAmount = input.paidAmount >= totalAmount ? input.paidAmount : totalAmount;
    const changeAmount = Math.max(0, paidAmount - totalAmount);

    const sale = new SaleModel(
      saleId,
      movieTitle,
      showtime.id,
      totalAmount,
      paidAmount,
      changeAmount,
      input.cashierName || 'Admin',
      totalTicketsRequested,
      generatedTickets,
      new Date(),
    );

    // Guardar venta y tickets
    const savedSale = await this.saleRepository.createWithTickets(sale);

    // Descontar aforo de la función
    showtime.reserveSeats(totalTicketsRequested);
    await this.showtimeRepository.updateAvailableSeats(showtime.id, showtime.availableSeats);

    return { sale: savedSale, tickets: generatedTickets };
  }
}
