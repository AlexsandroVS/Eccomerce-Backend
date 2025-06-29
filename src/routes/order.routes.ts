import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { authMiddleware, checkRole } from "../middlewares/auth.middleware";

const router = Router();

// Crear orden (cliente autenticado)
router.post("/", authMiddleware, OrderController.create);

// Obtener orden por ID (autenticado)
router.get("/:id", authMiddleware, OrderController.getById);

// Listar órdenes del usuario autenticado
router.get("/", authMiddleware, OrderController.listByUser);

// Listar todas las órdenes (ADMIN)
router.get(
  "/admin/all",
  authMiddleware,
  checkRole(["ADMIN"]),
  OrderController.listAll
);

// Cancelar orden (ADMIN o futura lógica para cliente)
router.post(
  "/:id/cancel",
  authMiddleware,
  checkRole(["ADMIN"]),
  OrderController.cancel
);

export default router;
