import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { authMiddleware, checkRole } from '../middlewares/auth.middleware';

const router = Router();

// Solo administradores
router.post('/', authMiddleware, checkRole(['ADMIN']), CategoryController.create);
router.patch('/:id/deactivate', authMiddleware, checkRole(['ADMIN']), CategoryController.deactivate);
router.patch('/:id/activate', authMiddleware, checkRole(['ADMIN']), CategoryController.activate);
router.delete('/:id', authMiddleware, checkRole(['ADMIN']), CategoryController.delete);


// Nuevo endpoint público
router.get('/check-slug', CategoryController.checkSlug);

// Públicas
router.get('/', CategoryController.findAll);
router.get('/:id', CategoryController.findById);

export default router;