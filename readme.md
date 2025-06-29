# 🛒 E-commerce Backend API

Backend del sistema Ecommerce construido con **Node.js**, **Express**, **TypeScript** y **Prisma ORM**.  
Implementa autenticación segura con JWT almacenado en **cookies HttpOnly**.

## 🏗️ Arquitectura del Sistema

### Base de Datos
- **PostgreSQL**: Base de datos principal con Prisma ORM
- **Redis**: Cache y sesiones de usuario
- **MongoDB**: Logs y analytics

### Estructura de Carpetas
```
src/
├── config/              # Configuraciones de conexión
│   ├── db.config.ts     # PostgreSQL + Prisma
│   ├── redis.config.ts  # Redis client
│   ├── mongo.config.ts  # MongoDB client
│   └── testConnections.ts
├── controllers/         # Controladores de la API
│   ├── auth.controller.ts
│   ├── product.controller.ts
│   ├── category.controller.ts
│   ├── order.controller.ts
│   └── ...
├── services/           # Lógica de negocio
│   ├── auth.service.ts
│   ├── product.service.ts
│   ├── cache.service.ts
│   └── ...
├── routes/             # Definición de rutas
│   ├── auth.routes.ts
│   ├── product.routes.ts
│   └── ...
├── middlewares/        # Middlewares personalizados
│   ├── auth.middleware.ts
│   └── error.middleware.ts
├── types/              # Tipos TypeScript
├── utils/              # Utilidades
└── docs/               # Documentación Swagger
```

## 🗄️ Modelos de Base de Datos

### User
```prisma
model User {
  id         String   @id @default(uuid())
  email      String   @unique
  password   String
  role       UserRole @default(CUSTOMER)
  is_active  Boolean  @default(true)
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt
  
  // Relaciones
  profile    UserProfile?
  orders     Order[]
  reviews    ProductReview[]
  wishlist   Wishlist[]
}

enum UserRole {
  CUSTOMER
  EMPLOYEE
  ADMIN
}
```

### Product
```prisma
model Product {
  id          String      @id @default(uuid())
  name        String
  sku         String      @unique
  slug        String      @unique
  description String?
  type        ProductType @default(SIMPLE)
  base_price  Decimal?
  is_active   Boolean     @default(true)
  stock_alert Boolean     @default(false)
  sales_count Int         @default(0)
  created_at  DateTime    @default(now())
  updated_at  DateTime    @updatedAt
  deleted_at  DateTime?
  
  // Relaciones
  attributes  ProductAttribute[]
  images      ProductImage[]
  variants    ProductVariant[]
  categories  ProductCategory[]
  reviews     ProductReview[]
  orderItems  OrderItem[]
}

enum ProductType {
  SIMPLE
  VARIABLE
}
```

### ProductVariant
```prisma
model ProductVariant {
  id         String   @id @default(uuid())
  product_id String
  sku_suffix String
  stock      Int      @default(0)
  price      Decimal
  min_stock  Int      @default(0)
  is_active  Boolean  @default(true)
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt
  deleted_at DateTime?
  
  // Relaciones
  product    Product  @relation(fields: [product_id], references: [id])
  attributes Json?
  images     ProductVariantImage[]
  orderItems OrderItem[]
}
```

## 📡 Endpoints de la API

### Autenticación (`/api/auth`)
| Método | Endpoint | Descripción | Roles |
|--------|----------|-------------|-------|
| POST | `/register` | Registro de usuarios | Todos |
| POST | `/login` | Login de usuarios | Todos |
| POST | `/logout` | Logout | Autenticados |
| GET | `/profile` | Perfil del usuario | Autenticados |
| PUT | `/profile` | Actualizar perfil | Autenticados |

### Productos (`/api/products`)
| Método | Endpoint | Descripción | Roles |
|--------|----------|-------------|-------|
| GET | `/` | Listar productos | Todos |
| POST | `/` | Crear producto | ADMIN, EMPLOYEE |
| GET | `/:id` | Obtener producto | Todos |
| PUT | `/:id` | Actualizar producto | ADMIN, EMPLOYEE |
| DELETE | `/:id` | Eliminar producto | ADMIN, EMPLOYEE |
| POST | `/:id/images` | Subir imágenes | ADMIN, EMPLOYEE |

### Variantes (`/api/product-variants`)
| Método | Endpoint | Descripción | Roles |
|--------|----------|-------------|-------|
| GET | `/` | Listar variantes | Todos |
| POST | `/` | Crear variante | ADMIN, EMPLOYEE |
| GET | `/:id` | Obtener variante | Todos |
| PUT | `/:id` | Actualizar variante | ADMIN, EMPLOYEE |
| DELETE | `/:id` | Eliminar variante | ADMIN, EMPLOYEE |

### Categorías (`/api/categories`)
| Método | Endpoint | Descripción | Roles |
|--------|----------|-------------|-------|
| GET | `/` | Listar categorías | Todos |
| POST | `/` | Crear categoría | ADMIN, EMPLOYEE |
| PUT | `/:id` | Actualizar categoría | ADMIN, EMPLOYEE |
| DELETE | `/:id` | Eliminar categoría | ADMIN, EMPLOYEE |

## 🔐 Sistema de Autenticación

### JWT Token
- **Almacenamiento**: Cookies HttpOnly
- **Expiración**: 24 horas
- **Refresh**: Implementado con Redis
- **Seguridad**: CSRF protection

### Roles y Permisos
```typescript
enum UserRole {
  CUSTOMER = 'CUSTOMER',    // Cliente final
  EMPLOYEE = 'EMPLOYEE',    // Empleado (gestión productos)
  ADMIN = 'ADMIN'          // Administrador (acceso total)
}
```

### Middleware de Autenticación
```typescript
// Verificar token JWT
authMiddleware(req, res, next)

// Verificar rol específico
requireRole(['ADMIN', 'EMPLOYEE'])(req, res, next)
```

## 🚀 Instalación y Configuración

### 1. Prerrequisitos
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- MongoDB 5+ (opcional para logs)

### 2. Instalación
```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/ecommerce-project.git
cd Eccomerce

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
```

### 3. Configuración de Base de Datos
```bash
# Ejecutar migraciones
npx prisma migrate dev --name init

# Generar cliente Prisma
npx prisma generate

# Poblar base de datos (opcional)
npm run seed
```

### 4. Variables de Entorno
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce"
REDIS_URL="redis://localhost:6379"
MONGODB_URI="mongodb://localhost:27017/ecommerce_logs"

# JWT
JWT_SECRET="tu-secret-super-seguro"
JWT_EXPIRES_IN="24h"

# Server
PORT=3000
NODE_ENV=development

# File Upload
UPLOAD_PATH="./uploads"
MAX_FILE_SIZE=5242880
```

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Servidor con hot reload
npm run build            # Build para producción
npm run start            # Iniciar en producción

# Base de datos
npm run prisma:studio    # Abrir Prisma Studio
npm run migrate          # Ejecutar migraciones
npm run seed             # Poblar base de datos
npm run db:reset         # Resetear base de datos

# Testing
npm run test             # Tests unitarios
npm run test:e2e         # Tests end-to-end
npm run test:coverage    # Coverage de tests

# Linting y formateo
npm run lint             # ESLint
npm run lint:fix         # ESLint con auto-fix
npm run format           # Prettier
```

## 🧪 Testing

### Estructura de Tests
```
tests/
├── unit/                # Tests unitarios
│   ├── services/
│   ├── controllers/
│   └── utils/
├── integration/         # Tests de integración
│   ├── auth.test.ts
│   ├── products.test.ts
│   └── categories.test.ts
└── e2e/                # Tests end-to-end
    └── api.test.ts
```

### Ejecutar Tests
```bash
# Todos los tests
npm run test

# Tests específicos
npm run test -- --grep "auth"

# Tests con coverage
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

## 📊 Logging y Monitoreo

### Logs Estructurados
```typescript
// Ejemplo de logging
logger.info('Product created', {
  productId: product.id,
  userId: req.user.id,
  action: 'CREATE_PRODUCT'
});
```

### Métricas
- Request/response times
- Error rates
- Database query performance
- Memory usage

## 🔧 Configuración de Desarrollo

### Hot Reload
```bash
npm run dev
# Servidor se reinicia automáticamente en cambios
```

### Debugging
```bash
# Con Node.js inspector
npm run dev:debug

# Con VS Code
# Configurar launch.json para debugging
```

### Prisma Studio
```bash
npm run prisma:studio
# Abre interfaz web para inspeccionar DB
```

## 🚀 Despliegue

### Producción
```bash
# Build
npm run build

# Variables de entorno de producción
NODE_ENV=production
PORT=3000

# Iniciar
npm run start
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📈 Estado Actual del Desarrollo

### ✅ Implementado
- [x] Sistema de autenticación JWT
- [x] CRUD de productos
- [x] Sistema de variantes
- [x] Gestión de categorías
- [x] Upload de imágenes
- [x] Middleware de autorización
- [x] Validación de datos
- [x] Manejo de errores
- [x] Documentación Swagger

### 🚧 En Desarrollo
- [ ] Sistema de carrito (Redis)
- [ ] Gestión de órdenes
- [ ] Sistema de pagos
- [ ] Wishlist
- [ ] Sistema de reseñas
- [ ] Notificaciones

### 📋 Pendientes
- [ ] Tests unitarios completos
- [ ] Tests de integración
- [ ] Performance optimization
- [ ] Rate limiting
- [ ] API versioning
- [ ] GraphQL support

## 🤝 Contribuir

### Flujo de Trabajo
1. Fork el repositorio
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Hacer commits descriptivos
4. Push y crear Pull Request

### Convenciones
- **Commits**: [Conventional Commits](https://www.conventionalcommits.org/)
- **Branches**: `feature/`, `fix/`, `hotfix/`, `docs/`
- **Code Style**: ESLint + Prettier
- **Tests**: Requeridos para nuevas funcionalidades

## 📚 Documentación Adicional

- [API Documentation](./docs/swagger/)
- [Database Schema](./prisma/schema.prisma)
- [Environment Variables](./.env.example)
- [Deployment Guide](./docs/deployment.md)

## 🆘 Soporte

- **Issues**: Crear issue en GitHub
- **Discussions**: Usar GitHub Discussions
- **Email**: contacto@ecommerce.com

---

**Desarrollado con ❤️ por el equipo de E-commerce Backend**
