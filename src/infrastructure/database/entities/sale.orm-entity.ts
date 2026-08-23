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

  @OneToMany(() => TicketOrmEntity, (ticket) => ticket.sale)
  tickets: TicketOrmEntity[];

  @CreateDateColumn()
  createdAt: Date;
}
