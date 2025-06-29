# Documentación de la API - Swagger

Esta carpeta contiene toda la documentación de la API REST generada con Swagger/OpenAPI 3.0.

## 📁 Estructura de Archivos

```
docs/
├── swagger.ts                 # Configuración principal de Swagger
├── swagger/
│   ├── index.ts              # Archivo índice que importa todas las documentaciones
│   ├── auth.docs.ts          # Documentación de autenticación
│   ├── category.docs.ts      # Documentación de categorías
│   ├── product.docs.ts       # Documentación de productos
│   ├── productVariant.docs.ts # Documentación de variantes de productos
│   ├── designTemplate.docs.ts # Documentación de plantillas de diseño
│   ├── inventoryLog.docs.ts  # Documentación de registro de inventario
│   ├── productReview.docs.ts # Documentación de reseñas de productos
│   ├── order.docs.ts         # Documentación de órdenes
│   ├── wishlist.docs.ts      # Documentación de lista de deseos
│   └── health.docs.ts        # Documentación de health checks
└── README.md                 # Este archivo
```

## 🚀 Cómo Acceder a la Documentación

### Desarrollo Local
```
http://localhost:3000/api-docs
```

### Producción
```
https://api.ecomerce.com/api-docs
```

## 🔐 Autenticación

La API utiliza autenticación basada en cookies. Para autenticarte:

1. **Registro**: `POST /api/auth/register`
2. **Login**: `POST /api/auth/login`
3. **El token se almacena automáticamente en una cookie**

### Roles de Usuario
- `ADMIN`: Acceso completo a todas las funcionalidades
- `CUSTOMER`: Usuario cliente con acceso limitado
- `VENDOR`: Vendedor con permisos específicos
- `DESIGNER`: Diseñador con acceso a plantillas

## 📋 Endpoints Disponibles

### 🔑 Autenticación
- `POST /auth/register` - Registrar nuevo usuario
- `POST /auth/login` - Iniciar sesión
- `GET /auth/profile` - Obtener perfil del usuario
- `POST /auth/logout` - Cerrar sesión

### 🏷️ Categorías
- `POST /categories` - Crear categoría (ADMIN)
- `GET /categories` - Listar categorías
- `GET /categories/{id}` - Obtener categoría por ID
- `PATCH /categories/{id}` - Actualizar categoría (ADMIN)
- `DELETE /categories/{id}` - Eliminar categoría (ADMIN)

### 📦 Productos
- `POST /products` - Crear producto (ADMIN)
- `GET /products` - Listar productos con filtros
- `GET /products/{id}` - Obtener producto por ID
- `PATCH /products/{id}` - Actualizar producto (ADMIN)
- `DELETE /products/{id}` - Eliminar producto (ADMIN)
- `POST /products/{id}/images` - Subir imágenes (ADMIN)

### 🎨 Variantes de Productos
- `POST /product-variants` - Crear variante (ADMIN)
- `GET /product-variants` - Listar variantes
- `GET /product-variants/{id}` - Obtener variante por ID
- `PATCH /product-variants/{id}` - Actualizar variante (ADMIN)
- `DELETE /product-variants/{id}` - Eliminar variante (ADMIN)
- `POST /product-variants/{id}/images` - Subir imágenes (ADMIN)

### 🛒 Órdenes
- `POST /orders` - Crear orden (CUSTOMER)
- `GET /orders` - Listar todas las órdenes (ADMIN)
- `GET /orders/user` - Listar órdenes del usuario
- `GET /orders/{id}` - Obtener orden por ID
- `POST /orders/{id}/cancel` - Cancelar orden

### ❤️ Lista de Deseos
- `POST /wishlist` - Agregar producto a wishlist
- `GET /wishlist` - Obtener wishlist del usuario
- `DELETE /wishlist` - Remover producto del wishlist

### ⭐ Reseñas de Productos
- `POST /product-reviews` - Crear reseña
- `GET /product-reviews/{product_id}` - Obtener reseñas de un producto
- `GET /product-reviews/{product_id}/average` - Obtener estadísticas

### 🎨 Plantillas de Diseño
- `POST /design-templates` - Crear plantilla (ADMIN/DESIGNER)
- `GET /design-templates` - Listar plantillas
- `GET /design-templates/slug/{slug}` - Obtener plantilla por slug
- `PATCH /design-templates/{id}` - Actualizar plantilla (ADMIN/DESIGNER)
- `DELETE /design-templates/{id}` - Eliminar plantilla (ADMIN)

### 📊 Registro de Inventario
- `POST /inventory-logs` - Registrar movimiento (ADMIN)
- `GET /inventory-logs` - Obtener historial (ADMIN)
- `POST /inventory-logs/adjust` - Ajuste manual de stock (ADMIN)

### 🏥 Health Check
- `GET /health` - Verificar estado general de servicios
- `GET /health/redis` - Verificar estado específico de Redis

## 📝 Convenciones de Documentación

### Esquemas
- Cada endpoint tiene su esquema correspondiente
- Los esquemas están organizados por funcionalidad
- Se incluyen validaciones y ejemplos

### Respuestas
- **200**: Operación exitosa
- **201**: Recurso creado exitosamente
- **400**: Datos inválidos
- **401**: No autorizado
- **403**: Sin permisos
- **404**: Recurso no encontrado
- **409**: Conflicto (ej: reseña duplicada)
- **500**: Error interno del servidor

### Parámetros
- **Path Parameters**: Para identificar recursos específicos
- **Query Parameters**: Para filtros, paginación y ordenamiento
- **Body**: Para datos de entrada en POST/PATCH

## 🔧 Desarrollo

### Agregar Nueva Documentación

1. Crear archivo `nuevoModulo.docs.ts` en `swagger/`
2. Seguir el patrón de documentación existente
3. Importar en `swagger/index.ts`
4. Agregar tag correspondiente en `swagger.ts`

### Ejemplo de Documentación

```typescript
/**
 * @swagger
 * tags:
 *   - name: Nuevo Módulo
 *     description: Descripción del módulo
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     NuevoSchema:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 */

/**
 * @swagger
 * /nuevo-endpoint:
 *   get:
 *     tags: [Nuevo Módulo]
 *     summary: Descripción del endpoint
 *     responses:
 *       200:
 *         description: Respuesta exitosa
 */
```

## 🧪 Testing

### Probar Endpoints
1. Usar la interfaz de Swagger UI
2. Autenticarse primero con `/auth/login`
3. Probar endpoints protegidos
4. Verificar respuestas y códigos de estado

### Validación
- Todos los endpoints incluyen validación de esquemas
- Los errores devuelven mensajes descriptivos
- Se incluyen ejemplos de uso

## 📚 Recursos Adicionales

- [OpenAPI 3.0 Specification](https://swagger.io/specification/)
- [Swagger JSDoc](https://github.com/Surnet/swagger-jsdoc)
- [Swagger UI Express](https://github.com/scottie1984/swagger-ui-express)

## 🤝 Contribución

Para contribuir a la documentación:

1. Seguir las convenciones establecidas
2. Incluir ejemplos prácticos
3. Mantener consistencia en el formato
4. Actualizar este README si es necesario 