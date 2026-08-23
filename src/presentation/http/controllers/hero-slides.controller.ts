import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import {
  GetHeroSlidesUseCase,
  GetHeroSlideByIdUseCase,
  CreateHeroSlideUseCase,
  UpdateHeroSlideUseCase,
  ToggleHeroSlideUseCase,
  DeleteHeroSlideUseCase,
} from '../../../application/use-cases/hero-slides/hero-slides.use-cases';
import { CreateHeroSlideDto, UpdateHeroSlideDto } from '../dtos';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@ApiTags('Hero Slides')
@Controller('hero-slides')
export class HeroSlidesController {
  constructor(
    private readonly getHeroSlidesUseCase: GetHeroSlidesUseCase,
    private readonly getHeroSlideByIdUseCase: GetHeroSlideByIdUseCase,
    private readonly createHeroSlideUseCase: CreateHeroSlideUseCase,
    private readonly updateHeroSlideUseCase: UpdateHeroSlideUseCase,
    private readonly toggleHeroSlideUseCase: ToggleHeroSlideUseCase,
    private readonly deleteHeroSlideUseCase: DeleteHeroSlideUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar slides del carrusel' })
  @ApiQuery({ name: 'activeOnly', required: false, type: Boolean })
  findAll(@Query('activeOnly') activeOnly?: string) {
    const isOnlyActive = activeOnly === 'true';
    return this.getHeroSlidesUseCase.execute(isOnlyActive);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un slide por ID' })
  findOne(@Param('id') id: string) {
    return this.getHeroSlideByIdUseCase.execute(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear un nuevo slide (Admin)' })
  @ApiResponse({ status: 201, description: 'Slide creado con éxito' })
  create(@Body() dto: CreateHeroSlideDto) {
    return this.createHeroSlideUseCase.execute(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar un slide (Admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateHeroSlideDto) {
    return this.updateHeroSlideUseCase.execute(id, dto);
  }

  @Patch(':id/toggle')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Alternar estado activo/inactivo (Admin)' })
  toggleActive(@Param('id') id: string) {
    return this.toggleHeroSlideUseCase.execute(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un slide (Admin)' })
  remove(@Param('id') id: string) {
    return this.deleteHeroSlideUseCase.execute(id);
  }
}
