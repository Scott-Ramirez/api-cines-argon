import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import {
  GetShowtimesUseCase,
  GetShowtimeByIdUseCase,
  CreateShowtimeUseCase,
  UpdateShowtimeUseCase,
  DeleteShowtimeUseCase,
} from '../../../application/use-cases/showtimes/showtimes.use-cases';
import { CreateShowtimeDto, UpdateShowtimeDto } from '../dtos';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@ApiTags('Showtimes')
@Controller('showtimes')
export class ShowtimesController {
  constructor(
    private readonly getShowtimesUseCase: GetShowtimesUseCase,
    private readonly getShowtimeByIdUseCase: GetShowtimeByIdUseCase,
    private readonly createShowtimeUseCase: CreateShowtimeUseCase,
    private readonly updateShowtimeUseCase: UpdateShowtimeUseCase,
    private readonly deleteShowtimeUseCase: DeleteShowtimeUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar funciones programadas' })
  @ApiQuery({ name: 'date', required: false, description: 'Filtrar por fecha YYYY-MM-DD' })
  @ApiQuery({ name: 'movieId', required: false, description: 'Filtrar por ID de película' })
  findAll(@Query('date') date?: string, @Query('movieId') movieId?: string) {
    return this.getShowtimesUseCase.execute(date, movieId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalles de una función' })
  findOne(@Param('id') id: string) {
    return this.getShowtimeByIdUseCase.execute(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear una nueva función (Admin)' })
  @ApiResponse({ status: 201, description: 'Función programada con éxito' })
  create(@Body() dto: CreateShowtimeDto) {
    return this.createShowtimeUseCase.execute(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar una función (Admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateShowtimeDto) {
    return this.updateShowtimeUseCase.execute(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar una función (Admin)' })
  remove(@Param('id') id: string) {
    return this.deleteShowtimeUseCase.execute(id);
  }
}
