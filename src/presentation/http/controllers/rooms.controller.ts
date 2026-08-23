import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  GetRoomsUseCase,
  GetRoomByIdUseCase,
  CreateRoomUseCase,
  UpdateRoomUseCase,
  DeleteRoomUseCase,
} from '../../../application/use-cases/rooms/rooms.use-cases';
import { CreateRoomDto, UpdateRoomDto } from '../dtos';

@ApiTags('Rooms')
@Controller('rooms')
export class RoomsController {
  constructor(
    private readonly getRoomsUseCase: GetRoomsUseCase,
    private readonly getRoomByIdUseCase: GetRoomByIdUseCase,
    private readonly createRoomUseCase: CreateRoomUseCase,
    private readonly updateRoomUseCase: UpdateRoomUseCase,
    private readonly deleteRoomUseCase: DeleteRoomUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas las salas' })
  findAll() {
    return this.getRoomsUseCase.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener sala por ID' })
  findOne(@Param('id') id: string) {
    return this.getRoomByIdUseCase.execute(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear nueva sala' })
  @ApiResponse({ status: 201, description: 'Sala creada con éxito' })
  create(@Body() dto: CreateRoomDto) {
    return this.createRoomUseCase.execute(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una sala' })
  @ApiResponse({ status: 200, description: 'Sala actualizada con éxito' })
  update(@Param('id') id: string, @Body() dto: UpdateRoomDto) {
    return this.updateRoomUseCase.execute(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una sala' })
  @ApiResponse({ status: 200, description: 'Sala eliminada con éxito' })
  remove(@Param('id') id: string) {
    return this.deleteRoomUseCase.execute(id);
  }
}
