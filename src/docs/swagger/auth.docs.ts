/**
 * @swagger
 * tags:
 *   - name: Autenticación
 *     description: Registro, login, perfil y cierre de sesión
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Autenticación]
 *     summary: Registrar un nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, full_name, role]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               full_name:
 *                 type: string
 *               phone:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [ADMIN, CUSTOMER, VENDOR]
 *     responses:
 *       201:
 *         description: Usuario registrado
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Autenticación]
 *     summary: Iniciar sesión
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sesión iniciada con token en cookie
 */

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     tags: [Autenticación]
 *     summary: Obtener datos del usuario logueado
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Autenticación]
 *     summary: Cerrar sesión y eliminar cookie
 *     responses:
 *       200:
 *         description: Sesión cerrada correctamente
 */
