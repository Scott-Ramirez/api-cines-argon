import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';
import { ScanResultStatus } from '../../../domain/models/scan-log.model';

@Entity('scan_logs')
export class ScanLogOrmEntity {
  @PrimaryColumn({ length: 50 })
  id: string;

  @Column({ length: 50 })
  ticketId: string;

  @Column({ length: 50 })
  timestamp: string;

  @Column({ type: 'varchar', length: 30 })
  result: ScanResultStatus;

  @Column({ type: 'text' })
  message: string;

  @Column({ length: 255, nullable: true })
  movieTitle?: string;

  @Column({ length: 150, nullable: true })
  roomName?: string;

  @CreateDateColumn()
  createdAt: Date;
}
