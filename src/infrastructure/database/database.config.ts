import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserOrmEntity } from './entities/user.orm-entity';
import { MovieOrmEntity } from './entities/movie.orm-entity';
import { RoomOrmEntity } from './entities/room.orm-entity';
import { ShowtimeOrmEntity } from './entities/showtime.orm-entity';
import { PricingTierOrmEntity } from './entities/pricing-tier.orm-entity';
import { HeroSlideOrmEntity } from './entities/hero-slide.orm-entity';
import { SaleOrmEntity } from './entities/sale.orm-entity';
import { TicketOrmEntity } from './entities/ticket.orm-entity';
import { ScanLogOrmEntity } from './entities/scan-log.orm-entity';

export const getDatabaseConfig = (): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_DATABASE || 'cines_argon',
  entities: [
    UserOrmEntity,
    MovieOrmEntity,
    RoomOrmEntity,
    ShowtimeOrmEntity,
    PricingTierOrmEntity,
    HeroSlideOrmEntity,
    SaleOrmEntity,
    TicketOrmEntity,
    ScanLogOrmEntity,
  ],
  synchronize: process.env.DB_SYNCHRONIZE === 'true' || process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
});
