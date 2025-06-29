/**
 * @swagger
 * tags:
 *   - name: Variantes de Productos
 *     description: Gestión de variantes de productos (tamaños, colores, etc.)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductVariant:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         product_id:
 *           type: string
 *         sku_suffix:
 *           type: string
 *         stock:
 *           type: integer
 *         price:
 *           type: number
 *         min_stock:
 *           type: integer
 *         is_active:
 *           type: boolean
 *         attributes:
 *           type: object
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /product-variants:
 *   post:
 *     tags: [Variantes de Productos]
 *     summary: Crear una nueva variante de producto
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [product_id, stock]
 *             properties:
 *               product_id:
 *                 type: string
 *                 description: ID del producto padre
 *               sku_suffix:
 *                 type: string
 *                 description: Sufijo para el SKU (opcional, se genera automáticamente)
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *                 description: Cantidad en stock
 *               price:
 *                 type: number
 *                 description: Precio de la variante (opcional, usa precio base del producto)
 *               min_stock:
 *                 type: integer
 *                 default: 5
 *                 description: Stock mínimo para alertas
 *               attributes:
 *                 type: object
 *                 description: Atributos específicos de la variante (color, tamaño, etc.)
 *     responses:
 *       201:
 *         description: Variante creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductVariant'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Producto no encontrado
 */

/**
 * @swagger
 * /product-variants/{id}:
 *   patch:
 *     tags: [Variantes de Productos]
 *     summary: Actualizar una variante de producto
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la variante
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sku_suffix:
 *                 type: string
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *               price:
 *                 type: number
 *               min_stock:
 *                 type: integer
 *               is_active:
 *                 type: boolean
 *               attributes:
 *                 type: object
 *     responses:
 *       200:
 *         description: Variante actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductVariant'
 *       404:
 *         description: Variante no encontrada
 */

/**
 * @swagger
 * /product-variants/{id}:
 *   delete:
 *     tags: [Variantes de Productos]
 *     summary: Desactivar una variante de producto
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la variante
 *     responses:
 *       200:
 *         description: Variante desactivada exitosamente
 *       404:
 *         description: Variante no encontrada
 */

/**
 * @swagger
 * /product-variants/{id}:
 *   get:
 *     tags: [Variantes de Productos]
 *     summary: Obtener una variante por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la variante
 *     responses:
 *       200:
 *         description: Variante encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductVariant'
 *       404:
 *         description: Variante no encontrada
 */

/**
 * @swagger
 * /product-variants/product/{productId}:
 *   get:
 *     tags: [Variantes de Productos]
 *     summary: Listar todas las variantes de un producto
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Lista de variantes del producto
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductVariant'
 */

/**
 * @swagger
 * /product-variants/{id}/images:
 *   post:
 *     tags: [Variantes de Productos]
 *     summary: Subir imagen para una variante
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la variante
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [image]
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Archivo de imagen
 *               alt_text:
 *                 type: string
 *                 description: Texto alternativo de la imagen
 *               is_primary:
 *                 type: boolean
 *                 description: Si es la imagen principal
 *     responses:
 *       201:
 *         description: Imagen subida exitosamente
 *       400:
 *         description: Archivo no recibido
 */

/**
 * @swagger
 * /product-variants/images/{imageId}:
 *   delete:
 *     tags: [Variantes de Productos]
 *     summary: Eliminar imagen de una variante
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la imagen
 *     responses:
 *       200:
 *         description: Imagen eliminada exitosamente
 *       404:
 *         description: Imagen no encontrada
 */ 