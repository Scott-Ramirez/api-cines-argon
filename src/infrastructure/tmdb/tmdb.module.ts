import { Module, Global } from '@nestjs/common';
import { TMDB_SERVICE } from '../../domain/services/tmdb.service.interface';
import { TmdbService } from './tmdb.service';

@Global()
@Module({
  providers: [
    {
      provide: TMDB_SERVICE,
      useClass: TmdbService,
    },
    TmdbService,
  ],
  exports: [TMDB_SERVICE, TmdbService],
})
export class TmdbModule {}
