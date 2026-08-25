import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ShowtimeOrmEntity } from './showtime.orm-entity';
import { RoomType } from '../../../domain/models/room.model';

@Entity('rooms')
export class RoomOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 50, default: 'VIP Premium' })
  type: RoomType;

  @Column({ type: 'int', default: 25 })
  capacity: number;

  @Column({ type: 'int', default: 5 })
  rows: number;

  @Column({ type: 'int', default: 6 })
  columns: number;

  @Column({ length: 150, default: 'Dolby Atmos 7.1.4 Surround' })
  soundSystem: string;

  @OneToMany(() => ShowtimeOrmEntity, (showtime) => showtime.room)
  showtimes: ShowtimeOrmEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
