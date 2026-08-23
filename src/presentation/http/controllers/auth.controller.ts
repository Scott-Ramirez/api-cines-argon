import { Controller, Post, Body, Get, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LoginAdminUseCase, RegisterAdminUseCase, GetProfileUseCase } from '../../../application/use-cases/auth/auth.use-cases';
import { LoginDto, RegisterAdminDto } from '../dtos';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { UserModel } from '../../../domain/models/user.model';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginAdminUseCase: LoginAdminUseCase,
    private readonly registerAdminUseCase: RegisterAdminUseCase,
    private readonly getProfileUseCase: GetProfileUseCase,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión como Administrador' })
  @ApiResponse({ status: 200, description: 'Login exitoso, retorna token JWT y datos de sesión' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  login(@Body() loginDto: LoginDto) {
    return this.loginAdminUseCase.execute(loginDto.username, loginDto.password);
  }

  @Post('register-admin')
  @ApiOperation({ summary: 'Registrar cuenta de Administrador' })
  @ApiResponse({ status: 201, description: 'Administrador registrado con éxito' })
  registerAdmin(@Body() registerDto: RegisterAdminDto) {
    return this.registerAdminUseCase.execute(registerDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  getProfile(@CurrentUser() user: UserModel) {
    return this.getProfileUseCase.execute(user.id);
  }
}
