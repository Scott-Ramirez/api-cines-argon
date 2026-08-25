import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { TicketOrmEntity } from './ticket.orm-entity';

@Entity('sales')
export class SaleOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  movieTitle: string;

  @Column({ length: 100 })
  showtimeId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  paidAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  changeAmount: number;

  @Column({ length: 100, default: 'Admin' })
  cashierName: string;

  @Column({ type: 'int', default: 1 })
  totalTickets: number;

  @Column({ length: 50, default: 'CASH' })
  paymentMethod: string;

  @Column({ length: 100, nullable: true })
  externalPaymentId?: string;

  @Column({ length: 150, nullable: true })
  customerName?: string;

  @Column({ length: 150, nullable: true })
  customerEmail?: string;

  @Column({ length: 30, nullable: true })
  customerPhone?: string;

  @Column({ length: 30, default: 'APPROVED' })
  status: string;

  @OneToMany(() => TicketOrmEntity, (ticket) => ticket.sale)
  tickets: TicketOrmEntity[];

  @CreateDateColumn()
  createdAt: Date;
}

