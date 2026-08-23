export type RoomType = '2D Estándar' | '3D Dolby' | 'IMAX Laser' | 'VIP Premium';

export class RoomModel {
  constructor(
    public readonly id: string,
    public name: string,
    public type: RoomType = 'VIP Premium',
    public capacity: number = 25,
    public soundSystem: string = 'Dolby Atmos 7.1.4 Surround',
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}
