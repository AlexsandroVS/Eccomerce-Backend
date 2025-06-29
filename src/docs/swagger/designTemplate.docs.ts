/**
 * @swagger
 * tags:
 *   - name: Plantillas de Diseño
 *     description: Gestión de plantillas de diseño para productos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DesignTemplateProductInput:
 *       type: object
 *       properties:
 *         product_id:
 *           type: string
 *           description: ID del producto
 *         quantity:
 *           type: number
 *           description: Cantidad del producto
 *         is_optional:
 *           type: boolean
 *           description: Si el producto es opcional
 *         notes:
 *           type: string
 *           description: Notas adicionales
 *     DesignTemplateCreate:
 *       type: object
 *       required: [name, products]
 *       properties:
 *         name:
 *           type: string
 *           description: Nombre de la plantilla
 *         slug:
 *           type: string
 *           description: Slug único para la URL
 *         description:
 *           type: string
 *           description: Descripción de la plantilla
 *         room_type:
 *           type: string
 *           description: Tipo de habitación
 *         style:
 *           type: string
 *           description: Estilo de la plantilla
 *         discount:
 *           type: number
 *           description: Descuento aplicado
 *         cover_image_url:
 *           type: string
 *           description: URL de la imagen de portada
 *         featured:
 *           type: boolean
 *           description: Si la plantilla es destacada
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DesignTemplateProductInput'
 *     DesignTemplateResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         slug:
 *           type: string
 *         description:
 *           type: string
 *         room_type:
 *           type: string
 *         style:
 *           type: string
 *         total_price:
 *           type: number
 *         discount:
 *           type: number
 *         featured:
 *           type: boolean
 *         products:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: string
 *               quantity:
 *                 type: number
 *               is_optional:
 *                 type: boolean
 *               notes:
 *                 type: string
 */

/**
 * @swagger
 * /design-templates:
 *   post:
 *     tags: [Plantillas de Diseño]
 *     summary: Crear una nueva plantilla de diseño
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DesignTemplateCreate'
 *     responses:
 *       201:
 *         description: Plantilla creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DesignTemplateResponse'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos (requiere ADMIN o DESIGNER)
 *   get:
 *     tags: [Plantillas de Diseño]
 *     summary: Listar todas las plantillas activas
 *     parameters:
 *       - in: query
 *         name: room_type
 *         schema:
 *           type: string
 *         description: Filtrar por tipo de habitación
 *       - in: query
 *         name: style
 *         schema:
 *           type: string
 *         description: Filtrar por estilo
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *         description: Filtrar por plantillas destacadas
 *     responses:
 *       200:
 *         description: Lista de plantillas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DesignTemplateResponse'
 */

/**
 * @swagger
 * /design-templates/{id}:
 *   patch:
 *     tags: [Plantillas de Diseño]
 *     summary: Actualizar una plantilla de diseño
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la plantilla
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DesignTemplateCreate'
 *     responses:
 *       200:
 *         description: Plantilla actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DesignTemplateResponse'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos (requiere ADMIN o DESIGNER)
 *       404:
 *         description: Plantilla no encontrada
 *   delete:
 *     tags: [Plantillas de Diseño]
 *     summary: Eliminar lógicamente una plantilla
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la plantilla
 *     responses:
 *       200:
 *         description: Plantilla eliminada exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos (requiere ADMIN)
 *       404:
 *         description: Plantilla no encontrada
 */

/**
 * @swagger
 * /design-templates/slug/{slug}:
 *   get:
 *     tags: [Plantillas de Diseño]
 *     summary: Obtener plantilla por slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug de la plantilla
 *     responses:
 *       200:
 *         description: Plantilla encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DesignTemplateResponse'
 *       404:
 *         description: Plantilla no encontrada
 */ 