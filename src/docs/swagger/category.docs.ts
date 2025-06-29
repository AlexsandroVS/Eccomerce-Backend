/**
 * @swagger
 * tags:
 *   - name: Categorías
 *     description: Gestión de categorías de productos
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     tags: [Categorías]
 *     summary: Crear una categoría
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, slug]
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               parent_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Categoría creada
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     tags: [Categorías]
 *     summary: Listar categorías activas
 *     responses:
 *       200:
 *         description: Lista de categorías
 */

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     tags: [Categorías]
 *     summary: Eliminar lógicamente una categoría
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoría desactivada
 */
