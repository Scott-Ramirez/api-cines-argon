import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ShowtimeOrmEntity } from './showtime.orm-entity';
import { MovieRating, MovieStatus } from '../../../domain/models/movie.model';

@Entity('movies')
export class MovieOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255, nullable: true })
  originalTitle?: string;

  @Column({ type: 'text' })
  synopsis: string;

  @Column({ type: 'int' })
  durationMinutes: number;

  @Column({ type: 'varchar', length: 10, default: 'APT' })
  rating: MovieRating;

  @Column({ type: 'simple-json' })
  genre: string[];

  @Column({ type: 'text' })
  posterUrl: string;

  @Column({ type: 'text', nullable: true })
  backdropUrl?: string;

  @Column({ type: 'text', nullable: true })
  trailerUrl?: string;

  @Column({ type: 'varchar', length: 20, default: 'CARTELERA' })
  status: MovieStatus;

  @Column({ length: 150, nullable: true })
  director?: string;

  @OneToMany(() => ShowtimeOrmEntity, (showtime) => showtime.movie)
  showtimes: ShowtimeOrmEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
