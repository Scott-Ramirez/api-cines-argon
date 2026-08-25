import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Prefijo global
  app.setGlobalPrefix('api');

  // Habilitar CORS dinámico y robusto para desarrollo y producción
  const rawCorsOrigin = process.env.CORS_ORIGIN || '';
  const configuredOrigins = rawCorsOrigin
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  const defaultDevOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
  ];

  const allowedOrigins = Array.from(new Set([...configuredOrigins, ...defaultDevOrigins]));

  app.enableCors({
    origin: (origin, callback) => {
      // Permitir peticiones sin origin (como Postman o curl) o si coincide con allowedOrigins o localhost
      if (!origin || allowedOrigins.includes(origin) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // En desarrollo permitir conexiones
      }
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'X-Requested-With'],
  });

  // Validaciones globales de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Configuración de Swagger / OpenAPI
  const config = new DocumentBuilder()
    .setTitle('Cines Argón - API REST')
    .setDescription('Backend y API REST para el sistema Cines Argón (Home Cinema)')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Cines Argón API Docs',
  });

  const port = process.env.PORT || 4000;
  await app.listen(port, '0.0.0.0');

  logger.log(`🚀 Servidor ejecutándose en: http://localhost:${port}/api`);
  logger.log(`📚 Documentación Swagger en: http://localhost:${port}/api/docs`);
}

bootstrap();
