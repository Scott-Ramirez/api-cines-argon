import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import {
  CreateMercadoPagoPreferenceUseCase,
  ProcessMercadoPagoWebhookUseCase,
  RefundSaleUseCase,
} from '../../../application/use-cases/sales/sales.use-cases';
import {
  CreatePaymentPreferenceDto,
  MercadoPagoWebhookDto,
  RefundPaymentDto,
} from '../dtos';
import { ISaleRepository, SALE_REPOSITORY } from '../../../domain/repositories/sale.repository.interface';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@ApiTags('Payments (Pasarela Mercado Pago)')
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly createPreferenceUseCase: CreateMercadoPagoPreferenceUseCase,
    private readonly processWebhookUseCase: ProcessMercadoPagoWebhookUseCase,
    private readonly refundSaleUseCase: RefundSaleUseCase,
    @Inject(SALE_REPOSITORY)
    private readonly saleRepository: ISaleRepository,
  ) {}

  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @Post('mercadopago/preference')
  @ApiOperation({
    summary: 'Crear preferencia de pago en Mercado Pago (Checkout Pro)',
    description: 'Genera el ID de preferencia y la URL segura para realizar el pago de entradas.',
  })
  @ApiResponse({ status: 201, description: 'Preferencia creada exitosamente' })
  async createPreference(@Body() dto: CreatePaymentPreferenceDto) {
    return this.createPreferenceUseCase.execute({
      showtimeId: dto.showtimeId,
      items: dto.items,
      customerName: dto.customerName,
      customerEmail: dto.customerEmail,
      customerPhone: dto.customerPhone,
    });
  }

  @Post('mercadopago/webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Webhook Server-to-Server de Mercado Pago (Anti-Cobros Fantasmas & Idempotente)',
    description: 'Recibe notificaciones oficiales de pagos aprobados y emite los boletos de forma segura.',
  })
  async handleWebhook(
    @Body() body: MercadoPagoWebhookDto,
    @Query('id') queryId?: string,
    @Query('topic') queryTopic?: string,
    @Query('type') queryType?: string,
    @Query('data.id') queryDataId?: string,
  ) {
    // Extraer paymentId de body o query params
    const paymentId =
      body?.data?.id ||
      body?.id ||
      queryDataId ||
      queryId;

    const topic = body?.type || body?.topic || queryType || queryTopic;

    if (paymentId && (topic === 'payment' || !topic)) {
      await this.processWebhookUseCase.execute(paymentId);
    }

    return { received: true };
  }

  @Get('sales/by-payment/:paymentId')
  @ApiOperation({
    summary: 'Obtener venta y boletos confirmados por ID de pago de Mercado Pago',
    description: 'Utilizado por el frontend al retornar del checkout para mostrar los boletos generados.',
  })
  async getSaleByPaymentId(@Param('paymentId') paymentId: string) {
    // Si aún no se ha procesado por webhook pero el usuario ya volvió, procesarlo al instante
    await this.processWebhookUseCase.execute(paymentId);

    const sale = await this.saleRepository.findByExternalPaymentId(paymentId);
    if (!sale) {
      throw new NotFoundException(`No se encontró venta asociada al pago '${paymentId}'`);
    }
    return sale;
  }

  @Post('mercadopago/refund')
  @ApiOperation({
    summary: 'Reembolsar venta y boletos emitidos por Mercado Pago',
    description: 'Devuelve el dinero a la tarjeta/cuenta del cliente y restaura el aforo.',
  })
  @ApiResponse({ status: 200, description: 'Reembolso procesado exitosamente' })
  async refundPayment(@Body() dto: RefundPaymentDto) {
    return this.refundSaleUseCase.execute(dto.saleId);
  }
}
