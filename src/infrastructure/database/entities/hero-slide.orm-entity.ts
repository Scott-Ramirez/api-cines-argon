import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('hero_slides')
export class HeroSlideOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255 })
  tagline: string;

  @Column({ length: 50 })
  time: string;

  @Column({ length: 50 })
  rating: string;

  @Column({ type: 'int', nullable: true })
  durationMinutes?: number;

  @Column({ type: 'simple-json' })
  genres: string[];

  @Column({ type: 'text' })
  synopsis: string;

  @Column({ type: 'text' })
  backdropUrl: string;

  @Column({ type: 'text', nullable: true })
  posterUrl?: string;

  @Column({ default: true })
  active: boolean;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ nullable: true })
  movieId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
