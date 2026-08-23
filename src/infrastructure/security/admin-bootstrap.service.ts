import { Injectable, OnApplicationBootstrap, Logger, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcryptjs';
import { IUserRepository, USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import { IRoomRepository, ROOM_REPOSITORY } from '../../domain/repositories/room.repository.interface';
import { IPricingRepository, PRICING_REPOSITORY } from '../../domain/repositories/pricing.repository.interface';
import { UserModel } from '../../domain/models/user.model';
import { RoomModel } from '../../domain/models/room.model';
import { PricingTierModel } from '../../domain/models/pricing-tier.model';

@Injectable()
export class AdminBootstrapService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AdminBootstrapService.name);

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(ROOM_REPOSITORY)
    private readonly roomRepository: IRoomRepository,
    @Inject(PRICING_REPOSITORY)
    private readonly pricingRepository: IPricingRepository,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    try {
      // 1. Asegurar Usuario Administrador Inicial
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
        this.logger.log(`✅ [Bootstrap] Usuario Administrador inicial creado en MySQL: admin / ${initialPassword}`);
      }

      // 2. Asegurar Sala Principal si no existe ninguna
      const rooms = await this.roomRepository.findAll();
      if (rooms.length === 0) {
        const defaultRoom = new RoomModel(
          randomUUID(),
          'Sala Única - Home Cinema Argón',
          'VIP Premium',
          25,
          'Dolby Atmos 7.1.4 Surround',
        );
        await this.roomRepository.create(defaultRoom);
        this.logger.log(`✅ [Bootstrap] Sala de cine inicial creada: ${defaultRoom.name}`);
      }

      // 3. Asegurar Tarifas Base si no existen
      const pricing = await this.pricingRepository.findAll();
      if (pricing.length === 0) {
        const defaultTiers: PricingTierModel[] = [
          new PricingTierModel(randomUUID(), 'GENERAL', 'Boleto General', 'Acceso para adultos', 18.0),
          new PricingTierModel(randomUUID(), 'NINO', 'Niños (Hasta 11 años)', 'Tarifa infantil reducida', 13.5),
          new PricingTierModel(randomUUID(), 'ADULTO_MAYOR', 'Adulto Mayor (60+)', 'Descuento con documento', 13.5),
          new PricingTierModel(randomUUID(), 'PROMO_DUO', 'Promo Pareja (2x)', 'Paquete 2 entradas generales', 30.0),
        ];
        await this.pricingRepository.saveBatch(defaultTiers);
        this.logger.log(`✅ [Bootstrap] Tarifas y precios base configurados en MySQL`);
      }
    } catch (err: any) {
      this.logger.error('Error durante la inicialización de configuraciones base:', err.message);
    }
  }
}
