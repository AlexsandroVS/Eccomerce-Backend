/**
 * @swagger
 * tags:
 *   - name: Health Check
 *     description: Endpoints para verificar el estado de los servicios
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     HealthStatus:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [OK, DEGRADED, ERROR]
 *           description: Estado general del sistema
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: Timestamp del check
 *         services:
 *           type: object
 *           properties:
 *             redis:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [healthy, unhealthy]
 *                 provider:
 *                   type: string
 *                   example: "upstash"
 *             postgres:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [healthy, unhealthy]
 *             mongo:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [healthy, unhealthy]
 *     RedisHealthStatus:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [OK, ERROR]
 *         latency:
 *           type: string
 *           example: "15ms"
 *         test:
 *           type: string
 *           enum: [passed, failed]
 *         provider:
 *           type: string
 *           example: "upstash"
 *         timestamp:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /health:
 *   get:
 *     tags: [Health Check]
 *     summary: Verificar el estado general de todos los servicios
 *     description: Verifica la conectividad de Redis, PostgreSQL y MongoDB
 *     responses:
 *       200:
 *         description: Todos los servicios están funcionando correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthStatus'
 *       503:
 *         description: Uno o más servicios no están disponibles
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthStatus'
 */

/**
 * @swagger
 * /health/redis:
 *   get:
 *     tags: [Health Check]
 *     summary: Verificar específicamente el estado de Redis
 *     description: Realiza una prueba de latencia y conectividad a Redis (Upstash)
 *     responses:
 *       200:
 *         description: Redis está funcionando correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RedisHealthStatus'
 *       503:
 *         description: Redis no está disponible
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RedisHealthStatus'
 */ 