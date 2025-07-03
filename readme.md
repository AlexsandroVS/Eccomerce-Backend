# 🛒 E-commerce Backend API

Backend completo para e-commerce con PostgreSQL, Redis, MongoDB y Stripe para pagos.

## 🚀 Características

- **Base de datos principal**: PostgreSQL (Render)
- **Cache y sesiones**: Redis (Upstash)
- **Logs y analytics**: MongoDB Atlas
- **Pagos**: Stripe Integration
- **Autenticación**: JWT con cookies
- **Documentación**: Swagger UI
- **Uploads**: Manejo de imágenes
- **Docker**: Containerización completa

## 📋 Prerrequisitos

- Node.js 18+
- PostgreSQL (Render)
- Redis (Upstash)
- MongoDB Atlas (opcional)
- Stripe Account

## 🔧 Instalación

### 1. Clonar y instalar dependencias

```bash
git clone <repository-url>
cd Eccomerce
npm install
```

### 2. Configurar variables de entorno

Crear archivo `.env`:

```env
# Server
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# Redis
REDIS_URL="redis://user:password@host:port"

# MongoDB (opcional)
MONGODB_URI="mongodb+srv://user:password@cluster.mongodb.net/database"

# JWT
JWT_SECRET="your-super-secret-jwt-key"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Frontend URL
FRONTEND_URL="http://localhost:5173"
```

### 3. Configurar base de datos

```bash
# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# (Opcional) Ver datos con Prisma Studio
npx prisma studio
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

## 🐳 Docker

### Construir imagen

```bash
docker build -t ecommerce-backend .
```

### Ejecutar contenedor

```bash
docker run -d \
  --name ecommerce-backend \
  -p 3000:3000 \
  --env-file .env \
  ecommerce-backend
```

## 🚀 Deploy a Render

### 1. Preparar el proyecto

```bash
# Verificar que todo funciona
npm run test:connections
npm run build
```

### 2. Configurar en Render

1. Conectar tu repositorio de GitHub
2. Configurar como **Web Service**
3. Usar las siguientes configuraciones:

**Build Command:**
```bash
npm ci && npm run build && npx prisma generate
```

**Start Command:**
```bash
npm start
```

### 3. Variables de entorno en Render

Configurar las siguientes variables en Render:

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `NODE_ENV` | Entorno | `production` |
| `PORT` | Puerto del servidor | `3000` |
| `DATABASE_URL` | URL de PostgreSQL | `postgresql://...` |
| `REDIS_URL` | URL de Redis | `redis://...` |
| `MONGODB_URI` | URL de MongoDB (opcional) | `mongodb+srv://...` |
| `JWT_SECRET` | Clave secreta para JWT | `your-secret-key` |
| `STRIPE_SECRET_KEY` | Clave secreta de Stripe | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Secreto del webhook | `whsec_...` |
| `FRONTEND_URL` | URL del frontend | `https://your-app.com` |

### 4. Configurar Stripe

1. **Crear cuenta en Stripe**: https://stripe.com
2. **Obtener claves API**:
   - Dashboard → Developers → API Keys
   - Copiar `Publishable key` y `Secret key`
3. **Configurar webhook**:
   - Dashboard → Developers → Webhooks
   - Endpoint: `https://your-app.onrender.com/api/payments/webhook`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`

## 📊 Endpoints Principales

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/profile` - Perfil del usuario

### Productos
- `GET /api/products/active` - Listar productos activos
- `GET /api/products/{id}` - Obtener producto
- `POST /api/products` - Crear producto (admin)
- `PATCH /api/products/{id}` - Actualizar producto (admin)

### Categorías
- `GET /api/categories` - Listar categorías
- `POST /api/categories` - Crear categoría (admin)
- `GET /api/categories/{id}/products` - Productos por categoría

### Pagos (Stripe)
- `POST /api/payments/create` - Crear PaymentIntent
- `POST /api/payments/webhook` - Webhook de Stripe
- `POST /api/payments/refund` - Reembolsar pago
- `GET /api/payments/order/{orderId}` - Pagos de una orden

### Órdenes
- `POST /api/orders` - Crear orden
- `GET /api/orders/user` - Órdenes del usuario
- `GET /api/orders/{id}` - Obtener orden

### Documentación
- `GET /api-docs` - Swagger UI
- `GET /api-docs/swagger.json` - Especificación OpenAPI

### Health Checks
- `GET /health` - Estado general del sistema
- `GET /health/redis` - Estado de Redis
- `GET /health/mongo` - Estado de MongoDB

## 🔍 Monitoreo y Logs

### Health Check Completo

```bash
curl https://your-app.onrender.com/health
```

Respuesta:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "totalLatency": "150ms",
  "services": {
    "redis": { "status": "healthy", "latency": "5ms" },
    "postgres": { "status": "healthy", "latency": "25ms" },
    "mongo": { "status": "healthy", "latency": "120ms" },
    "stripe": { "status": "healthy", "latency": "200ms" }
  }
}
```

### Logs en Render

- Dashboard → Tu servicio → Logs
- Monitorear errores y performance

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm run dev                    # Servidor de desarrollo
npm run build                  # Compilar TypeScript
npm run test:connections       # Probar conexiones

# Base de datos
npm run prisma:generate        # Generar cliente Prisma
npm run prisma:migrate         # Ejecutar migraciones
npm run prisma:studio          # Abrir Prisma Studio

# Deploy
npm run deploy:prepare         # Preparar para deploy
npm run deploy:test           # Probar antes del deploy

# Limpieza
npm run clean                 # Limpiar dist/
npm run clean:install         # Reinstalar dependencias
```

## 🔒 Seguridad

### Variables de Entorno Críticas

- `JWT_SECRET`: Clave única y compleja
- `STRIPE_SECRET_KEY`: Solo claves de producción en producción
- `DATABASE_URL`: URL segura con SSL
- `REDIS_URL`: URL segura con TLS

### Configuraciones de Seguridad

- CORS configurado para dominio específico
- JWT con expiración
- Validación de entrada en todos los endpoints
- Sanitización de datos
- Rate limiting (implementar si es necesario)

## 📈 Performance

### Optimizaciones Implementadas

- **Connection Pooling**: PostgreSQL y MongoDB
- **Redis Caching**: Sesiones y datos frecuentes
- **Lazy Loading**: Conexiones bajo demanda
- **Graceful Shutdown**: Cierre limpio de conexiones
- **Health Checks**: Monitoreo continuo

### Métricas a Monitorear

- Latencia de base de datos
- Uso de memoria
- Tiempo de respuesta de API
- Tasa de errores
- Uso de Redis

## 🐛 Troubleshooting

### Problemas Comunes

1. **Error de conexión a base de datos**
   ```bash
   npm run test:connections
   ```

2. **Error de Stripe**
   - Verificar claves API
   - Verificar webhook endpoint
   - Revisar logs de Stripe

3. **Error de Redis**
   - Verificar URL de Redis
   - Verificar configuración TLS

4. **Error de MongoDB**
   - Verificar IP whitelist en Atlas
   - Verificar credenciales

### Logs Útiles

```bash
# Ver logs en desarrollo
npm run dev

# Ver logs en Render
# Dashboard → Tu servicio → Logs

# Health check
curl https://your-app.onrender.com/health
```

## 📞 Soporte

- **Documentación API**: `/api-docs`
- **Health Check**: `/health`
- **Logs**: Render Dashboard
- **Issues**: GitHub Issues

## 📄 Licencia

MIT License 