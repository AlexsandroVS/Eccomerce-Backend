/**
 * @swagger
 * tags:
 *   - name: Pagos
 *     description: Gestión de pagos con Stripe - PaymentIntents, webhooks y reembolsos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PaymentStatus:
 *       type: string
 *       enum: [pending, processing, succeeded, failed, canceled, refunded]
 *       description: Estado del pago en Stripe
 *       example: "succeeded"
 *     
 *     Payment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único del pago
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         order_id:
 *           type: string
 *           format: uuid
 *           description: ID de la orden asociada
 *           example: "123e4567-e89b-12d3-a456-426614174001"
 *         gateway:
 *           type: string
 *           description: Pasarela de pago utilizada
 *           example: "stripe"
 *         gateway_id:
 *           type: string
 *           description: ID del pago en la pasarela
 *           example: "pi_3OqX8X2eZvKYlo2C1gQZvKYl"
 *         amount:
 *           type: number
 *           format: float
 *           description: Monto del pago
 *           example: 299.99
 *         currency:
 *           type: string
 *           description: Moneda del pago
 *           example: "PEN"
 *         status:
 *           $ref: '#/components/schemas/PaymentStatus'
 *         metadata:
 *           type: object
 *           description: Metadatos adicionales del pago
 *           example:
 *             client_secret: "pi_3OqX8X2eZvKYlo2C1gQZvKYl_secret_..."
 *             order_id: "123e4567-e89b-12d3-a456-426614174001"
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *         order:
 *           $ref: '#/components/schemas/Order'
 *     
 *     PaymentCreateRequest:
 *       type: object
 *       required: [orderId, amount, currency]
 *       properties:
 *         orderId:
 *           type: string
 *           format: uuid
 *           description: ID de la orden a pagar
 *           example: "123e4567-e89b-12d3-a456-426614174001"
 *         amount:
 *           type: number
 *           minimum: 0.01
 *           description: Monto a pagar
 *           example: 299.99
 *         currency:
 *           type: string
 *           pattern: '^[A-Z]{3}$'
 *           description: Código de moneda ISO 4217
 *           example: "PEN"
 *         customerEmail:
 *           type: string
 *           format: email
 *           description: Email del cliente para recibo
 *           example: "cliente@ejemplo.com"
 *         metadata:
 *           type: object
 *           description: Metadatos adicionales
 *           example:
 *             source: "web"
 *             user_agent: "Mozilla/5.0..."
 *     
 *     PaymentCreateResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             payment:
 *               $ref: '#/components/schemas/Payment'
 *             clientSecret:
 *               type: string
 *               description: Client secret para confirmar el pago en el frontend
 *               example: "pi_3OqX8X2eZvKYlo2C1gQZvKYl_secret_..."
 *             paymentIntentId:
 *               type: string
 *               description: ID del PaymentIntent en Stripe
 *               example: "pi_3OqX8X2eZvKYlo2C1gQZvKYl"
 *     
 *     PaymentRefundRequest:
 *       type: object
 *       required: [paymentIntentId]
 *       properties:
 *         paymentIntentId:
 *           type: string
 *           description: ID del PaymentIntent a reembolsar
 *           example: "pi_3OqX8X2eZvKYlo2C1gQZvKYl"
 *         amount:
 *           type: number
 *           minimum: 0.01
 *           description: Monto a reembolsar (opcional, si no se especifica se reembolsa todo)
 *           example: 150.00
 *     
 *     Refund:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID del reembolso en Stripe
 *           example: "re_3OqX8X2eZvKYlo2C1gQZvKYl"
 *         amount:
 *           type: integer
 *           description: Monto reembolsado en centavos
 *           example: 15000
 *         currency:
 *           type: string
 *           description: Moneda del reembolso
 *           example: "PEN"
 *         status:
 *           type: string
 *           enum: [succeeded, pending, failed]
 *           description: Estado del reembolso
 *           example: "succeeded"
 *         created:
 *           type: integer
 *           description: Timestamp de creación
 *           example: 1640995200
 *     
 *     PaymentListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Payment'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 *     
 *     PaymentResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Payment'
 */

/**
 * @swagger
 * /payments/create:
 *   post:
 *     tags: [Pagos]
 *     summary: Crear PaymentIntent
 *     description: Crea un PaymentIntent en Stripe para procesar un pago. Retorna el client_secret necesario para confirmar el pago en el frontend.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentCreateRequest'
 *           examples:
 *             payment_example:
 *               summary: Pago de orden
 *               value:
 *                 orderId: "123e4567-e89b-12d3-a456-426614174001"
 *                 amount: 299.99
 *                 currency: "PEN"
 *                 customerEmail: "cliente@ejemplo.com"
 *                 metadata:
 *                   source: "web"
 *                   user_agent: "Mozilla/5.0..."
 *     responses:
 *       201:
 *         description: PaymentIntent creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentCreateResponse'
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
 *         description: Orden no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /payments/webhook:
 *   post:
 *     tags: [Pagos]
 *     summary: Webhook de Stripe
 *     description: Endpoint para recibir webhooks de Stripe. Procesa eventos de pagos exitosos, fallidos y reembolsos. No requiere autenticación.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Evento de Stripe (estructura variable según el tipo de evento)
 *     responses:
 *       200:
 *         description: Webhook procesado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 received:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Webhook inválido o error de verificación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /payments/refund:
 *   post:
 *     tags: [Pagos]
 *     summary: Reembolsar pago
 *     description: Procesa un reembolso parcial o total de un pago. Actualiza automáticamente el estado de la orden.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentRefundRequest'
 *           examples:
 *             full_refund:
 *               summary: Reembolso total
 *               value:
 *                 paymentIntentId: "pi_3OqX8X2eZvKYlo2C1gQZvKYl"
 *             partial_refund:
 *               summary: Reembolso parcial
 *               value:
 *                 paymentIntentId: "pi_3OqX8X2eZvKYlo2C1gQZvKYl"
 *                 amount: 150.00
 *     responses:
 *       200:
 *         description: Reembolso procesado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Refund'
 *       400:
 *         description: Datos de entrada inválidos o error en el reembolso
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
 *         description: Pago no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /payments/order/{orderId}:
 *   get:
 *     tags: [Pagos]
 *     summary: Obtener pagos de una orden
 *     description: Lista todos los pagos asociados a una orden específica.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la orden
 *         example: "123e4567-e89b-12d3-a456-426614174001"
 *     responses:
 *       200:
 *         description: Pagos de la orden obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Payment'
 *       400:
 *         description: orderId inválido
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
 */

/**
 * @swagger
 * /payments/{paymentId}:
 *   get:
 *     tags: [Pagos]
 *     summary: Obtener pago específico
 *     description: Obtiene información detallada de un pago específico incluyendo la orden asociada.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del pago
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Pago obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentResponse'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Pago no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /payments:
 *   get:
 *     tags: [Pagos]
 *     summary: Listar todos los pagos (Admin)
 *     description: Lista todos los pagos del sistema con paginación. Requiere permisos de administrador.
 *     security:
 *       - cookieAuth: []
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
 *     responses:
 *       200:
 *         description: Lista de pagos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentListResponse'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */ 