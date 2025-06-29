/**
 * @swagger
 * tags:
 *   - name: Lista de Deseos
 *     description: Gestión de la lista de deseos del usuario
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     WishlistItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         user_id:
 *           type: string
 *         product_id:
 *           type: string
 *         product:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *             slug:
 *               type: string
 *             base_price:
 *               type: number
 *             images:
 *               type: array
 *               items:
 *                 type: object
 *         created_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /wishlist:
 *   post:
 *     tags: [Lista de Deseos]
 *     summary: Agregar producto a la lista de deseos
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [product_id]
 *             properties:
 *               product_id:
 *                 type: string
 *                 description: ID del producto a agregar
 *     responses:
 *       200:
 *         description: Producto agregado a la lista de deseos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Agregado al wishlist"
 *                 wishlist:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/WishlistItem'
 *       400:
 *         description: Error al agregar producto
 *       404:
 *         description: Producto no encontrado
 */

/**
 * @swagger
 * /wishlist:
 *   delete:
 *     tags: [Lista de Deseos]
 *     summary: Remover producto de la lista de deseos
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [product_id]
 *             properties:
 *               product_id:
 *                 type: string
 *                 description: ID del producto a remover
 *     responses:
 *       200:
 *         description: Producto removido de la lista de deseos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Eliminado del wishlist"
 *                 wishlist:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/WishlistItem'
 *       400:
 *         description: Error al remover producto
 *       404:
 *         description: Producto no encontrado en la lista
 */

/**
 * @swagger
 * /wishlist:
 *   get:
 *     tags: [Lista de Deseos]
 *     summary: Obtener lista de deseos del usuario
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lista de deseos del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WishlistItem'
 *       400:
 *         description: Error al obtener la lista de deseos
 */ 