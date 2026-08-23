import { Injectable, OnApplicationBootstrap, Logger, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcryptjs';
import { IUserRepository, USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import { UserModel } from '../../domain/models/user.model';

@Injectable()
export class AdminBootstrapService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AdminBootstrapService.name);

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    try {
      const existingAdmin = await this.userRepository.findByUsername('admin');
      if (!existingAdmin) {
        const initialPassword = process.env.ADMIN_INITIAL_PASSWORD || 'admin';
        const hashedPassword = await bcrypt.hash(initialPassword, 10);

        const adminUser = new UserModel(
          randomUUID(),
          'Administrador General',
          'admin',
          hashedPassword,
          'ADMIN',
          undefined,
          'Oficina Principal',
        );

        await this.userRepository.create(adminUser);
        this.logger.log(`✅ [AdminBootstrap] Usuario Administrador inicial creado en MySQL:`);
        this.logger.log(`   👉 ID (UUID): ${adminUser.id}`);
        this.logger.log(`   👉 Usuario: admin`);
        this.logger.log(`   👉 Contraseña: ${initialPassword}`);
      } else {
        this.logger.log(`ℹ️ [AdminBootstrap] Usuario administrador 'admin' ya existe en MySQL.`);
      }
    } catch (err: any) {
      this.logger.error('Error durante la verificación/creación del administrador inicial:', err.message);
    }
  }
}
