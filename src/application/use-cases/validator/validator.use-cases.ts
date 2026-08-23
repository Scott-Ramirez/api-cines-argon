import { Injectable, Inject } from '@nestjs/common';
import { ITicketRepository, TICKET_REPOSITORY } from '../../../domain/repositories/ticket.repository.interface';
import { IScanLogRepository, SCAN_LOG_REPOSITORY } from '../../../domain/repositories/scan-log.repository.interface';
import { CryptoService } from '../../../infrastructure/security/crypto.service';
import { TicketModel } from '../../../domain/models/ticket.model';
import { ScanLogModel } from '../../../domain/models/scan-log.model';

export interface ScanTicketInput {
  rawScanString: string;
  scanType?: 'USB_SCANNER' | 'CAMERA' | 'MANUAL';
  validatedBy?: string;
}

export interface ScanResultOutput {
  success: boolean;
  ticket?: TicketModel;
  reason: string;
  scanType: 'USB_SCANNER' | 'CAMERA' | 'MANUAL';
  timestamp: string;
}

@Injectable()
export class ValidateTicketScanUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: ITicketRepository,
    @Inject(SCAN_LOG_REPOSITORY)
    private readonly scanLogRepository: IScanLogRepository,
    private readonly cryptoService: CryptoService,
  ) {}

  async execute(input: ScanTicketInput): Promise<ScanResultOutput> {
    const scanType = input.scanType || 'USB_SCANNER';
    const timestamp = new Date().toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const parsed = this.cryptoService.parseScannedPayload(input.rawScanString);
    const ticketId = parsed.ticketId.trim();

    if (!ticketId) {
      return {
        success: false,
        reason: 'Código vacío o formato ilegible',
        scanType,
        timestamp,
      };
    }

    const ticket = await this.ticketRepository.findById(ticketId);

    if (!ticket) {
      const log = new ScanLogModel(
        'LOG-' + Date.now(),
        ticketId,
        timestamp,
        'NOT_FOUND',
        'Boleto inexistente en la base de datos',
      );
      await this.scanLogRepository.create(log);

      return {
        success: false,
        reason: `Boleto '${ticketId}' no encontrado en el sistema`,
        scanType,
        timestamp,
      };
    }

    if (ticket.isUsed()) {
      const usedTime = ticket.usedAt
        ? new Date(ticket.usedAt).toLocaleTimeString('es-PE')
        : 'previamente';

      const log = new ScanLogModel(
        'LOG-' + Date.now(),
        ticket.id,
        timestamp,
        'ALREADY_USED',
        `Boleto ya fue utilizado a las ${usedTime}`,
        ticket.movieTitle,
        ticket.roomName,
      );
      await this.scanLogRepository.create(log);

      return {
        success: false,
        ticket,
        reason: `⚠️ BOLETO YA UTILIZADO (Ingresó a las ${usedTime})`,
        scanType,
        timestamp,
      };
    }

    if (ticket.isCancelled()) {
      return {
        success: false,
        ticket,
        reason: 'Boleto anulado/cancelado por administración',
        scanType,
        timestamp,
      };
    }

    // Validar firma digital HMAC SHA-256
    const expectedSignature = this.cryptoService.generateTicketSignature(
      ticket.id,
      ticket.showtimeId,
      ticket.price,
      ticket.issuedAt,
    );

    if (ticket.signature !== expectedSignature) {
      const log = new ScanLogModel(
        'LOG-' + Date.now(),
        ticket.id,
        timestamp,
        'INVALID_SIGNATURE',
        'Firma criptográfica inválida o adulterada',
        ticket.movieTitle,
      );
      await this.scanLogRepository.create(log);

      return {
        success: false,
        ticket,
        reason: '🚨 ALERTA: Boleto adulterado o firma digital inválida',
        scanType,
        timestamp,
      };
    }

    // Boleto válido: registrar uso
    ticket.markAsUsed(input.validatedBy || 'Portería Principal');
    await this.ticketRepository.save(ticket);

    const log = new ScanLogModel(
      'LOG-' + Date.now(),
      ticket.id,
      timestamp,
      'VALID',
      'Ingreso Autorizado',
      ticket.movieTitle,
      ticket.roomName,
    );
    await this.scanLogRepository.create(log);

    return {
      success: true,
      ticket,
      reason: '✅ ACCESO AUTORIZADO',
      scanType,
      timestamp,
    };
  }
}

@Injectable()
export class GetScanLogsUseCase {
  constructor(
    @Inject(SCAN_LOG_REPOSITORY)
    private readonly scanLogRepository: IScanLogRepository,
  ) {}

  async execute(limit: number = 50): Promise<ScanLogModel[]> {
    return this.scanLogRepository.findRecent(limit);
  }
}
