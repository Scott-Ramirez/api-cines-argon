import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CryptoService } from './crypto.service';
import { JwtStrategy } from './jwt.strategy';

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET || 'ARGON_CINEMA_SUPER_SECRET_JWT_KEY_2026',
        signOptions: {
          expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        },
      }),
    }),
  ],
  providers: [CryptoService, JwtStrategy],
  exports: [CryptoService, JwtStrategy, JwtModule, PassportModule],
})
export class SecurityModule {}
