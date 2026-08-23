import { Module } from '@nestjs/common';
import { ApplicationModule } from '../application/application.module';

import { AuthController } from './http/controllers/auth.controller';
import { MoviesController } from './http/controllers/movies.controller';
import { RoomsController } from './http/controllers/rooms.controller';
import { ShowtimesController } from './http/controllers/showtimes.controller';
import { PricingController } from './http/controllers/pricing.controller';
import { HeroSlidesController } from './http/controllers/hero-slides.controller';
import { SalesController } from './http/controllers/sales.controller';
import { TicketsController } from './http/controllers/tickets.controller';
import { ValidatorController } from './http/controllers/validator.controller';
import { DashboardController } from './http/controllers/dashboard.controller';
import { TmdbController } from './http/controllers/tmdb.controller';

const controllers = [
  AuthController,
  MoviesController,
  RoomsController,
  ShowtimesController,
  PricingController,
  HeroSlidesController,
  SalesController,
  TicketsController,
  ValidatorController,
  DashboardController,
  TmdbController,
];

@Module({
  imports: [ApplicationModule],
  controllers: [...controllers],
})
export class PresentationModule {}
