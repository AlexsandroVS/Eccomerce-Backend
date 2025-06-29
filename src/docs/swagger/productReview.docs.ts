/**
 * @swagger
 * tags:
 *   - name: Reseñas de Productos
 *     description: Gestión de reseñas y calificaciones de productos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductReviewCreate:
 *       type: object
 *       required: [product_id, rating]
 *       properties:
 *         product_id:
 *           type: string
 *           description: ID del producto
 *         rating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *           description: Calificación del 1 al 5
 *         comment:
 *           type: string
 *           description: Comentario de la reseña
 *     ProductReviewResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         product_id:
 *           type: string
 *         user_id:
 *           type: string
 *         rating:
 *           type: number
 *         comment:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *     ProductReviewAverage:
 *       type: object
 *       properties:
 *         product_id:
 *           type: string
 *         average_rating:
 *           type: number
 *         total_reviews:
 *           type: number
 *         rating_distribution:
 *           type: object
 *           properties:
 *             "1":
 *               type: number
 *             "2":
 *               type: number
 *             "3":
 *               type: number
 *             "4":
 *               type: number
 *             "5":
 *               type: number
 */

/**
 * @swagger
 * /product-reviews:
 *   post:
 *     tags: [Reseñas de Productos]
 *     summary: Crear una nueva reseña de producto
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductReviewCreate'
 *     responses:
 *       201:
 *         description: Reseña creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductReviewResponse'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       409:
 *         description: Ya existe una reseña para este producto por este usuario
 */

/**
 * @swagger
 * /product-reviews/{product_id}:
 *   get:
 *     tags: [Reseñas de Productos]
 *     summary: Obtener todas las reseñas de un producto
 *     parameters:
 *       - in: path
 *         name: product_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
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
 *           default: 10
 *         description: Límite de reseñas por página
 *       - in: query
 *         name: rating
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         description: Filtrar por calificación específica
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [newest, oldest, highest, lowest]
 *           default: newest
 *         description: Ordenar reseñas
 *     responses:
 *       200:
 *         description: Lista de reseñas del producto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProductReviewResponse'
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
 *       404:
 *         description: Producto no encontrado
 */

/**
 * @swagger
 * /product-reviews/{product_id}/average:
 *   get:
 *     tags: [Reseñas de Productos]
 *     summary: Obtener estadísticas de reseñas de un producto
 *     parameters:
 *       - in: path
 *         name: product_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Estadísticas de reseñas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductReviewAverage'
 *       404:
 *         description: Producto no encontrado
 */ 