export type RoomType = string;

export class RoomModel {
  constructor(
    public readonly id: string,
    public name: string,
    public type: RoomType = 'VIP Premium',
    public capacity: number = 25,
    public soundSystem: string = 'Dolby Atmos 7.1.4 Surround',
    public rows: number = 5,
    public columns: number = 6,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}
