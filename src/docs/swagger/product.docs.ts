/**
 * @swagger
 * tags:
 *   - name: Productos
 *     description: CRUD de productos y subida de imágenes
 */

/**
 * @swagger
 * /products:
 *   post:
 *     tags: [Productos]
 *     summary: Crear un producto
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, sku, type, attributes, categories]
 *             properties:
 *               name:
 *                 type: string
 *               sku:
 *                 type: string
 *               slug:
 *                 type: string
 *               type:
 *                 type: string
 *               attributes:
 *                 type: object
 *               categories:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Producto creado
 */

/**
 * @swagger
 * /products:
 *   get:
 *     tags: [Productos]
 *     summary: Listar productos activos
 *     responses:
 *       200:
 *         description: Lista de productos
 */

/**
 * @swagger
 * /products/slug/{slug}:
 *   get:
 *     tags: [Productos]
 *     summary: Obtener un producto por slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto encontrado
 */

/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     tags: [Productos]
 *     summary: Actualizar un producto (parcial)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               attributes:
 *                 type: object
 *               categories:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Producto actualizado
 */

/**
 * @swagger
 * /products/{sku}:
 *   delete:
 *     tags: [Productos]
 *     summary: Eliminar un producto por SKU
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: sku
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto eliminado lógicamente
 */

/**
 * @swagger
 * /products/{id}/images:
 *   post:
 *     tags: [Productos]
 *     summary: Subir una imagen de producto
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *               alt_text:
 *                 type: string
 *               is_primary:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Imagen subida
 */
