import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import {
  GetMoviesUseCase,
  GetMovieByIdUseCase,
  CreateMovieUseCase,
  UpdateMovieUseCase,
  DeleteMovieUseCase,
} from '../../../application/use-cases/movies/movies.use-cases';
import { CreateMovieDto, UpdateMovieDto } from '../dtos';
import { MovieStatus } from '../../../domain/models/movie.model';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  constructor(
    private readonly getMoviesUseCase: GetMoviesUseCase,
    private readonly getMovieByIdUseCase: GetMovieByIdUseCase,
    private readonly createMovieUseCase: CreateMovieUseCase,
    private readonly updateMovieUseCase: UpdateMovieUseCase,
    private readonly deleteMovieUseCase: DeleteMovieUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas las películas' })
  @ApiQuery({ name: 'status', enum: ['CARTELERA', 'PROXIMAMENTE', 'ARCHIVADA'], required: false })
  findAll(@Query('status') status?: MovieStatus) {
    return this.getMoviesUseCase.execute(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una película por ID' })
  findOne(@Param('id') id: string) {
    return this.getMovieByIdUseCase.execute(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear una nueva película (Admin)' })
  @ApiResponse({ status: 201, description: 'Película creada exitosamente' })
  create(@Body() dto: CreateMovieDto) {
    return this.createMovieUseCase.execute(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar una película (Admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateMovieDto) {
    return this.updateMovieUseCase.execute(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar una película (Admin)' })
  remove(@Param('id') id: string) {
    return this.deleteMovieUseCase.execute(id);
  }
}
