import { Controller, Get, Put, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import {
  GetPricingUseCase,
  SavePricingBatchUseCase,
  SavePricingTierUseCase,
} from '../../../application/use-cases/pricing/pricing.use-cases';
import { CreatePricingTierDto, UpdateBatchPricingDto } from '../dtos';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar lote de tarifas de boletos (Admin)' })
  @ApiResponse({ status: 200, description: 'Tarifas actualizadas exitosamente' })
  saveBatch(@Body() dto: UpdateBatchPricingDto) {
    return this.savePricingBatchUseCase.execute(dto.tiers);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear o actualizar una tarifa individual (Admin)' })
  createOrUpdate(@Body() dto: CreatePricingTierDto) {
    return this.savePricingTierUseCase.execute(dto);
  }
}
