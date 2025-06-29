import { Router } from 'express';
import { InventoryLogController } from '../controllers/inventoryLog.controller';
import { authMiddleware, checkRole } from '../middlewares/auth.middleware';

const router = Router();

// Registrar movimiento manual
router.post(
  '/',
  authMiddleware,
  checkRole(['ADMIN']),
  InventoryLogController.create
);

// Ajuste manual de stock (puede aumentar o disminuir)
router.post(
  '/adjust',
  authMiddleware,
  checkRole(['ADMIN']),
  InventoryLogController.adjust
);

// Ver historial por producto/variante
router.get(
  '/',
  authMiddleware,
  checkRole(['ADMIN']),
  InventoryLogController.findAll
);

export default router;
