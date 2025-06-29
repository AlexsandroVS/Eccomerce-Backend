import { Router } from 'express';
import { DesignTemplateController } from '../controllers/designTemplate.controller';
import { authMiddleware, checkRole } from '../middlewares/auth.middleware';

const router = Router();

// Crear nuevo template (solo ADMIN o DESIGNER)
router.post(
  '/',
  authMiddleware,
  checkRole(['ADMIN', 'DESIGNER']),
  DesignTemplateController.create
);

// Actualizar template (solo ADMIN o DESIGNER)
router.patch(
  '/:id',
  authMiddleware,
  checkRole(['ADMIN', 'DESIGNER']),
  DesignTemplateController.update
);

// Obtener template por slug (público)
router.get('/slug/:slug', DesignTemplateController.getBySlug);

// Listar todos los templates activos (público)
router.get('/', DesignTemplateController.list);

// Eliminar lógicamente un template (ADMIN)
router.delete(
  '/:id',
  authMiddleware,
  checkRole(['ADMIN']),
  DesignTemplateController.softDelete
);

export default router;
