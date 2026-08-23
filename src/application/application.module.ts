import { Module } from '@nestjs/common';

// Auth Use Cases
import { LoginAdminUseCase, RegisterAdminUseCase, GetProfileUseCase } from './use-cases/auth/auth.use-cases';

// Movies Use Cases
import { GetMoviesUseCase, GetMovieByIdUseCase, CreateMovieUseCase, UpdateMovieUseCase, DeleteMovieUseCase } from './use-cases/movies/movies.use-cases';

// Rooms Use Cases
import { GetRoomsUseCase, GetRoomByIdUseCase, CreateRoomUseCase, UpdateRoomUseCase, DeleteRoomUseCase } from './use-cases/rooms/rooms.use-cases';

// Showtimes Use Cases
import { GetShowtimesUseCase, GetShowtimeByIdUseCase, CreateShowtimeUseCase, UpdateShowtimeUseCase, DeleteShowtimeUseCase } from './use-cases/showtimes/showtimes.use-cases';

// Pricing Use Cases
import { GetPricingUseCase, SavePricingBatchUseCase, SavePricingTierUseCase } from './use-cases/pricing/pricing.use-cases';

// HeroSlides Use Cases
import { GetHeroSlidesUseCase, GetHeroSlideByIdUseCase, CreateHeroSlideUseCase, UpdateHeroSlideUseCase, ToggleHeroSlideUseCase, DeleteHeroSlideUseCase } from './use-cases/hero-slides/hero-slides.use-cases';

// Sales Use Cases
import { GetSalesUseCase, GetSaleByIdUseCase, ProcessSaleUseCase } from './use-cases/sales/sales.use-cases';

// Tickets Use Cases
import { GetTicketsUseCase, GetTicketByIdUseCase, GetTicketsBySaleUseCase, CancelTicketUseCase } from './use-cases/tickets/tickets.use-cases';

// Validator Use Cases
import { ValidateTicketScanUseCase, GetScanLogsUseCase } from './use-cases/validator/validator.use-cases';

// Dashboard Use Cases
import { GetDashboardStatsUseCase } from './use-cases/dashboard/dashboard.use-cases';

const useCases = [
  // Auth
  LoginAdminUseCase,
  RegisterAdminUseCase,
  GetProfileUseCase,

  // Movies
  GetMoviesUseCase,
  GetMovieByIdUseCase,
  CreateMovieUseCase,
  UpdateMovieUseCase,
  DeleteMovieUseCase,

  // Rooms
  GetRoomsUseCase,
  GetRoomByIdUseCase,
  CreateRoomUseCase,
  UpdateRoomUseCase,
  DeleteRoomUseCase,

  // Showtimes
  GetShowtimesUseCase,
  GetShowtimeByIdUseCase,
  CreateShowtimeUseCase,
  UpdateShowtimeUseCase,
  DeleteShowtimeUseCase,

  // Pricing
  GetPricingUseCase,
  SavePricingBatchUseCase,
  SavePricingTierUseCase,

  // HeroSlides
  GetHeroSlidesUseCase,
  GetHeroSlideByIdUseCase,
  CreateHeroSlideUseCase,
  UpdateHeroSlideUseCase,
  ToggleHeroSlideUseCase,
  DeleteHeroSlideUseCase,

  // Sales
  GetSalesUseCase,
  GetSaleByIdUseCase,
  ProcessSaleUseCase,

  // Tickets
  GetTicketsUseCase,
  GetTicketByIdUseCase,
  GetTicketsBySaleUseCase,
  CancelTicketUseCase,

  // Validator
  ValidateTicketScanUseCase,
  GetScanLogsUseCase,

  // Dashboard
  GetDashboardStatsUseCase,
];

@Module({
  providers: [...useCases],
  exports: [...useCases],
})
export class ApplicationModule {}
