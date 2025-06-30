import { Router } from 'express';
import { listUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/user.controller';
import { authMiddleware, checkRole } from '../middlewares/auth.middleware';

const router = Router();

const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.use(authMiddleware);
router.use(checkRole(['ADMIN']));

router.get('/', asyncHandler(listUsers));
router.get('/:id', asyncHandler(getUserById));
router.post('/', asyncHandler(createUser));
router.put('/:id', asyncHandler(updateUser));
router.delete('/:id', asyncHandler(deleteUser));

export default router; 