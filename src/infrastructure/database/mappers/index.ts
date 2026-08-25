import { UserOrmEntity } from '../entities/user.orm-entity';
import { UserModel } from '../../../domain/models/user.model';
import { MovieOrmEntity } from '../entities/movie.orm-entity';
import { MovieModel } from '../../../domain/models/movie.model';
import { RoomOrmEntity } from '../entities/room.orm-entity';
import { RoomModel } from '../../../domain/models/room.model';
import { ShowtimeOrmEntity } from '../entities/showtime.orm-entity';
import { ShowtimeModel } from '../../../domain/models/showtime.model';
import { PricingTierOrmEntity } from '../entities/pricing-tier.orm-entity';
import { PricingTierModel } from '../../../domain/models/pricing-tier.model';
import { HeroSlideOrmEntity } from '../entities/hero-slide.orm-entity';
import { HeroSlideModel } from '../../../domain/models/hero-slide.model';
import { SaleOrmEntity } from '../entities/sale.orm-entity';
import { SaleModel } from '../../../domain/models/sale.model';
import { TicketOrmEntity } from '../entities/ticket.orm-entity';
import { TicketModel } from '../../../domain/models/ticket.model';
import { ScanLogOrmEntity } from '../entities/scan-log.orm-entity';
import { ScanLogModel } from '../../../domain/models/scan-log.model';

export class UserMapper {
  static toDomain(orm: UserOrmEntity): UserModel {
    return new UserModel(
      orm.id,
      orm.name,
      orm.username,
      orm.password,
      orm.role,
      orm.avatar,
      orm.assignedTerminal,
      orm.createdAt,
      orm.updatedAt,
    );
  }

  static toOrm(model: UserModel): UserOrmEntity {
    const orm = new UserOrmEntity();
    if (model.id) orm.id = model.id;
    orm.name = model.name;
    orm.username = model.username;
    if (model.password) orm.password = model.password;
    orm.role = model.role;
    orm.avatar = model.avatar;
    orm.assignedTerminal = model.assignedTerminal;
    return orm;
  }
}

export class MovieMapper {
  static toDomain(orm: MovieOrmEntity): MovieModel {
    return new MovieModel(
      orm.id,
      orm.title,
      orm.originalTitle,
      orm.synopsis,
      orm.durationMinutes,
      orm.rating,
      orm.genre,
      orm.posterUrl,
      orm.backdropUrl,
      orm.trailerUrl,
      orm.status,
      orm.director,
      orm.createdAt,
      orm.updatedAt,
    );
  }

  static toOrm(model: Partial<MovieModel>): MovieOrmEntity {
    const orm = new MovieOrmEntity();
    if (model.id) orm.id = model.id;
    if (model.title !== undefined) orm.title = model.title;
    if (model.originalTitle !== undefined) orm.originalTitle = model.originalTitle;
    if (model.synopsis !== undefined) orm.synopsis = model.synopsis;
    if (model.durationMinutes !== undefined) orm.durationMinutes = model.durationMinutes;
    if (model.rating !== undefined) orm.rating = model.rating;
    if (model.genre !== undefined) orm.genre = model.genre;
    if (model.posterUrl !== undefined) orm.posterUrl = model.posterUrl;
    if (model.backdropUrl !== undefined) orm.backdropUrl = model.backdropUrl;
    if (model.trailerUrl !== undefined) orm.trailerUrl = model.trailerUrl;
    if (model.status !== undefined) orm.status = model.status;
    if (model.director !== undefined) orm.director = model.director;
    return orm;
  }
}

export class RoomMapper {
  static toDomain(orm: RoomOrmEntity): RoomModel {
    return new RoomModel(
      orm.id,
      orm.name,
      orm.type,
      orm.capacity,
      orm.soundSystem,
      orm.rows ?? 5,
      orm.columns ?? 6,
      orm.createdAt,
      orm.updatedAt,
    );
  }

  static toOrm(model: Partial<RoomModel>): RoomOrmEntity {
    const orm = new RoomOrmEntity();
    if (model.id) orm.id = model.id;
    if (model.name !== undefined) orm.name = model.name;
    if (model.type !== undefined) orm.type = model.type;
    if (model.capacity !== undefined) orm.capacity = model.capacity;
    if (model.soundSystem !== undefined) orm.soundSystem = model.soundSystem;
    if (model.rows !== undefined) orm.rows = model.rows;
    if (model.columns !== undefined) orm.columns = model.columns;
    return orm;
  }
}

export class ShowtimeMapper {
  static toDomain(orm: ShowtimeOrmEntity): ShowtimeModel {
    return new ShowtimeModel(
      orm.id,
      orm.movieId,
      orm.roomId,
      orm.date,
      orm.startTime,
      orm.endTime,
      Number(orm.priceMultiplier) || 1.0,
      orm.availableSeats,
      orm.movie ? MovieMapper.toDomain(orm.movie) : undefined,
      orm.room ? RoomMapper.toDomain(orm.room) : undefined,
      orm.createdAt,
      orm.updatedAt,
    );
  }

  static toOrm(model: Partial<ShowtimeModel>): ShowtimeOrmEntity {
    const orm = new ShowtimeOrmEntity();
    if (model.id) orm.id = model.id;
    if (model.movieId !== undefined) orm.movieId = model.movieId;
    if (model.roomId !== undefined) orm.roomId = model.roomId;
    if (model.date !== undefined) orm.date = model.date;
    if (model.startTime !== undefined) orm.startTime = model.startTime;
    if (model.endTime !== undefined) orm.endTime = model.endTime;
    if (model.priceMultiplier !== undefined) orm.priceMultiplier = model.priceMultiplier;
    if (model.availableSeats !== undefined) orm.availableSeats = model.availableSeats;
    return orm;
  }
}

export class PricingTierMapper {
  static toDomain(orm: PricingTierOrmEntity): PricingTierModel {
    return new PricingTierModel(
      orm.id,
      orm.type,
      orm.label,
      orm.description,
      Number(orm.basePrice),
      orm.createdAt,
      orm.updatedAt,
    );
  }

  static toOrm(model: Partial<PricingTierModel>): PricingTierOrmEntity {
    const orm = new PricingTierOrmEntity();
    if (model.id) orm.id = model.id;
    if (model.type !== undefined) orm.type = model.type;
    if (model.label !== undefined) orm.label = model.label;
    if (model.description !== undefined) orm.description = model.description;
    if (model.basePrice !== undefined) orm.basePrice = model.basePrice;
    return orm;
  }
}

export class HeroSlideMapper {
  static toDomain(orm: HeroSlideOrmEntity): HeroSlideModel {
    return new HeroSlideModel(
      orm.id,
      orm.title,
      orm.tagline,
      orm.time,
      orm.rating,
      orm.durationMinutes,
      orm.genres,
      orm.synopsis,
      orm.backdropUrl,
      orm.posterUrl,
      orm.active,
      orm.order,
      orm.movieId,
      orm.createdAt,
      orm.updatedAt,
    );
  }

  static toOrm(model: Partial<HeroSlideModel>): HeroSlideOrmEntity {
    const orm = new HeroSlideOrmEntity();
    if (model.id) orm.id = model.id;
    if (model.title !== undefined) orm.title = model.title;
    if (model.tagline !== undefined) orm.tagline = model.tagline;
    if (model.time !== undefined) orm.time = model.time;
    if (model.rating !== undefined) orm.rating = model.rating;
    if (model.durationMinutes !== undefined) orm.durationMinutes = model.durationMinutes;
    if (model.genres !== undefined) orm.genres = model.genres;
    if (model.synopsis !== undefined) orm.synopsis = model.synopsis;
    if (model.backdropUrl !== undefined) orm.backdropUrl = model.backdropUrl;
    if (model.posterUrl !== undefined) orm.posterUrl = model.posterUrl;
    if (model.active !== undefined) orm.active = model.active;
    if (model.order !== undefined) orm.order = model.order;
    if (model.movieId !== undefined) orm.movieId = model.movieId;
    return orm;
  }
}

export class TicketMapper {
  static toDomain(orm: TicketOrmEntity): TicketModel {
    return new TicketModel(
      orm.id,
      orm.saleId,
      orm.showtimeId,
      orm.movieId,
      orm.movieTitle,
      orm.roomName,
      orm.roomType,
      orm.showtimeDate,
      orm.showtimeHour,
      orm.ticketType,
      Number(orm.price),
      orm.status,
      orm.issuedAt,
      orm.usedAt,
      orm.validatedBy,
      orm.signature,
      orm.createdAt,
    );
  }

  static toOrm(model: TicketModel): TicketOrmEntity {
    const orm = new TicketOrmEntity();
    orm.id = model.id;
    orm.saleId = model.saleId;
    orm.showtimeId = model.showtimeId;
    orm.movieId = model.movieId;
    orm.movieTitle = model.movieTitle;
    orm.roomName = model.roomName;
    orm.roomType = model.roomType;
    orm.showtimeDate = model.showtimeDate;
    orm.showtimeHour = model.showtimeHour;
    orm.ticketType = model.ticketType;
    orm.price = model.price;
    orm.status = model.status;
    orm.issuedAt = model.issuedAt;
    orm.usedAt = model.usedAt;
    orm.validatedBy = model.validatedBy;
    orm.signature = model.signature;
    return orm;
  }
}

export class SaleMapper {
  static toDomain(orm: SaleOrmEntity): SaleModel {
    return new SaleModel(
      orm.id,
      orm.movieTitle,
      orm.showtimeId,
      Number(orm.totalAmount),
      Number(orm.paidAmount),
      Number(orm.changeAmount),
      orm.cashierName,
      orm.totalTickets,
      orm.tickets ? orm.tickets.map(TicketMapper.toDomain) : [],
      orm.paymentMethod || 'CASH',
      orm.externalPaymentId,
      orm.customerName,
      orm.customerEmail,
      orm.customerPhone,
      orm.status || 'APPROVED',
      orm.createdAt,
    );
  }

  static toOrm(model: SaleModel): SaleOrmEntity {
    const orm = new SaleOrmEntity();
    orm.id = model.id;
    orm.movieTitle = model.movieTitle;
    orm.showtimeId = model.showtimeId;
    orm.totalAmount = model.totalAmount;
    orm.paidAmount = model.paidAmount;
    orm.changeAmount = model.changeAmount;
    orm.cashierName = model.cashierName;
    orm.totalTickets = model.totalTickets;
    orm.paymentMethod = model.paymentMethod;
    orm.externalPaymentId = model.externalPaymentId;
    orm.customerName = model.customerName;
    orm.customerEmail = model.customerEmail;
    orm.customerPhone = model.customerPhone;
    orm.status = model.status;
    return orm;
  }
}

export class ScanLogMapper {
  static toDomain(orm: ScanLogOrmEntity): ScanLogModel {
    return new ScanLogModel(
      orm.id,
      orm.ticketId,
      orm.timestamp,
      orm.result,
      orm.message,
      orm.movieTitle,
      orm.roomName,
      orm.createdAt,
    );
  }

  static toOrm(model: ScanLogModel): ScanLogOrmEntity {
    const orm = new ScanLogOrmEntity();
    orm.id = model.id;
    orm.ticketId = model.ticketId;
    orm.timestamp = model.timestamp;
    orm.result = model.result;
    orm.message = model.message;
    orm.movieTitle = model.movieTitle;
    orm.roomName = model.roomName;
    return orm;
  }
}
