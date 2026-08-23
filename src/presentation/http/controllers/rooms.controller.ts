import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import {
  GetRoomsUseCase,
  GetRoomByIdUseCase,
  CreateRoomUseCase,
  UpdateRoomUseCase,
  DeleteRoomUseCase,
} from '../../../application/use-cases/rooms/rooms.use-cases';
import { CreateRoomDto, UpdateRoomDto } from '../dtos';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear nueva sala (Admin)' })
  @ApiResponse({ status: 201, description: 'Sala creada con éxito' })
  create(@Body() dto: CreateRoomDto) {
    return this.createRoomUseCase.execute(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar una sala (Admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateRoomDto) {
    return this.updateRoomUseCase.execute(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar una sala (Admin)' })
  remove(@Param('id') id: string) {
    return this.deleteRoomUseCase.execute(id);
  }
}
