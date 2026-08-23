import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MovieRating, MovieStatus } from '../../../domain/models/movie.model';
import { RoomType } from '../../../domain/models/room.model';
import { TicketType } from '../../../domain/models/pricing-tier.model';
import { TicketStatus } from '../../../domain/models/ticket.model';

// --- AUTH DTOS ---
export class LoginDto {
  @ApiProperty({ example: 'admin', description: 'Nombre de usuario' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
  username: string;

  @ApiProperty({ example: 'admin123', description: 'Contraseña del usuario' })
  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  password: string;
}

export class RegisterAdminDto {
  @ApiProperty({ example: 'Administrador General' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'admin' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'admin123' })
  @IsString()
  @MinLength(4, { message: 'La contraseña debe tener al menos 4 caracteres' })
  password: string;

  @ApiPropertyOptional({ example: 'Oficina Principal' })
  @IsOptional()
  @IsString()
  assignedTerminal?: string;
}

// --- MOVIE DTOS ---
export class CreateMovieDto {
  @ApiPropertyOptional({ example: 'mov-1' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ example: 'Dune: Parte Dos' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Dune: Part Two' })
  @IsOptional()
  @IsString()
  originalTitle?: string;

  @ApiProperty({ example: 'Paul Atreides se une a Chani...' })
  @IsString()
  @IsNotEmpty()
  synopsis: string;

  @ApiProperty({ example: 166 })
  @IsInt()
  @Min(1)
  durationMinutes: number;

  @ApiProperty({ enum: ['APT', '14+', '18+', 'TE'], example: '14+' })
  @IsEnum(['APT', '14+', '18+', 'TE'])
  rating: MovieRating;

  @ApiProperty({ example: ['Ciencia Ficción', 'Aventura'], type: [String] })
  @IsArray()
  genre: string[];

  @ApiProperty({ example: 'https://images.unsplash.com/...' })
  @IsString()
  @IsNotEmpty()
  posterUrl: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/...' })
  @IsOptional()
  @IsString()
  backdropUrl?: string;

  @ApiPropertyOptional({ example: 'https://www.youtube.com/watch?v=...' })
  @IsOptional()
  @IsString()
  trailerUrl?: string;

  @ApiProperty({ enum: ['CARTELERA', 'PROXIMAMENTE', 'ARCHIVADA'], example: 'CARTELERA' })
  @IsEnum(['CARTELERA', 'PROXIMAMENTE', 'ARCHIVADA'])
  status: MovieStatus;

  @ApiPropertyOptional({ example: 'Denis Villeneuve' })
  @IsOptional()
  @IsString()
  director?: string;
}

export class UpdateMovieDto extends PartialType(CreateMovieDto) {}

// --- ROOM DTOS ---
export class CreateRoomDto {
  @ApiPropertyOptional({ example: 'room-1' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ example: 'Sala Única - Home Cinema Argón' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: ['2D Estándar', '3D Dolby', 'IMAX Laser', 'VIP Premium'], example: 'VIP Premium' })
  @IsEnum(['2D Estándar', '3D Dolby', 'IMAX Laser', 'VIP Premium'])
  type: RoomType;

  @ApiProperty({ example: 25 })
  @IsInt()
  @Min(1)
  capacity: number;

  @ApiProperty({ example: 'Dolby Atmos 7.1.4 Surround' })
  @IsString()
  @IsNotEmpty()
  soundSystem: string;
}

export class UpdateRoomDto extends PartialType(CreateRoomDto) {}

// --- SHOWTIME DTOS ---
export class CreateShowtimeDto {
  @ApiPropertyOptional({ example: 'st-1' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ example: 'mov-1' })
  @IsString()
  @IsNotEmpty()
  movieId: string;

  @ApiProperty({ example: 'room-1' })
  @IsString()
  @IsNotEmpty()
  roomId: string;

  @ApiProperty({ example: '2026-08-23' })
  @IsString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ example: '17:30' })
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({ example: '19:50' })
  @IsString()
  @IsNotEmpty()
  endTime: string;

  @ApiPropertyOptional({ example: 1.0 })
  @IsOptional()
  @IsNumber()
  priceMultiplier?: number;

  @ApiProperty({ example: 25 })
  @IsNumber()
  @Min(0)
  availableSeats: number;
}

export class UpdateShowtimeDto extends PartialType(CreateShowtimeDto) {}

// --- PRICING DTOS ---
export class CreatePricingTierDto {
  @ApiPropertyOptional({ example: 'pt-1' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ enum: ['GENERAL', 'NINO', 'ADULTO_MAYOR', 'PROMO_DUO'], example: 'GENERAL' })
  @IsEnum(['GENERAL', 'NINO', 'ADULTO_MAYOR', 'PROMO_DUO'])
  type: TicketType;

  @ApiProperty({ example: 'Boleto General' })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty({ example: 'Acceso para adultos' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 18.00 })
  @IsNumber()
  @Min(0)
  basePrice: number;
}

export class UpdateBatchPricingDto {
  @ApiProperty({ type: [CreatePricingTierDto] })
  tiers: CreatePricingTierDto[];
}

// --- HERO SLIDE DTOS ---
export class CreateHeroSlideDto {
  @ApiPropertyOptional({ example: 'hero-1' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ example: 'Spider-Man: Beyond the Spider-Verse' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'FUNCIÓN DE LA TARDE' })
  @IsString()
  @IsNotEmpty()
  tagline: string;

  @ApiProperty({ example: '5:30 PM' })
  @IsString()
  @IsNotEmpty()
  time: string;

  @ApiProperty({ example: 'APT (Todo Público)' })
  @IsString()
  @IsNotEmpty()
  rating: string;

  @ApiPropertyOptional({ example: 140 })
  @IsOptional()
  @IsInt()
  durationMinutes?: number;

  @ApiProperty({ example: ['Animación', 'Acción', 'Familiar'], type: [String] })
  @IsArray()
  genres: string[];

  @ApiProperty({ example: 'Miles Morales emprende una travesía...' })
  @IsString()
  @IsNotEmpty()
  synopsis: string;

  @ApiProperty({ example: 'https://images.unsplash.com/...' })
  @IsString()
  @IsNotEmpty()
  backdropUrl: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/...' })
  @IsOptional()
  @IsString()
  posterUrl?: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiPropertyOptional({ example: 1, default: 0 })
  @IsOptional()
  @IsInt()
  order?: number;

  @ApiPropertyOptional({ example: 'mov-2' })
  @IsOptional()
  @IsString()
  movieId?: string;
}

export class UpdateHeroSlideDto extends PartialType(CreateHeroSlideDto) {}

// --- SALES DTOS ---
export class CartItemDto {
  @ApiProperty({ enum: ['GENERAL', 'NINO', 'ADULTO_MAYOR', 'PROMO_DUO'], example: 'GENERAL' })
  @IsEnum(['GENERAL', 'NINO', 'ADULTO_MAYOR', 'PROMO_DUO'])
  type: TicketType;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  quantity: number;
}

export class ProcessSaleDto {
  @ApiProperty({ example: 'st-1' })
  @IsString()
  @IsNotEmpty()
  showtimeId: string;

  @ApiProperty({ type: [CartItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];

  @ApiPropertyOptional({ example: 'Taquilla 1 - Admin', default: 'Admin' })
  @IsOptional()
  @IsString()
  cashierName?: string;

  @ApiProperty({ example: 50.00 })
  @IsNumber()
  @Min(0)
  paidAmount: number;
}

// --- VALIDATOR DTOS ---
export class ScanTicketDto {
  @ApiProperty({
    example: 'ARGON-V1|TKT-ABCD1-1|st-1|18|7a8fbc4e9d210543',
    description: 'Código escaneado completo QR / Láser o ID del boleto',
  })
  @IsString()
  @IsNotEmpty({ message: 'El código escaneado es obligatorio' })
  rawScanString: string;

  @ApiPropertyOptional({ enum: ['USB_SCANNER', 'CAMERA', 'MANUAL'], default: 'USB_SCANNER' })
  @IsOptional()
  @IsEnum(['USB_SCANNER', 'CAMERA', 'MANUAL'])
  scanType?: 'USB_SCANNER' | 'CAMERA' | 'MANUAL';

  @ApiPropertyOptional({ example: 'Portería Principal' })
  @IsOptional()
  @IsString()
  validatedBy?: string;
}
