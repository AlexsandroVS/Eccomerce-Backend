import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware, checkRole } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);
router.use(checkRole(['ADMIN']));

router.get('/', UserController.list);
router.get('/:id', UserController.getById);
router.post('/', UserController.create);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.delete);

export default router; 