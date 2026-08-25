import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, Preference, Payment, PaymentRefund } from 'mercadopago';

export interface CreatePreferenceItem {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
  currency_id?: string;
  description?: string;
}

export interface CreatePreferenceOptions {
  items: CreatePreferenceItem[];
  showtimeId: string;
  movieTitle: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  seatCount: number;
}

@Injectable()
export class MercadoPagoService {
  private readonly logger = new Logger(MercadoPagoService.name);
  private client: MercadoPagoConfig;
  private preferenceClient: Preference;
  private paymentClient: Payment;
  private refundClient: PaymentRefund;

  constructor(private readonly configService: ConfigService) {
    const accessToken =
      this.configService.get<string>('MERCADOPAGO_ACCESS_TOKEN') ||
      'APP_USR-8772517522809669-082509-0b44fe2da81cfc9e29a99ea7ba79ce58-618582085';

    this.client = new MercadoPagoConfig({
      accessToken: accessToken.trim(),
      options: { timeout: 10000 },
    });

    this.preferenceClient = new Preference(this.client);
    this.paymentClient = new Payment(this.client);
    this.refundClient = new PaymentRefund(this.client);
  }

  /**
   * Crea una preferencia de pago en Mercado Pago (Checkout Pro)
   */
  async createCheckoutPreference(options: CreatePreferenceOptions) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';

    try {
      const isLocalhost = frontendUrl.includes('localhost') || frontendUrl.includes('127.0.0.1');

      const preferencePayload: any = {
        items: options.items.map((item) => ({
          id: item.id,
          title: item.title,
          quantity: item.quantity,
          unit_price: item.unit_price,
          currency_id: item.currency_id || 'PEN',
          description: item.description || `Entradas Cines Argón - ${options.movieTitle}`,
        })),
        payer: {
          name: options.customerName || 'Cliente Cines Argón',
          email: options.customerEmail || 'cliente@cinesargon.pe',
          phone: options.customerPhone ? { number: options.customerPhone } : undefined,
        },
        back_urls: {
          success: `${frontendUrl}/?payment_status=success`,
          failure: `${frontendUrl}/?payment_status=failure`,
          pending: `${frontendUrl}/?payment_status=pending`,
        },
        statement_descriptor: 'CINES ARGON TAMANCO',
        expires: true,
        expiration_date_to: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutos
        metadata: {
          showtimeId: options.showtimeId,
          movieTitle: options.movieTitle,
          seatCount: options.seatCount,
          customerName: options.customerName,
          customerEmail: options.customerEmail,
          customerPhone: options.customerPhone,
          items: JSON.stringify(options.items),
        },
      };

      // Mercado Pago API rechaza auto_return cuando back_urls contiene localhost
      if (!isLocalhost) {
        preferencePayload.auto_return = 'approved';
      }

      const result = await this.preferenceClient.create({
        body: preferencePayload,
      });


      return {
        preferenceId: result.id,
        initPoint: result.init_point,
        sandboxInitPoint: result.sandbox_init_point,
      };
    } catch (error: any) {
      this.logger.error('Error al crear preferencia de Mercado Pago:', error);
      throw error;
    }
  }

  /**
   * Obtiene y valida un pago directamente del servidor de Mercado Pago (Anti-fraude)
   */
  async getPayment(paymentId: string | number) {
    try {
      const payment = await this.paymentClient.get({ id: String(paymentId) });
      return payment;
    } catch (error: any) {
      this.logger.error(`Error al consultar pago ${paymentId} en Mercado Pago:`, error);
      throw error;
    }
  }

  /**
   * Procesa la devolución/reembolso de dinero de una transacción
   */
  async refundPayment(paymentId: string | number, amount?: number) {
    try {
      const body = amount ? { amount } : {};
      const refund = await this.refundClient.create({
        payment_id: String(paymentId),
        body,
      });
      return refund;
    } catch (error: any) {
      this.logger.error(`Error al reembolsar pago ${paymentId} en Mercado Pago:`, error);
      throw error;
    }
  }
}
