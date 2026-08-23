import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import {
  ITmdbService,
  TmdbMovieResult,
  TmdbMovieDetails,
} from '../../domain/services/tmdb.service.interface';

@Injectable()
export class TmdbService implements ITmdbService {
  private readonly logger = new Logger(TmdbService.name);
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly imageBaseUrl: string;

  constructor() {
    this.apiKey = process.env.TMDB_API_KEY || '';
    this.baseUrl = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';
    this.imageBaseUrl = process.env.TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';

    if (!this.apiKey) {
      this.logger.warn('⚠️ TMDB_API_KEY no está configurada en .env');
    }
  }

  private ensureApiKey(): void {
    if (!this.apiKey) {
      throw new BadRequestException(
        'TMDB_API_KEY no está configurada en el servidor. Por favor define TMDB_API_KEY en tu archivo .env.',
      );
    }
  }

  private async fetchTmdb<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    this.ensureApiKey();
    const url = new URL(`${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`);
    url.searchParams.set('api_key', this.apiKey);

    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        url.searchParams.set(key, val);
      }
    });

    try {
      const response = await fetch(url.toString(), {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`TMDB API Error [${response.status}]: ${errorText}`);
        throw new BadRequestException(`Error de comunicación con TMDB (${response.status})`);
      }

      return (await response.json()) as T;
    } catch (err: any) {
      if (err instanceof BadRequestException) throw err;
      this.logger.error('Error al consultar TMDB API', err);
      throw new BadRequestException('No se pudo conectar con el servicio de TheMovieDB');
    }
  }

  private formatPosterUrl(path?: string, size: string = 'w780'): string {
    if (!path) return 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800';
    return `${this.imageBaseUrl}/${size}${path}`;
  }

  private formatBackdropUrl(path?: string, size: string = 'original'): string {
    if (!path) return 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600';
    return `${this.imageBaseUrl}/${size}${path}`;
  }

  private mapRating(tmdbCert?: string, adult: boolean = false): 'APT' | '14+' | '18+' | 'TE' {
    if (adult) return '18+';
    if (!tmdbCert) return '14+';
    const c = tmdbCert.toUpperCase().trim();
    if (['G', 'PG', 'APT', 'AA', 'A', '0+', '7+'].includes(c)) return 'APT';
    if (['14+', '14', 'PG-13', 'B', 'B-15', '12', '12+'].includes(c)) return '14+';
    if (['18+', '18', 'R', 'NC-17', 'C', 'D'].includes(c)) return '18+';
    return '14+';
  }

  async searchMovies(query: string, language: string = 'es-MX'): Promise<TmdbMovieResult[]> {
    if (!query || !query.trim()) return [];
    const data: any = await this.fetchTmdb('/search/movie', {
      query: query.trim(),
      language,
      include_adult: 'false',
      page: '1',
    });

    return (data.results || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      originalTitle: item.original_title,
      overview: item.overview || '',
      releaseDate: item.release_date || '',
      posterUrl: this.formatPosterUrl(item.poster_path),
      backdropUrl: this.formatBackdropUrl(item.backdrop_path),
      voteAverage: item.vote_average || 0,
      genreIds: item.genre_ids || [],
    }));
  }

  async getNowPlaying(language: string = 'es-MX'): Promise<TmdbMovieResult[]> {
    const data: any = await this.fetchTmdb('/movie/now_playing', {
      language,
      page: '1',
    });

    return (data.results || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      originalTitle: item.original_title,
      overview: item.overview || '',
      releaseDate: item.release_date || '',
      posterUrl: this.formatPosterUrl(item.poster_path),
      backdropUrl: this.formatBackdropUrl(item.backdrop_path),
      voteAverage: item.vote_average || 0,
      genreIds: item.genre_ids || [],
    }));
  }

  async getPopular(language: string = 'es-MX'): Promise<TmdbMovieResult[]> {
    const data: any = await this.fetchTmdb('/movie/popular', {
      language,
      page: '1',
    });

    return (data.results || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      originalTitle: item.original_title,
      overview: item.overview || '',
      releaseDate: item.release_date || '',
      posterUrl: this.formatPosterUrl(item.poster_path),
      backdropUrl: this.formatBackdropUrl(item.backdrop_path),
      voteAverage: item.vote_average || 0,
      genreIds: item.genre_ids || [],
    }));
  }

  async getMovieDetails(tmdbId: number | string, language: string = 'es-MX'): Promise<TmdbMovieDetails> {
    const data: any = await this.fetchTmdb(`/movie/${tmdbId}`, {
      language,
      append_to_response: 'videos,credits,release_dates',
    });

    if (!data) {
      throw new NotFoundException(`Película con TMDB ID '${tmdbId}' no encontrada`);
    }

    // Extraer tráiler oficial de YouTube
    let trailerUrl: string | undefined = undefined;
    if (data.videos && Array.isArray(data.videos.results)) {
      const trailer =
        data.videos.results.find(
          (v: any) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'),
        ) || data.videos.results[0];

      if (trailer && trailer.key) {
        trailerUrl = `https://www.youtube.com/watch?v=${trailer.key}`;
      }
    }

    // Extraer director
    let director: string | undefined = undefined;
    if (data.credits && Array.isArray(data.credits.crew)) {
      const dir = data.credits.crew.find((c: any) => c.job === 'Director');
      if (dir) director = dir.name;
    }

    // Extraer clasificación por edades
    let cert: string | undefined = undefined;
    if (data.release_dates && Array.isArray(data.release_dates.results)) {
      const peRelease = data.release_dates.results.find((r: any) => r.iso_3166_1 === 'PE' || r.iso_3166_1 === 'MX' || r.iso_3166_1 === 'US');
      if (peRelease && Array.isArray(peRelease.release_dates)) {
        const withCert = peRelease.release_dates.find((d: any) => d.certification);
        if (withCert) cert = withCert.certification;
      }
    }

    const rating = this.mapRating(cert, data.adult);
    const genres = Array.isArray(data.genres) ? data.genres.map((g: any) => g.name) : [];

    return {
      id: data.id,
      title: data.title,
      originalTitle: data.original_title,
      synopsis: data.overview || '',
      durationMinutes: data.runtime || 120,
      rating,
      genres,
      posterUrl: this.formatPosterUrl(data.poster_path),
      backdropUrl: this.formatBackdropUrl(data.backdrop_path),
      trailerUrl,
      director,
      releaseDate: data.release_date || '',
    };
  }
}
