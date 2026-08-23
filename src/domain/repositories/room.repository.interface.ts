import { RoomModel } from '../models/room.model';

export const ROOM_REPOSITORY = 'ROOM_REPOSITORY';

export interface IRoomRepository {
  findAll(): Promise<RoomModel[]>;
  findById(id: string): Promise<RoomModel | null>;
  create(room: RoomModel): Promise<RoomModel>;
  update(id: string, room: Partial<RoomModel>): Promise<RoomModel>;
  delete(id: string): Promise<void>;
}
