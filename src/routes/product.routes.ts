import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { authMiddleware, checkRole } from "../middlewares/auth.middleware";
import { createMulterUploader } from "../utils/multer.utils";

const upload = createMulterUploader("products");
const router = Router();

// Crear producto
router.post(
  "/",
  authMiddleware,
  checkRole(["ADMIN"]),
  ProductController.create
);

// Listar productos
router.get("/", ProductController.list);

// Listar productos eliminados (soft deleted)
router.get(
  "/deleted",
  authMiddleware,
  checkRole(["ADMIN"]),
  ProductController.listDeleted
);

// Contar productos
router.get("/count", ProductController.getCount);

// Obtener producto por slug (público)
router.get("/slug/:slug", ProductController.getBySlug);

// Obtener producto por ID o SKU
router.get("/:id", ProductController.getById);

// Actualizar producto
router.patch(
  "/:id",
  authMiddleware,
  checkRole(["ADMIN"]),
  ProductController.update
);

// Activar producto
router.patch(
  "/:id/activate",
  authMiddleware,
  checkRole(["ADMIN"]),
  ProductController.activate
);

// Desactivar producto
router.patch(
  "/:id/deactivate",
  authMiddleware,
  checkRole(["ADMIN"]),
  ProductController.deactivate
);

// Eliminar producto (soft delete)
router.delete(
  "/:id",
  authMiddleware,
  checkRole(["ADMIN"]),
  ProductController.softDelete
);

// Restaurar producto eliminado
router.patch(
  "/:id/restore",
  authMiddleware,
  checkRole(["ADMIN"]),
  ProductController.restore
);

// Eliminar producto permanentemente
router.delete(
  "/:id/permanent",
  authMiddleware,
  checkRole(["ADMIN"]),
  ProductController.permanentDelete
);

// Subir imagen
router.post(
  "/:id/images",
  authMiddleware,
  checkRole(["ADMIN"]),
  upload.single("image"),
  ProductController.uploadImage
);

// Eliminar imagen
router.delete(
  "/:id/images/:imageId",
  authMiddleware,
  checkRole(["ADMIN"]),
  ProductController.removeImage
);

// Listar productos activos (público)
router.get("/active", ProductController.listActive);

export default router;