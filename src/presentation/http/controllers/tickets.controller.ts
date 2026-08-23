import { Controller, Get, Param, Query, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import {
  GetTicketsUseCase,
  GetTicketByIdUseCase,
  GetTicketsBySaleUseCase,
  CancelTicketUseCase,
} from '../../../application/use-cases/tickets/tickets.use-cases';
import { TicketStatus } from '../../../domain/models/ticket.model';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@ApiTags('Tickets')
@Controller('tickets')
export class TicketsController {
  constructor(
    private readonly getTicketsUseCase: GetTicketsUseCase,
    private readonly getTicketByIdUseCase: GetTicketByIdUseCase,
    private readonly getTicketsBySaleUseCase: GetTicketsBySaleUseCase,
    private readonly cancelTicketUseCase: CancelTicketUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar boletos emitidos' })
  @ApiQuery({ name: 'status', enum: ['ISSUED', 'USED', 'CANCELLED'], required: false })
  @ApiQuery({ name: 'showtimeId', required: false })
  findAll(@Query('status') status?: TicketStatus, @Query('showtimeId') showtimeId?: string) {
    return this.getTicketsUseCase.execute(status, showtimeId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener boleto por ID' })
  findOne(@Param('id') id: string) {
    return this.getTicketByIdUseCase.execute(id);
  }

  @Get('sale/:saleId')
  @ApiOperation({ summary: 'Listar boletos de una venta específica' })
  findBySale(@Param('saleId') saleId: string) {
    return this.getTicketsBySaleUseCase.execute(saleId);
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancelar o anular un boleto (Admin)' })
  cancelTicket(@Param('id') id: string) {
    return this.cancelTicketUseCase.execute(id);
  }
}
