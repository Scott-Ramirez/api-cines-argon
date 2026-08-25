# ==============================================================================
# STAGE 1: Build the NestJS application
# ==============================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar herramientas necesarias para módulos nativos de node
RUN apk add --no-cache libc6-compat python3 make g++

# Copiar manifiestos de dependencias
COPY package*.json ./

# Instalar todas las dependencias (incluyendo devDependencies para compilar)
RUN npm install

# Copiar el código fuente
COPY . .

# Compilar TypeScript a JavaScript en /app/dist
RUN npm run build

# Eliminar dependencias de desarrollo para dejar solo las de producción
RUN npm prune --production

# ==============================================================================
# STAGE 2: Production Lightweight Image
# ==============================================================================
FROM node:20-alpine AS runner

WORKDIR /app

# Definir entorno de producción
ENV NODE_ENV=production
ENV PORT=4000

# Crear usuario no root para mayor seguridad
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# Copiar archivos compilados y dependencias de producción desde el builder
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./package.json

# Cambiar al usuario seguro no-root
USER nestjs

# Exponer el puerto por defecto (Render asignará su propio PORT dinámicamente)
EXPOSE 4000

# Comando de inicio del servidor de producción
CMD ["node", "dist/main"]
