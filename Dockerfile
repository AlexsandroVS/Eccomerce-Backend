# Dockerfile optimizado para conexiones SSL con MongoDB Atlas
FROM node:18-alpine AS base

# Instalar dependencias del sistema con certificados SSL actualizados
RUN apk add --no-cache \
    ca-certificates \
    openssl \
    curl \
    dumb-init && \
    update-ca-certificates

WORKDIR /app

# ================================
# Etapa de construcción
# ================================
FROM base AS builder

# Copiar archivos de configuración
COPY package*.json tsconfig.json ./

# Instalar dependencias
RUN npm ci

# Copiar schema de Prisma y generar cliente
COPY prisma ./prisma/
RUN npx prisma generate

# Copiar código fuente
COPY src ./src/

# Construir aplicación
RUN npm run build && \
    echo "✅ Build completed" && \
    ls -la dist/ && \
    test -f dist/server.js

# Copiar archivos de documentación de Swagger al dist
RUN cp -r src/docs/swagger dist/docs/ && \
    echo "✅ Swagger docs copied to dist"

# ================================
# Etapa de producción
# ================================
FROM base AS production

# Crear usuario no-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

WORKDIR /app

# Copiar package files e instalar dependencias de producción
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copiar Prisma y generar cliente
COPY prisma ./prisma/
RUN npx prisma generate

# Copiar aplicación construida
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

# Crear directorio de uploads
RUN mkdir -p uploads && chown -R nodejs:nodejs uploads

# Variables de entorno optimizadas para SSL
ENV NODE_ENV=production
ENV NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
ENV PORT=3000

# Health check con mayor timeout para inicialización
HEALTHCHECK --interval=30s --timeout=15s --start-period=60s --retries=5 \
    CMD curl -f http://localhost:$PORT/health || exit 1

# Exponer puerto
EXPOSE 3000

# Cambiar a usuario no-root
USER nodejs

# Comando de inicio con configuraciones SSL
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "--enable-source-maps", "--tls-min-v1.2", "dist/server.js"]