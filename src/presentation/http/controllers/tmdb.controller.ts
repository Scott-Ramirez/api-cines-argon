import { Controller, Get, Post, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import {
  SearchTmdbMoviesUseCase,
  GetTmdbNowPlayingUseCase,
  GetTmdbPopularUseCase,
  GetTmdbMovieDetailsUseCase,
  ImportTmdbMovieUseCase,
} from '../../../application/use-cases/tmdb/tmdb.use-cases';
import { MovieStatus } from '../../../domain/models/movie.model';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@ApiTags('TMDB (The Movie Database Integration)')
@Controller('tmdb')
export class TmdbController {
  constructor(
    private readonly searchTmdbMoviesUseCase: SearchTmdbMoviesUseCase,
    private readonly getTmdbNowPlayingUseCase: GetTmdbNowPlayingUseCase,
    private readonly getTmdbPopularUseCase: GetTmdbPopularUseCase,
    private readonly getTmdbMovieDetailsUseCase: GetTmdbMovieDetailsUseCase,
    private readonly importTmdbMovieUseCase: ImportTmdbMovieUseCase,
  ) {}

  @Get('search')
  @ApiOperation({ summary: 'Buscar películas en TMDB por título' })
  @ApiQuery({ name: 'query', required: true, description: 'Título a buscar' })
  @ApiQuery({ name: 'language', required: false, description: 'Código de idioma (ej. es-MX, es-ES)' })
  search(@Query('query') query: string, @Query('language') language?: string) {
    return this.searchTmdbMoviesUseCase.execute(query, language);
  }

  @Get('now-playing')
  @ApiOperation({ summary: 'Listar películas en cartelera mundial desde TMDB' })
  @ApiQuery({ name: 'language', required: false })
  getNowPlaying(@Query('language') language?: string) {
    return this.getTmdbNowPlayingUseCase.execute(language);
  }

  @Get('popular')
  @ApiOperation({ summary: 'Listar películas más populares desde TMDB' })
  @ApiQuery({ name: 'language', required: false })
  getPopular(@Query('language') language?: string) {
    return this.getTmdbPopularUseCase.execute(language);
  }

  @Get('details/:tmdbId')
  @ApiOperation({ summary: 'Obtener detalles completos, carátula HD, director y tráiler de TMDB' })
  @ApiQuery({ name: 'language', required: false })
  getDetails(@Param('tmdbId') tmdbId: string, @Query('language') language?: string) {
    return this.getTmdbMovieDetailsUseCase.execute(tmdbId, language);
  }

  @Post('import/:tmdbId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Importar película desde TMDB directamente a la base de datos (Admin)' })
  @ApiResponse({ status: 201, description: 'Película importada con éxito al catálogo' })
  importMovie(
    @Param('tmdbId') tmdbId: string,
    @Body('status') status?: MovieStatus,
    @Query('language') language?: string,
  ) {
    return this.importTmdbMovieUseCase.execute(tmdbId, status || 'CARTELERA', language);
  }
}
