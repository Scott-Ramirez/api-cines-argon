import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ScanResultOutput } from '../../application/use-cases/validator/validator.use-cases';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class ValidatorGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ValidatorGateway.name);
  private connectedClients = new Map<string, { terminalId?: string; role?: string }>();

  handleConnection(client: Socket) {
    this.logger.log(`🔌 Cliente WebSocket conectado: ${client.id}`);
    this.connectedClients.set(client.id, {});
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`🔌 Cliente WebSocket desconectado: ${client.id}`);
    this.connectedClients.delete(client.id);
  }

  @SubscribeMessage('join-terminal')
  handleJoinTerminal(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { terminalId: string; role?: string },
  ) {
    const terminalId = data?.terminalId || 'DEFAULT_TERMINAL';
    client.join(terminalId);
    this.connectedClients.set(client.id, { terminalId, role: data?.role });
    this.logger.log(`📱 Cliente ${client.id} (${data?.role || 'lector'}) unido a terminal: ${terminalId}`);
    return { success: true, message: `Conectado a terminal '${terminalId}'`, terminalId };
  }

  @SubscribeMessage('ping')
  handlePing() {
    return { event: 'pong', timestamp: new Date().toISOString() };
  }

  /**
   * Emite el resultado de una validación a todos los clientes suscritos
   */
  emitTicketScanned(scanResult: ScanResultOutput, terminalId?: string) {
    this.logger.log(`📡 Emitiendo evento 'ticket:validated' (${scanResult.success ? 'VALID' : 'INVALID'})`);
    
    // Si hay un terminalId específico, emitir a esa sala; además emitir globalmente
    if (terminalId) {
      this.server.to(terminalId).emit('ticket:validated', scanResult);
    }
    this.server.emit('ticket:validated', scanResult);
  }

  /**
   * Permite que el móvil envíe un código directamente a la PC
   */
  @SubscribeMessage('remote:scan')
  handleRemoteScan(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { rawCode: string; terminalId?: string },
  ) {
    this.logger.log(`🔫 Código remoto recibido de ${client.id}: ${data?.rawCode}`);
    if (data?.terminalId) {
      this.server.to(data.terminalId).emit('remote:scanned_code', { rawCode: data.rawCode });
    } else {
      this.server.emit('remote:scanned_code', { rawCode: data.rawCode });
    }
    return { success: true };
  }
}
