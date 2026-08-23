import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  GetSalesUseCase,
  GetSaleByIdUseCase,
  ProcessSaleUseCase,
} from '../../../application/use-cases/sales/sales.use-cases';
import { ProcessSaleDto } from '../dtos';

@ApiTags('Sales (Ventas POS)')
@Controller('sales')
export class SalesController {
  constructor(
    private readonly getSalesUseCase: GetSalesUseCase,
    private readonly getSaleByIdUseCase: GetSaleByIdUseCase,
    private readonly processSaleUseCase: ProcessSaleUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar historial de ventas realizadas' })
  findAll() {
    return this.getSalesUseCase.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de una venta por ID' })
  findOne(@Param('id') id: string) {
    return this.getSaleByIdUseCase.execute(id);
  }

  @Post()
  @ApiOperation({ summary: 'Procesar venta de boletos y generar tickets firmados' })
  @ApiResponse({ status: 201, description: 'Venta completada con éxito y boletos generados' })
  processSale(@Body() dto: ProcessSaleDto) {
    return this.processSaleUseCase.execute(dto);
  }
}
