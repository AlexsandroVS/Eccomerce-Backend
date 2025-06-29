import { Router } from 'express';
import { WishlistController } from '../controllers/wishlist.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authMiddleware, WishlistController.add);
router.delete('/', authMiddleware, WishlistController.remove);
router.get('/', authMiddleware, WishlistController.get);

export default router;
