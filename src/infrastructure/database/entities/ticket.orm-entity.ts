import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { SaleOrmEntity } from './sale.orm-entity';
import { RoomType } from '../../../domain/models/room.model';
import { TicketType } from '../../../domain/models/pricing-tier.model';
import { TicketStatus } from '../../../domain/models/ticket.model';

@Entity('tickets')
export class TicketOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  saleId: string;

  @ManyToOne(() => SaleOrmEntity, (sale) => sale.tickets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'saleId' })
  sale: SaleOrmEntity;

  @Column({ length: 100 })
  showtimeId: string;

  @Column({ length: 100 })
  movieId: string;

  @Column({ length: 255 })
  movieTitle: string;

  @Column({ length: 150 })
  roomName: string;

  @Column({ type: 'varchar', length: 50 })
  roomType: RoomType;

  @Column({ length: 20 })
  showtimeDate: string;

  @Column({ length: 20 })
  showtimeHour: string;

  @Column({ type: 'varchar', length: 50 })
  ticketType: TicketType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'varchar', length: 20, default: 'ISSUED' })
  status: TicketStatus;

  @Column({ type: 'varchar', length: 50 })
  issuedAt: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  usedAt?: string;

  @Column({ length: 100, nullable: true })
  validatedBy?: string;

  @Column({ length: 100 })
  signature: string;

  @CreateDateColumn()
  createdAt: Date;
}
