import { Controller, Get, Put, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  GetPricingUseCase,
  SavePricingBatchUseCase,
  SavePricingTierUseCase,
} from '../../../application/use-cases/pricing/pricing.use-cases';

@ApiTags('Pricing')
@Controller('pricing')
export class PricingController {
  constructor(
    private readonly getPricingUseCase: GetPricingUseCase,
    private readonly savePricingBatchUseCase: SavePricingBatchUseCase,
    private readonly savePricingTierUseCase: SavePricingTierUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener el tarifario de boletos' })
  findAll() {
    return this.getPricingUseCase.execute();
  }

  @Put()
  @ApiOperation({ summary: 'Actualizar lote de tarifas de boletos' })
  @ApiResponse({ status: 200, description: 'Tarifas actualizadas exitosamente' })
  saveBatch(@Body() body: any) {
    const tiers = Array.isArray(body) ? body : (body?.tiers || (body?.type ? [body] : []));
    return this.savePricingBatchUseCase.execute(tiers);
  }

  @Post()
  @ApiOperation({ summary: 'Crear o actualizar una tarifa individual' })
  createOrUpdate(@Body() body: any) {
    return this.savePricingTierUseCase.execute(body);
  }
}
