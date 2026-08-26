import { Injectable, Inject, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ISaleRepository, SALE_REPOSITORY } from '../../../domain/repositories/sale.repository.interface';
import { IShowtimeRepository, SHOWTIME_REPOSITORY } from '../../../domain/repositories/showtime.repository.interface';
import { IPricingRepository, PRICING_REPOSITORY } from '../../../domain/repositories/pricing.repository.interface';
import { CryptoService } from '../../../infrastructure/security/crypto.service';
import { MercadoPagoService } from '../../../infrastructure/mercadopago/mercadopago.service';
import { SaleModel } from '../../../domain/models/sale.model';
import { TicketModel } from '../../../domain/models/ticket.model';
import { TicketType } from '../../../domain/models/pricing-tier.model';

export interface CartItemInput {
  type: TicketType;
  quantity: number;
  ticketType?: TicketType;
  count?: number;
  unitPrice?: number;
  subtotal?: number;
}

export interface ProcessSaleInput {
  showtimeId: string;
  items: CartItemInput[];
  cashierName?: string;
  paidAmount: number;
  movieId?: string;
  seatCodes?: string[];
  totalAmount?: number;
  changeAmount?: number;
  paymentMethod?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

export interface CreateMercadoPagoPreferenceInput {
  showtimeId: string;
  items: CartItemInput[];
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
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

    const totalTicketsRequested = input.items.reduce(
      (acc, item) => acc + (item.quantity ?? item.count ?? 0),
      0,
    );
    if (totalTicketsRequested <= 0) {
      throw new BadRequestException('Debe seleccionar al menos un boleto');
    }

    // Control de concurrencia atómico: Intentar descontar aforo directamente
    const seatsReserved = await this.showtimeRepository.decrementAvailableSeats(
      showtime.id,
      totalTicketsRequested,
    );
    if (!seatsReserved) {
      throw new BadRequestException(
        `Aforo insuficiente o agotado. Solo quedaban menos de ${totalTicketsRequested} asientos.`,
      );
    }

    const pricingTiers = await this.pricingRepository.findAll();
    const priceMap = new Map<string, number>(pricingTiers.map((p) => [p.type, p.basePrice]));

    const saleId = randomUUID();
    const nowIso = new Date().toISOString();
    const generatedTickets: TicketModel[] = [];
    let totalAmount = 0;

    const movieTitle = showtime.movie ? showtime.movie.title : 'Cine Argón';
    const roomName = showtime.room ? showtime.room.name : 'Sala Principal';
    const roomType = showtime.room ? showtime.room.type : 'VIP Premium';

    let globalTicketIndex = 0;
    for (const item of input.items) {
      const qty = item.quantity ?? item.count ?? 0;
      if (qty <= 0) continue;
      const type = item.type ?? item.ticketType ?? 'GENERAL';
      const basePrice = priceMap.get(type) || 18.0;
      const unitPrice = Number((basePrice * showtime.priceMultiplier).toFixed(2));

      for (let i = 0; i < qty; i++) {
        const ticketId = randomUUID();
        const seat = input.seatCodes?.[globalTicketIndex] || `A-${globalTicketIndex + 1}`;
        globalTicketIndex++;

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
          type,
          unitPrice,
          'ISSUED',
          nowIso,
          undefined,
          undefined,
          signature,
          undefined,
          seat,
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
      input.paymentMethod || 'CASH',
      undefined,
      input.customerName,
      input.customerEmail,
      input.customerPhone,
      'APPROVED',
      new Date(),
    );

    const savedSale = await this.saleRepository.createWithTickets(sale);
    return { sale: savedSale, tickets: generatedTickets };
  }
}

/**
 * USE CASE: Crear preferencia en Mercado Pago (Checkout Pro)
 */
@Injectable()
export class CreateMercadoPagoPreferenceUseCase {
  constructor(
    @Inject(SHOWTIME_REPOSITORY)
    private readonly showtimeRepository: IShowtimeRepository,
    @Inject(PRICING_REPOSITORY)
    private readonly pricingRepository: IPricingRepository,
    private readonly mercadoPagoService: MercadoPagoService,
  ) {}

  async execute(input: CreateMercadoPagoPreferenceInput) {
    const showtime = await this.showtimeRepository.findById(input.showtimeId);
    if (!showtime) {
      throw new NotFoundException('Función no encontrada');
    }

    const totalTicketsRequested = input.items.reduce(
      (acc, item) => acc + (item.quantity ?? item.count ?? 0),
      0,
    );
    if (totalTicketsRequested <= 0) {
      throw new BadRequestException('Debe seleccionar al menos 1 boleto');
    }

    if (showtime.availableSeats < totalTicketsRequested) {
      throw new BadRequestException(
        `Aforo insuficiente. Solo quedan ${showtime.availableSeats} asientos disponibles.`,
      );
    }

    const pricingTiers = await this.pricingRepository.findAll();
    const priceMap = new Map<string, number>(pricingTiers.map((p) => [p.type, p.basePrice]));

    const movieTitle = showtime.movie ? showtime.movie.title : 'Cine Argón Tamanco';

    const preferenceItems = input.items
      .filter((item) => (item.quantity ?? item.count ?? 0) > 0)
      .map((item) => {
        const qty = item.quantity ?? item.count ?? 1;
        const type = item.type ?? item.ticketType ?? 'GENERAL';
        const basePrice = priceMap.get(type) || 18.0;
        const unitPrice = Number((basePrice * showtime.priceMultiplier).toFixed(2));

        return {
          id: `TICKET-${type}-${showtime.id}`,
          title: `Entrada ${type} - ${movieTitle}`,
          quantity: qty,
          unit_price: unitPrice,
          currency_id: 'PEN',
          description: `Función ${showtime.date} ${showtime.startTime} en Tamanco Viejo`,
        };
      });

    return this.mercadoPagoService.createCheckoutPreference({
      items: preferenceItems,
      showtimeId: showtime.id,
      movieTitle,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone,
      seatCount: totalTicketsRequested,
    });
  }
}

/**
 * USE CASE: Procesar Webhook Server-to-Server de Mercado Pago (Anti-Cobros Fantasmas & Idempotencia)
 */
@Injectable()
export class ProcessMercadoPagoWebhookUseCase {
  private readonly logger = new Logger(ProcessMercadoPagoWebhookUseCase.name);

  constructor(
    @Inject(SALE_REPOSITORY)
    private readonly saleRepository: ISaleRepository,
    @Inject(SHOWTIME_REPOSITORY)
    private readonly showtimeRepository: IShowtimeRepository,
    @Inject(PRICING_REPOSITORY)
    private readonly pricingRepository: IPricingRepository,
    private readonly cryptoService: CryptoService,
    private readonly mercadoPagoService: MercadoPagoService,
  ) {}

  async execute(paymentId: string | number): Promise<{ success: boolean; saleId?: string }> {
    const paymentIdStr = String(paymentId);

    // 1. Verificar si ya fue procesado (IDEMPOTENCIA - Evita duplicados)
    const existingSale = await this.saleRepository.findByExternalPaymentId(paymentIdStr);
    if (existingSale) {
      this.logger.log(`Pago ${paymentIdStr} ya fue procesado anteriormente para la venta ${existingSale.id}`);
      return { success: true, saleId: existingSale.id };
    }

    // 2. Consultar directamente a Mercado Pago (VERIFICACIÓN SERVER-TO-SERVER)
    const payment = await this.mercadoPagoService.getPayment(paymentIdStr);
    if (!payment || payment.status !== 'approved') {
      this.logger.warn(`Pago ${paymentIdStr} no está aprobado (estado actual: ${payment?.status})`);
      return { success: false };
    }

    const metadata = payment.metadata || {};
    const showtimeId = metadata.showtime_id || metadata.showtimeId;
    const customerName = metadata.customer_name || metadata.customerName || payment.payer?.first_name || 'Cliente Web';
    const customerEmail = metadata.customer_email || metadata.customerEmail || payment.payer?.email;
    const customerPhone = metadata.customer_phone || metadata.customerPhone || payment.payer?.phone?.number;

    if (!showtimeId) {
      this.logger.error(`Pago ${paymentIdStr} no contiene showtimeId en sus metadatos`);
      return { success: false };
    }

    const showtime = await this.showtimeRepository.findById(showtimeId);
    if (!showtime) {
      this.logger.error(`Función ${showtimeId} no existe en la base de datos`);
      return { success: false };
    }

    // Parse items from metadata or payment items
    let rawItems: any[] = [];
    try {
      if (metadata.items) {
        rawItems = typeof metadata.items === 'string' ? JSON.parse(metadata.items) : metadata.items;
      }
    } catch {
      rawItems = [];
    }

    const totalTickets = Number(metadata.seat_count || metadata.seatCount || payment.additional_info?.items?.length || 1);

    // 3. Control de Concurrencia Atómico: Descontar asientos
    const reserved = await this.showtimeRepository.decrementAvailableSeats(showtime.id, totalTickets);
    if (!reserved) {
      // Si se agotó el aforo concurrentemente, procesar reembolso automático de inmediato
      this.logger.error(`Aforo agotado concurrentemente para showtime ${showtime.id}. Procediendo a reembolso automático de ${paymentIdStr}`);
      await this.mercadoPagoService.refundPayment(paymentIdStr);
      return { success: false };
    }

    // 4. Generar Venta y Boletos Firmados
    const saleId = randomUUID();
    const nowIso = new Date().toISOString();
    const generatedTickets: TicketModel[] = [];
    let totalAmount = Number(payment.transaction_amount || 0);

    const movieTitle = showtime.movie ? showtime.movie.title : 'Cine Argón Tamanco';
    const roomName = showtime.room ? showtime.room.name : 'Sala Principal';
    const roomType = showtime.room ? showtime.room.type : 'VIP Premium';

    const unitPrice = totalTickets > 0 ? Number((totalAmount / totalTickets).toFixed(2)) : totalAmount;

    const seatCodes: string[] = metadata.seat_codes ? (Array.isArray(metadata.seat_codes) ? metadata.seat_codes : metadata.seat_codes.split(',')) : [];

    for (let i = 0; i < totalTickets; i++) {
      const ticketId = randomUUID();
      const seat = seatCodes[i] || `A-${i + 1}`;
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
        'GENERAL',
        unitPrice,
        'ISSUED',
        nowIso,
        undefined,
        undefined,
        signature,
        undefined,
        seat,
      );

      generatedTickets.push(ticket);
    }

    const sale = new SaleModel(
      saleId,
      movieTitle,
      showtime.id,
      totalAmount,
      totalAmount,
      0,
      'Mercado Pago Web',
      totalTickets,
      generatedTickets,
      'MERCADO_PAGO',
      paymentIdStr,
      customerName,
      customerEmail,
      customerPhone,
      'APPROVED',
      new Date(),
    );

    const saved = await this.saleRepository.createWithTickets(sale);
    this.logger.log(`Venta web ${saved.id} procesada exitosamente con Mercado Pago ID: ${paymentIdStr}`);

    return { success: true, saleId: saved.id };
  }
}

/**
 * USE CASE: Reembolso de Dinero (Mercado Pago API + Devolución de Aforo)
 */
@Injectable()
export class RefundSaleUseCase {
  private readonly logger = new Logger(RefundSaleUseCase.name);

  constructor(
    @Inject(SALE_REPOSITORY)
    private readonly saleRepository: ISaleRepository,
    @Inject(SHOWTIME_REPOSITORY)
    private readonly showtimeRepository: IShowtimeRepository,
    private readonly mercadoPagoService: MercadoPagoService,
  ) {}

  async execute(saleId: string): Promise<{ success: boolean; message: string }> {
    const sale = await this.saleRepository.findById(saleId);
    if (!sale) {
      throw new NotFoundException(`Venta con ID '${saleId}' no encontrada`);
    }

    if (sale.status === 'REFUNDED') {
      throw new BadRequestException('Esta venta ya fue reembolsada anteriormente');
    }

    // Si fue pagada por Mercado Pago, solicitar reembolso oficial a la pasarela
    if (sale.paymentMethod === 'MERCADO_PAGO' && sale.externalPaymentId) {
      try {
        await this.mercadoPagoService.refundPayment(sale.externalPaymentId);
        this.logger.log(`Reembolso solicitado exitosamente en Mercado Pago para ID: ${sale.externalPaymentId}`);
      } catch (err: any) {
        this.logger.error(`Error al solicitar reembolso en Mercado Pago: ${err.message}`);
        throw new BadRequestException(`No se pudo procesar el reembolso en Mercado Pago: ${err.message}`);
      }
    }

    // Cancelar venta y boletos en base de datos
    await this.saleRepository.cancelSaleAndTickets(sale.id);

    // Restaurar aforo de la función
    await this.showtimeRepository.incrementAvailableSeats(sale.showtimeId, sale.totalTickets);

    return {
      success: true,
      message: `Venta ${saleId} reembolsada exitosamente y ${sale.totalTickets} asientos devueltos al aforo.`,
    };
  }
}
