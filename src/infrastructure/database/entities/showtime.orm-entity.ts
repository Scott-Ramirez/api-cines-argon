import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { MovieOrmEntity } from './movie.orm-entity';
import { RoomOrmEntity } from './room.orm-entity';

@Entity('showtimes')
export class ShowtimeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  movieId: string;

  @ManyToOne(() => MovieOrmEntity, (movie) => movie.showtimes, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'movieId' })
  movie: MovieOrmEntity;

  @Column()
  roomId: string;

  @ManyToOne(() => RoomOrmEntity, (room) => room.showtimes, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'roomId' })
  room: RoomOrmEntity;

  @Column({ type: 'varchar', length: 15 })
  date: string;

  @Column({ type: 'varchar', length: 10 })
  startTime: string;

  @Column({ type: 'varchar', length: 10 })
  endTime: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 1.0 })
  priceMultiplier: number;

  @Column({ type: 'int', default: 25 })
  availableSeats: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
