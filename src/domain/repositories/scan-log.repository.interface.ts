import { ScanLogModel } from '../models/scan-log.model';

export const SCAN_LOG_REPOSITORY = 'SCAN_LOG_REPOSITORY';

export interface IScanLogRepository {
  create(log: ScanLogModel): Promise<ScanLogModel>;
  findRecent(limit: number): Promise<ScanLogModel[]>;
}
