/**
 * @swagger
 * tags:
 *   - name: Registro de Inventario
 *     description: Gestión de movimientos y ajustes de inventario
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     InventoryMovement:
 *       type: string
 *       enum: [in, out, adjustment, sale, return]
 *       description: Tipo de movimiento de inventario
 *     InventoryLogCreate:
 *       type: object
 *       required: [product_id, quantity, movement]
 *       properties:
 *         product_id:
 *           type: string
 *           description: ID del producto
 *         variant_id:
 *           type: string
 *           description: ID de la variante (opcional)
 *         quantity:
 *           type: number
 *           description: Cantidad del movimiento
 *         movement:
 *           $ref: '#/components/schemas/InventoryMovement'
 *         reason:
 *           type: string
 *           description: Razón del movimiento
 *         reference_id:
 *           type: string
 *           description: ID de referencia (orden, etc.)
 *     InventoryLogAdjust:
 *       type: object
 *       required: [product_id, quantity]
 *       properties:
 *         product_id:
 *           type: string
 *           description: ID del producto
 *         variant_id:
 *           type: string
 *           description: ID de la variante (opcional)
 *         quantity:
 *           type: number
 *           description: Cantidad a ajustar (positivo para aumentar, negativo para disminuir)
 *         reason:
 *           type: string
 *           description: Razón del ajuste
 *     InventoryLogResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         product_id:
 *           type: string
 *         variant_id:
 *           type: string
 *         quantity:
 *           type: number
 *         movement:
 *           $ref: '#/components/schemas/InventoryMovement'
 *         reason:
 *           type: string
 *         reference_id:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /inventory-logs:
 *   post:
 *     tags: [Registro de Inventario]
 *     summary: Registrar un movimiento de inventario
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventoryLogCreate'
 *     responses:
 *       201:
 *         description: Movimiento registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventoryLogResponse'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos (requiere ADMIN)
 *   get:
 *     tags: [Registro de Inventario]
 *     summary: Obtener historial de movimientos de inventario
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: product_id
 *         schema:
 *           type: string
 *         description: Filtrar por ID de producto
 *       - in: query
 *         name: variant_id
 *         schema:
 *           type: string
 *         description: Filtrar por ID de variante
 *       - in: query
 *         name: movement
 *         schema:
 *           $ref: '#/components/schemas/InventoryMovement'
 *         description: Filtrar por tipo de movimiento
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Límite de registros por página
 *     responses:
 *       200:
 *         description: Historial de movimientos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/InventoryLogResponse'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos (requiere ADMIN)
 */

/**
 * @swagger
 * /inventory-logs/adjust:
 *   post:
 *     tags: [Registro de Inventario]
 *     summary: Realizar ajuste manual de stock
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventoryLogAdjust'
 *     responses:
 *       201:
 *         description: Ajuste realizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventoryLogResponse'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos (requiere ADMIN) 