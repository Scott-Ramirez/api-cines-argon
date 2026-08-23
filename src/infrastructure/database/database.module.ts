import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './database.config';

import { UserOrmEntity } from './entities/user.orm-entity';
import { MovieOrmEntity } from './entities/movie.orm-entity';
import { RoomOrmEntity } from './entities/room.orm-entity';
import { ShowtimeOrmEntity } from './entities/showtime.orm-entity';
import { PricingTierOrmEntity } from './entities/pricing-tier.orm-entity';
import { HeroSlideOrmEntity } from './entities/hero-slide.orm-entity';
import { SaleOrmEntity } from './entities/sale.orm-entity';
import { TicketOrmEntity } from './entities/ticket.orm-entity';
import { ScanLogOrmEntity } from './entities/scan-log.orm-entity';

import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import { MOVIE_REPOSITORY } from '../../domain/repositories/movie.repository.interface';
import { ROOM_REPOSITORY } from '../../domain/repositories/room.repository.interface';
import { SHOWTIME_REPOSITORY } from '../../domain/repositories/showtime.repository.interface';
import { PRICING_REPOSITORY } from '../../domain/repositories/pricing.repository.interface';
import { HERO_SLIDE_REPOSITORY } from '../../domain/repositories/hero-slide.repository.interface';
import { SALE_REPOSITORY } from '../../domain/repositories/sale.repository.interface';
import { TICKET_REPOSITORY } from '../../domain/repositories/ticket.repository.interface';
import { SCAN_LOG_REPOSITORY } from '../../domain/repositories/scan-log.repository.interface';

import { TypeormUserRepository } from './repositories/typeorm-user.repository';
import { TypeormMovieRepository } from './repositories/typeorm-movie.repository';
import { TypeormRoomRepository } from './repositories/typeorm-room.repository';
import { TypeormShowtimeRepository } from './repositories/typeorm-showtime.repository';
import { TypeormPricingRepository } from './repositories/typeorm-pricing.repository';
import { TypeormHeroSlideRepository } from './repositories/typeorm-hero-slide.repository';
import { TypeormSaleRepository } from './repositories/typeorm-sale.repository';
import { TypeormTicketRepository } from './repositories/typeorm-ticket.repository';
import { TypeormScanLogRepository } from './repositories/typeorm-scan-log.repository';

const repositories = [
  { provide: USER_REPOSITORY, useClass: TypeormUserRepository },
  { provide: MOVIE_REPOSITORY, useClass: TypeormMovieRepository },
  { provide: ROOM_REPOSITORY, useClass: TypeormRoomRepository },
  { provide: SHOWTIME_REPOSITORY, useClass: TypeormShowtimeRepository },
  { provide: PRICING_REPOSITORY, useClass: TypeormPricingRepository },
  { provide: HERO_SLIDE_REPOSITORY, useClass: TypeormHeroSlideRepository },
  { provide: SALE_REPOSITORY, useClass: TypeormSaleRepository },
  { provide: TICKET_REPOSITORY, useClass: TypeormTicketRepository },
  { provide: SCAN_LOG_REPOSITORY, useClass: TypeormScanLogRepository },
];

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: getDatabaseConfig,
    }),
    TypeOrmModule.forFeature([
      UserOrmEntity,
      MovieOrmEntity,
      RoomOrmEntity,
      ShowtimeOrmEntity,
      PricingTierOrmEntity,
      HeroSlideOrmEntity,
      SaleOrmEntity,
      TicketOrmEntity,
      ScanLogOrmEntity,
    ]),
  ],
  providers: [...repositories],
  exports: [...repositories, TypeOrmModule],
})
export class DatabaseModule {}
