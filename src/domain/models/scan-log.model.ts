export type ScanResultStatus = 'VALID' | 'ALREADY_USED' | 'INVALID_SIGNATURE' | 'NOT_FOUND' | 'WRONG_DATE';

export class ScanLogModel {
  constructor(
    public readonly id: string,
    public ticketId: string,
    public timestamp: string,
    public result: ScanResultStatus,
    public message: string,
    public movieTitle?: string,
    public roomName?: string,
    public createdAt?: Date,
  ) {}
}
