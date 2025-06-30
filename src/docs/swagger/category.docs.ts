/**
 * @swagger
 * tags:
 *   - name: Categorías
 *     description: Gestión completa de categorías de productos con soporte para jerarquías
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único de la categoría
 *           example: 1
 *         name:
 *           type: string
 *           description: Nombre de la categoría
 *           example: "Muebles de Oficina"
 *         slug:
 *           type: string
 *           description: URL amigable de la categoría
 *           example: "muebles-oficina"
 *         parent_id:
 *           type: integer
 *           nullable: true
 *           description: ID de la categoría padre (para jerarquías)
 *           example: null
 *         is_active:
 *           type: boolean
 *           description: Estado activo de la categoría
 *           example: true
 *         deleted_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Fecha de eliminación (soft delete)
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *         attributes_normalized:
 *           type: object
 *           description: Atributos normalizados para filtros
 *           example:
 *             colors: ["Negro", "Blanco", "Gris"]
 *             materials: ["Madera", "Metal", "Plástico"]
 *         parent:
 *           $ref: '#/components/schemas/Category'
 *         children:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Category'
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
 *     
 *     CategoryCreateRequest:
 *       type: object
 *       required: [name, slug]
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 255
 *           example: "Muebles de Oficina"
 *         slug:
 *           type: string
 *           pattern: '^[a-z0-9-]+$'
 *           example: "muebles-oficina"
 *         parent_id:
 *           type: integer
 *           nullable: true
 *           description: ID de la categoría padre
 *           example: null
 *         attributes_normalized:
 *           type: object
 *           description: Atributos para filtros (colores, materiales, etc.)
 *           example:
 *             colors: ["Negro", "Blanco", "Gris"]
 *             materials: ["Madera", "Metal"]
 *     
 *     CategoryUpdateRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 255
 *         slug:
 *           type: string
 *           pattern: '^[a-z0-9-]+$'
 *         parent_id:
 *           type: integer
 *           nullable: true
 *         attributes_normalized:
 *           type: object
 *     
 *     CategoryResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Category'
 *     
 *     CategoryListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Category'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     tags: [Categorías]
 *     summary: Crear una nueva categoría
 *     description: Crea una categoría nueva con soporte para jerarquías y atributos normalizados para filtros.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryCreateRequest'
 *           examples:
 *             main_category:
 *               summary: Categoría Principal
 *               value:
 *                 name: "Muebles de Oficina"
 *                 slug: "muebles-oficina"
 *                 attributes_normalized:
 *                   colors: ["Negro", "Blanco", "Gris"]
 *                   materials: ["Madera", "Metal", "Plástico"]
 *             subcategory:
 *               summary: Subcategoría
 *               value:
 *                 name: "Sillas de Oficina"
 *                 slug: "sillas-oficina"
 *                 parent_id: 1
 *                 attributes_normalized:
 *                   colors: ["Negro", "Gris"]
 *                   features: ["Giratoria", "Ajustable"]
 *     responses:
 *       201:
 *         description: Categoría creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
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
 *         description: Slug ya existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 *   get:
 *     tags: [Categorías]
 *     summary: Listar categorías activas
 *     description: Lista todas las categorías activas con soporte para jerarquías. Endpoint público.
 *     parameters:
 *       - in: query
 *         name: includeInactive
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Incluir categorías inactivas
 *       - in: query
 *         name: parent_id
 *         schema:
 *           type: integer
 *         description: Filtrar por categoría padre
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
 *         description: Lista de categorías obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryListResponse'
 */

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     tags: [Categorías]
 *     summary: Obtener categoría por ID
 *     description: Obtiene una categoría específica con sus relaciones (padre, hijos, productos).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría
 *         example: 1
 *     responses:
 *       200:
 *         description: Categoría encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
 *       404:
 *         description: Categoría no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 *   patch:
 *     tags: [Categorías]
 *     summary: Actualizar categoría
 *     description: Actualiza una categoría existente. Solo se actualizan los campos proporcionados.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryUpdateRequest'
 *     responses:
 *       200:
 *         description: Categoría actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
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
 *         description: Categoría no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Slug ya existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 *   delete:
 *     tags: [Categorías]
 *     summary: Eliminar categoría (soft delete)
 *     description: Realiza un soft delete de la categoría. Las subcategorías y productos asociados se mantienen.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría
 *     responses:
 *       200:
 *         description: Categoría eliminada exitosamente
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
 *                   example: "Categoría eliminada exitosamente"
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Categoría no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /categories/{id}/activate:
 *   patch:
 *     tags: [Categorías]
 *     summary: Activar categoría
 *     description: Activa una categoría previamente desactivada
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría
 *     responses:
 *       200:
 *         description: Categoría activada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Categoría no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /categories/{id}/deactivate:
 *   patch:
 *     tags: [Categorías]
 *     summary: Desactivar categoría
 *     description: Desactiva una categoría (no la elimina)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría
 *     responses:
 *       200:
 *         description: Categoría desactivada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Categoría no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /categories/{id}/restore:
 *   patch:
 *     tags: [Categorías]
 *     summary: Restaurar categoría eliminada
 *     description: Restaura una categoría que fue eliminada (soft delete)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría
 *     responses:
 *       200:
 *         description: Categoría restaurada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Categoría no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /categories/{id}/products:
 *   get:
 *     tags: [Categorías]
 *     summary: Obtener productos de una categoría
 *     description: Lista todos los productos activos de una categoría específica
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría
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
 *         description: Productos de la categoría
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductListResponse'
 *       404:
 *         description: Categoría no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
