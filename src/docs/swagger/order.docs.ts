/**
 * @swagger
 * tags:
 *   - name: Órdenes
 *     description: Gestión de órdenes y pedidos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         user_id:
 *           type: string
 *         status:
 *           type: string
 *           enum: [PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED]
 *         total_amount:
 *           type: number
 *         shipping_address:
 *           type: object
 *         billing_address:
 *           type: object
 *         items:
 *           type: array
 *           items:
 *             type: object
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     tags: [Órdenes]
 *     summary: Crear una nueva orden
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [items, shipping_address]
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product_id:
 *                       type: string
 *                     variant_id:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *               shipping_address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   postal_code:
 *                     type: string
 *                   country:
 *                     type: string
 *               billing_address:
 *                 type: object
 *                 description: Opcional, usa shipping_address si no se proporciona
 *               notes:
 *                 type: string
 *                 description: Notas adicionales del pedido
 *     responses:
 *       201:
 *         description: Orden creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Datos inválidos
 */

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     tags: [Órdenes]
 *     summary: Obtener una orden por ID
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la orden
 *     responses:
 *       200:
 *         description: Orden encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Orden no encontrada
 */

/**
 * @swagger
 * /orders/user:
 *   get:
 *     tags: [Órdenes]
 *     summary: Listar órdenes del usuario autenticado
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lista de órdenes del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     tags: [Órdenes]
 *     summary: Listar todas las órdenes (Admin)
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lista de todas las órdenes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /orders/{id}/cancel:
 *   post:
 *     tags: [Órdenes]
 *     summary: Cancelar una orden
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la orden
 *     responses:
 *       200:
 *         description: Orden cancelada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: No se puede cancelar la orden
 *       404:
 *         description: Orden no encontrada
 */ 