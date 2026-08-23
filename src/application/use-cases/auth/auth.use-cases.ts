import { Injectable, Inject, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { IUserRepository, USER_REPOSITORY } from '../../../domain/repositories/user.repository.interface';
import { UserModel } from '../../../domain/models/user.model';

@Injectable()
export class LoginAdminUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(username: string, password?: string) {
    const user = await this.userRepository.findByUsername(username.trim());
    if (!user || !user.password) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    const isMatch = await bcrypt.compare(password || '', user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    const payload = { sub: user.id, username: user.username, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
        avatar: user.avatar,
        assignedTerminal: user.assignedTerminal,
      },
    };
  }
}

@Injectable()
export class RegisterAdminUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(data: { name: string; username: string; password: string; assignedTerminal?: string }) {
    const cleanUsername = data.username.trim().toLowerCase();
    const existing = await this.userRepository.findByUsername(cleanUsername);
    if (existing) {
      throw new BadRequestException('El nombre de usuario ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = new UserModel(
      '',
      data.name,
      cleanUsername,
      hashedPassword,
      'ADMIN',
      undefined,
      data.assignedTerminal || 'Oficina Principal',
    );

    const saved = await this.userRepository.create(newUser);
    const { password, ...result } = saved;
    return result;
  }
}

@Injectable()
export class GetProfileUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    const { password, ...result } = user;
    return result;
  }
}
