import { Injectable, Inject } from '@nestjs/common';
import { IMovieRepository, MOVIE_REPOSITORY } from '../../../domain/repositories/movie.repository.interface';
import { IShowtimeRepository, SHOWTIME_REPOSITORY } from '../../../domain/repositories/showtime.repository.interface';
import { ISaleRepository, SALE_REPOSITORY } from '../../../domain/repositories/sale.repository.interface';
import { ITicketRepository, TICKET_REPOSITORY } from '../../../domain/repositories/ticket.repository.interface';
import { IScanLogRepository, SCAN_LOG_REPOSITORY } from '../../../domain/repositories/scan-log.repository.interface';

@Injectable()
export class GetDashboardStatsUseCase {
  constructor(
    @Inject(MOVIE_REPOSITORY)
    private readonly movieRepository: IMovieRepository,
    @Inject(SHOWTIME_REPOSITORY)
    private readonly showtimeRepository: IShowtimeRepository,
    @Inject(SALE_REPOSITORY)
    private readonly saleRepository: ISaleRepository,
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: ITicketRepository,
    @Inject(SCAN_LOG_REPOSITORY)
    private readonly scanLogRepository: IScanLogRepository,
  ) {}

  async execute() {
    const totalMovies = await this.movieRepository.count();
    const activeMovies = await this.movieRepository.count('CARTELERA');
    const totalSalesCount = await this.saleRepository.count();
    const totalTicketsCount = await this.ticketRepository.count();
    const usedTicketsCount = await this.ticketRepository.count('USED');
    const totalRevenue = await this.saleRepository.getTotalRevenue();

    const todayStr = new Date().toISOString().split('T')[0];
    const todayShowtimes = await this.showtimeRepository.findAll(todayStr);

    const allSales = await this.saleRepository.findAll();
    const recentSales = allSales.slice(0, 5);

    const recentLogs = await this.scanLogRepository.findRecent(8);

    return {
      overview: {
        totalMovies,
        activeMovies,
        totalSalesCount,
        totalTicketsCount,
        usedTicketsCount,
        totalRevenue,
      },
      todayShowtimes,
      recentSales,
      recentLogs,
    };
  }
}
