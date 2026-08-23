import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import {
  ValidateTicketScanUseCase,
  GetScanLogsUseCase,
} from '../../../application/use-cases/validator/validator.use-cases';
import { ScanTicketDto } from '../dtos';

@ApiTags('Validator (Control de Acceso / Portería)')
@Controller('validator')
export class ValidatorController {
  constructor(
    private readonly validateTicketScanUseCase: ValidateTicketScanUseCase,
    private readonly getScanLogsUseCase: GetScanLogsUseCase,
  ) {}

  @Post('scan')
  @ApiOperation({ summary: 'Escanear y validar boleto (Lector USB / Cámara / Manual)' })
  @ApiResponse({ status: 200, description: 'Resultado de la validación del boleto' })
  validateScan(@Body() dto: ScanTicketDto) {
    return this.validateTicketScanUseCase.execute(dto);
  }

  @Get('logs')
  @ApiOperation({ summary: 'Obtener historial de escaneos y accesos' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getLogs(@Query('limit') limit?: string) {
    const take = limit ? parseInt(limit, 10) : 50;
    return this.getScanLogsUseCase.execute(take);
  }
}
