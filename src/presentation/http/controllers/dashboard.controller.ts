import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GetDashboardStatsUseCase } from '../../../application/use-cases/dashboard/dashboard.use-cases';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly getDashboardStatsUseCase: GetDashboardStatsUseCase) {}

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener métricas y resumen del cine (Admin)' })
  getStats() {
    return this.getDashboardStatsUseCase.execute();
  }
}
