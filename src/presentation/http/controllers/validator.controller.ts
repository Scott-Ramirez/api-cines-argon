import { Controller, Post, Get, Delete, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import {
  ValidateTicketScanUseCase,
  GetScanLogsUseCase,
  ClearScanLogsUseCase,
} from '../../../application/use-cases/validator/validator.use-cases';
import { ScanTicketDto } from '../dtos';
import { ValidatorGateway } from '../../gateways/validator.gateway';

@ApiTags('Validator (Control de Acceso / Portería)')
@Controller('validator')
export class ValidatorController {
  constructor(
    private readonly validateTicketScanUseCase: ValidateTicketScanUseCase,
    private readonly getScanLogsUseCase: GetScanLogsUseCase,
    private readonly clearScanLogsUseCase: ClearScanLogsUseCase,
    private readonly validatorGateway: ValidatorGateway,
  ) {}

  @Post('scan')
  @ApiOperation({ summary: 'Escanear y validar boleto (Lector USB / Cámara / Manual)' })
  @ApiResponse({ status: 200, description: 'Resultado de la validación del boleto' })
  async validateScan(@Body() dto: ScanTicketDto) {
    const result = await this.validateTicketScanUseCase.execute(dto);
    this.validatorGateway.emitTicketScanned(result);
    return result;
  }

  @Get('logs')
  @ApiOperation({ summary: 'Obtener historial de escaneos y accesos' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getLogs(@Query('limit') limit?: string) {
    const take = limit ? parseInt(limit, 10) : 50;
    return this.getScanLogsUseCase.execute(take);
  }

  @Delete('logs')
  @ApiOperation({ summary: 'Limpiar o vaciar historial de escaneos' })
  async clearLogs() {
    await this.clearScanLogsUseCase.execute();
    this.validatorGateway.server.emit('logs:cleared', { timestamp: new Date().toISOString() });
    return { success: true, message: 'Historial de escaneos limpiado correctamente' };
  }
}
