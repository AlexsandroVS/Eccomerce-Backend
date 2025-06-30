/**
 * @swagger
 * tags:
 *   - name: Productos
 *     description: Gestión completa de productos, variantes, imágenes y atributos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductType:
 *       type: string
 *       enum: [SIMPLE, VARIABLE]
 *       description: Tipo de producto - SIMPLE para productos únicos, VARIABLE para productos con variantes
 *       example: "SIMPLE"
 *     
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único del producto
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         name:
 *           type: string
 *           description: Nombre del producto
 *           example: "Silla de Oficina Ergonómica"
 *         sku:
 *           type: string
 *           description: Código SKU único del producto
 *           example: "CHAIR-001"
 *         slug:
 *           type: string
 *           description: URL amigable del producto
 *           example: "silla-oficina-ergonomica"
 *         description:
 *           type: string
 *           description: Descripción detallada del producto
 *           example: "Silla ergonómica con soporte lumbar ajustable"
 *         type:
 *           $ref: '#/components/schemas/ProductType'
 *         base_price:
 *           type: number
 *           format: float
 *           description: Precio base (solo para productos SIMPLE)
 *           example: 299.99
 *         stock:
 *           type: integer
 *           description: Stock disponible (solo para productos SIMPLE)
 *           example: 50
 *         min_stock:
 *           type: integer
 *           description: Stock mínimo para alertas
 *           example: 5
 *         is_active:
 *           type: boolean
 *           description: Estado activo del producto
 *           example: true
 *         sales_count:
 *           type: integer
 *           description: Número de ventas del producto
 *           example: 25
 *         stock_alert:
 *           type: boolean
 *           description: Indica si el stock está por debajo del mínimo
 *           example: false
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *         categories:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Category'
 *         images:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductImage'
 *         variants:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductVariant'
 *         attributes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductAttribute'
 *     
 *     ProductImage:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         product_id:
 *           type: string
 *           format: uuid
 *         url:
 *           type: string
 *           format: uri
 *           example: "https://example.com/images/chair-1.jpg"
 *         alt_text:
 *           type: string
 *           example: "Silla de oficina vista frontal"
 *         is_primary:
 *           type: boolean
 *           description: Indica si es la imagen principal
 *         created_at:
 *           type: string
 *           format: date-time
 *     
 *     ProductVariant:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         product_id:
 *           type: string
 *           format: uuid
 *         sku_suffix:
 *           type: string
 *           description: Sufijo del SKU para la variante
 *           example: "-BLACK-L"
 *         stock:
 *           type: integer
 *           example: 20
 *         price:
 *           type: number
 *           format: float
 *           example: 329.99
 *         min_stock:
 *           type: integer
 *           example: 3
 *         is_active:
 *           type: boolean
 *         attributes:
 *           type: object
 *           description: Atributos específicos de la variante (color, tamaño, etc.)
 *           example: { "color": "Negro", "size": "L" }
 *         images:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductVariantImage'
 *     
 *     ProductAttribute:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         product_id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *           example: "Material"
 *         value:
 *           type: string
 *           example: "Cuero sintético"
 *     
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *           example: "Muebles de Oficina"
 *         slug:
 *           type: string
 *           example: "muebles-oficina"
 *         is_active:
 *           type: boolean
 *     
 *     ProductCreateRequest:
 *       type: object
 *       required: [name, sku, attributes, categories]
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 255
 *           example: "Silla de Oficina Ergonómica"
 *         sku:
 *           type: string
 *           pattern: '^[A-Z0-9-]+$'
 *           example: "CHAIR-001"
 *         slug:
 *           type: string
 *           pattern: '^[a-z0-9-]+$'
 *           example: "silla-oficina-ergonomica"
 *         description:
 *           type: string
 *           maxLength: 1000
 *           example: "Silla ergonómica con soporte lumbar ajustable y reposabrazos"
 *         type:
 *           $ref: '#/components/schemas/ProductType'
 *         base_price:
 *           type: number
 *           minimum: 0
 *           example: 299.99
 *         stock:
 *           type: integer
 *           minimum: 0
 *           example: 50
 *         min_stock:
 *           type: integer
 *           minimum: 0
 *           example: 5
 *         attributes:
 *           type: object
 *           additionalProperties:
 *             type: string
 *           example:
 *             material: "Cuero sintético"
 *             color: "Negro"
 *             weight: "8.5 kg"
 *         categories:
 *           type: array
 *           items:
 *             type: integer
 *           minItems: 1
 *           example: [1, 3]
 *     
 *     ProductUpdateRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 255
 *         sku:
 *           type: string
 *           pattern: '^[A-Z0-9-]+$'
 *         slug:
 *           type: string
 *           pattern: '^[a-z0-9-]+$'
 *         description:
 *           type: string
 *           maxLength: 1000
 *         type:
 *           $ref: '#/components/schemas/ProductType'
 *         base_price:
 *           type: number
 *           minimum: 0
 *         stock:
 *           type: integer
 *           minimum: 0
 *         min_stock:
 *           type: integer
 *           minimum: 0
 *         attributes:
 *           type: object
 *           additionalProperties:
 *             type: string
 *         categories:
 *           type: array
 *           items:
 *             type: integer
 *     
 *     ProductImageUploadRequest:
 *       type: object
 *       required: [image]
 *       properties:
 *         image:
 *           type: string
 *           format: binary
 *           description: Archivo de imagen (JPG, PNG, WebP)
 *         alt_text:
 *           type: string
 *           maxLength: 255
 *           example: "Vista frontal del producto"
 *         is_primary:
 *           type: boolean
 *           description: Marcar como imagen principal
 *           default: false
 *     
 *     ProductListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 *     
 *     ProductResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Product'
 *     
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: string
 *           example: "Producto no encontrado"
 *         statusCode:
 *           type: integer
 *           example: 404
 */

/**
 * @swagger
 * /products:
 *   post:
 *     tags: [Productos]
 *     summary: Crear un nuevo producto
 *     description: Crea un producto nuevo con sus atributos y categorías. Los productos SIMPLE requieren base_price y stock, mientras que los VARIABLE se gestionan a través de variantes.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductCreateRequest'
 *           examples:
 *             simple_product:
 *               summary: Producto Simple
 *               value:
 *                 name: "Silla de Oficina Ergonómica"
 *                 sku: "CHAIR-001"
 *                 description: "Silla ergonómica con soporte lumbar ajustable"
 *                 type: "SIMPLE"
 *                 base_price: 299.99
 *                 stock: 50
 *                 min_stock: 5
 *                 attributes:
 *                   material: "Cuero sintético"
 *                   color: "Negro"
 *                   weight: "8.5 kg"
 *                 categories: [1, 3]
 *             variable_product:
 *               summary: Producto Variable
 *               value:
 *                 name: "Camiseta Básica"
 *                 sku: "TSHIRT-001"
 *                 description: "Camiseta de algodón 100%"
 *                 type: "VARIABLE"
 *                 attributes:
 *                   material: "Algodón 100%"
 *                   fit: "Regular"
 *                 categories: [2]
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: SKU o slug ya existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 *   get:
 *     tags: [Productos]
 *     summary: Listar productos (Admin)
 *     description: Lista todos los productos con opción de incluir inactivos. Requiere permisos de administrador.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: includeInactive
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Incluir productos inactivos en la lista
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Número de elementos por página
 *     responses:
 *       200:
 *         description: Lista de productos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductListResponse'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /products/active:
 *   get:
 *     summary: Listar productos activos
 *     description: Devuelve solo productos activos (is_active=true) y no eliminados (deleted_at=null). Endpoint público para catálogo.
 *     tags: [Productos]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Número de elementos por página
 *       - in: query
 *         name: category
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de categoría
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por nombre o descripción
 *     responses:
 *       200:
 *         description: Lista de productos activos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductListResponse'
 */

/**
 * @swagger
 * /products/slug/{slug}:
 *   get:
 *     tags: [Productos]
 *     summary: Obtener producto por slug
 *     description: Obtiene un producto activo por su slug (URL amigable). Endpoint público.
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-z0-9-]+$'
 *         description: Slug del producto
 *         example: "silla-oficina-ergonomica"
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /products/{identifier}:
 *   get:
 *     tags: [Productos]
 *     summary: Obtener producto por ID o SKU
 *     description: Obtiene un producto por su ID o SKU. Funciona tanto con UUID como con SKU.
 *     parameters:
 *       - in: path
 *         name: identifier
 *         required: true
 *         schema:
 *           type: string
 *         description: ID (UUID) o SKU del producto
 *         example: "CHAIR-001"
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 *   patch:
 *     tags: [Productos]
 *     summary: Actualizar producto
 *     description: Actualiza un producto existente. Solo se actualizan los campos proporcionados.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: identifier
 *         required: true
 *         schema:
 *           type: string
 *         description: ID (UUID) o SKU del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductUpdateRequest'
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 *   delete:
 *     tags: [Productos]
 *     summary: Eliminar producto (soft delete)
 *     description: Realiza un soft delete del producto (marca deleted_at y desactiva). El producto puede ser restaurado posteriormente.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: identifier
 *         required: true
 *         schema:
 *           type: string
 *         description: ID (UUID) o SKU del producto
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Producto eliminado exitosamente"
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /products/{identifier}/activate:
 *   patch:
 *     tags: [Productos]
 *     summary: Activar producto
 *     description: Activa un producto previamente desactivado
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: identifier
 *         required: true
 *         schema:
 *           type: string
 *         description: ID (UUID) o SKU del producto
 *     responses:
 *       200:
 *         description: Producto activado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /products/{identifier}/deactivate:
 *   patch:
 *     tags: [Productos]
 *     summary: Desactivar producto
 *     description: Desactiva un producto (no lo elimina)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: identifier
 *         required: true
 *         schema:
 *           type: string
 *         description: ID (UUID) o SKU del producto
 *     responses:
 *       200:
 *         description: Producto desactivado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /products/{identifier}/restore:
 *   patch:
 *     tags: [Productos]
 *     summary: Restaurar producto eliminado
 *     description: Restaura un producto que fue eliminado (soft delete)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: identifier
 *         required: true
 *         schema:
 *           type: string
 *         description: ID (UUID) o SKU del producto
 *     responses:
 *       200:
 *         description: Producto restaurado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /products/{identifier}/images:
 *   post:
 *     tags: [Productos]
 *     summary: Subir imagen de producto
 *     description: Sube una imagen para un producto específico. Si is_primary=true, desactiva otras imágenes principales.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: identifier
 *         required: true
 *         schema:
 *           type: string
 *         description: ID (UUID) o SKU del producto
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/ProductImageUploadRequest'
 *     responses:
 *       201:
 *         description: Imagen subida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ProductImage'
 *       400:
 *         description: Archivo inválido o datos incorrectos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /products/images/{imageId}:
 *   delete:
 *     tags: [Productos]
 *     summary: Eliminar imagen de producto
 *     description: Elimina una imagen específica de un producto
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la imagen a eliminar
 *     responses:
 *       200:
 *         description: Imagen eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Imagen eliminada exitosamente"
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Imagen no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
