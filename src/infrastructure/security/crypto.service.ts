import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class CryptoService {
  private readonly secretSalt: string;

  constructor() {
    this.secretSalt = process.env.TICKET_SIGNATURE_SALT || 'ARGON_CINEMA_SECURE_HMAC_SALT_2026';
  }

  generateTicketSignature(
    ticketId: string,
    showtimeId: string,
    price: number,
    issuedAt: string,
  ): string {
    const data = `${ticketId}|${showtimeId}|${price}|${issuedAt}|${this.secretSalt}`;
    const hash = crypto.createHash('sha256').update(data).digest('hex');
    return hash.substring(0, 16);
  }

  formatQrPayload(ticket: {
    id: string;
    showtimeId: string;
    price: number;
    signature: string;
  }): string {
    return `ARGON-V1|${ticket.id}|${ticket.showtimeId}|${ticket.price}|${ticket.signature}`;
  }

  parseScannedPayload(raw: string): {
    ticketId: string;
    showtimeId?: string;
    price?: number;
    signature?: string;
    raw: string;
  } {
    const clean = raw.trim();
    if (clean.startsWith('ARGON-V1|') || clean.startsWith('ARGON|')) {
      const parts = clean.split('|');
      return {
        ticketId: parts[1] || '',
        showtimeId: parts[2] || undefined,
        price: parts[3] ? parseFloat(parts[3]) : undefined,
        signature: parts[4] || undefined,
        raw: clean,
      };
    }
    return {
      ticketId: clean,
      raw: clean,
    };
  }
}
