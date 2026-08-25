import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IRoomRepository, ROOM_REPOSITORY } from '../../../domain/repositories/room.repository.interface';
import { RoomModel, RoomType } from '../../../domain/models/room.model';

@Injectable()
export class GetRoomsUseCase {
  constructor(
    @Inject(ROOM_REPOSITORY)
    private readonly roomRepository: IRoomRepository,
  ) {}

  async execute(): Promise<RoomModel[]> {
    return this.roomRepository.findAll();
  }
}

@Injectable()
export class GetRoomByIdUseCase {
  constructor(
    @Inject(ROOM_REPOSITORY)
    private readonly roomRepository: IRoomRepository,
  ) {}

  async execute(id: string): Promise<RoomModel> {
    const room = await this.roomRepository.findById(id);
    if (!room) {
      throw new NotFoundException(`Sala con ID '${id}' no encontrada`);
    }
    return room;
  }
}

@Injectable()
export class CreateRoomUseCase {
  constructor(
    @Inject(ROOM_REPOSITORY)
    private readonly roomRepository: IRoomRepository,
  ) {}

  async execute(data: {
    id?: string;
    name: string;
    type: RoomType;
    capacity: number;
    soundSystem: string;
    rows?: number;
    columns?: number;
  }): Promise<RoomModel> {
    const room = new RoomModel(
      data.id || '',
      data.name,
      data.type,
      data.capacity,
      data.soundSystem,
      data.rows ?? 5,
      data.columns ?? 6,
    );
    return this.roomRepository.create(room);
  }
}

@Injectable()
export class UpdateRoomUseCase {
  constructor(
    @Inject(ROOM_REPOSITORY)
    private readonly roomRepository: IRoomRepository,
  ) {}

  async execute(id: string, data: Partial<RoomModel>): Promise<RoomModel> {
    const existing = await this.roomRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Sala con ID '${id}' no encontrada`);
    }
    return this.roomRepository.update(id, data);
  }
}

@Injectable()
export class DeleteRoomUseCase {
  constructor(
    @Inject(ROOM_REPOSITORY)
    private readonly roomRepository: IRoomRepository,
  ) {}

  async execute(id: string): Promise<{ success: boolean; message: string }> {
    const existing = await this.roomRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Sala con ID '${id}' no encontrada`);
    }
    await this.roomRepository.delete(id);
    return { success: true, message: `Sala '${existing.name}' eliminada exitosamente` };
  }
}
